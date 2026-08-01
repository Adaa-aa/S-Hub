import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

/**
 * Build the OAuth redirect URL for the current platform.
 *
 * - Native: uses the app scheme (e.g. "shub://") via expo-linking.
 * - Web: falls back to the current window origin + "/auth/callback".
 */
export const redirectTo =
  Platform.OS === 'web'
    ? `${window.location.origin}/auth/callback`
    : Linking.createURL('/auth/callback');

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