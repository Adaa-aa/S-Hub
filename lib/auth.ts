import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

/**
 * Build a redirect URL for the current platform pointing at the given
 * in-app path.
 *
 * - Native: uses the app scheme (e.g. "shub://") via expo-linking.
 *   In Expo Go this produces exp://IP:PORT/--/<path>
 * - Web: falls back to the current window origin + "/<path>".
 *
 * Must be added to the Supabase project's redirect URL allow-list
 * (auth.additional_redirect_urls) or Supabase will silently fall back to
 * the project's default Site URL instead of honoring this.
 */
export function buildRedirectUrl(path: string): string {
  return Platform.OS === 'web'
    ? `${window.location.origin}/${path}`
    : Linking.createURL(path);
}

/** OAuth redirect URL — see buildRedirectUrl. */
export const redirectTo = buildRedirectUrl('auth/callback');

/**
 * Sign in with an OAuth provider (Google or Apple).
 *
 * Flow:
 *  1. Ask Supabase for the provider OAuth URL (without auto-redirecting).
 *  2. Open the system browser / in-app browser session.
 *  3. After the user authenticates, the browser redirects back to the app
 *     with `access_token`, `refresh_token`, etc. in the URL fragment/query.
 *  4. Parse those tokens and set the Supabase session.
 *
 * @param provider 'google' | 'apple'
 * @returns `{ success: boolean; error?: string }`
 */
export async function signInWithOAuthProvider(
  provider: 'google' | 'apple'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (res.type !== 'success' || !res.url) {
      return { success: false, error: 'Authentication was cancelled.' };
    }

    // The redirect URL contains the tokens in the URL fragment (#) or query (?).
    const url = new URL(res.url);
    const params = new URLSearchParams(
      url.hash.startsWith('#') ? url.hash.substring(1) : url.search
    );

    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (!access_token || !refresh_token) {
      return { success: false, error: 'Failed to retrieve authentication tokens.' };
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) {
      return { success: false, error: sessionError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'Something went wrong during authentication.' };
  }
}

/**
 * Create an account with email + password, tagging the new user's
 * metadata with `full_name` and `role` so the `handle_new_user` DB
 * trigger creates the matching `profiles` row with the right role.
 */
export async function signUpWithPassword({
  fullName,
  email,
  password,
  role,
}: {
  fullName: string;
  email: string;
  password: string;
  role: 'customer' | 'worker';
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'Something went wrong creating your account.' };
  }
}

/** Sign in with email + password. */
export async function signInWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'Something went wrong signing in.' };
  }
}

/** Sign out the current user. */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'Something went wrong signing out.' };
  }
}