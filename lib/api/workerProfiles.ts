import { supabase } from '../supabase';

export type WorkerVerificationStatus = 'pending' | 'verified' | 'rejected';

export type WorkerProfile = {
  id: string;
  skills: string[];
  bio: string | null;
  years_experience: number | null;
  hourly_rate: number | null;
  per_job_rate: number | null;
  availability: Record<string, unknown>;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  verification_status: WorkerVerificationStatus;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
};

export type CreateWorkerProfileInput = {
  skills: string[];
  bio?: string;
  years_experience?: number;
  hourly_rate?: number;
  per_job_rate?: number;
  availability?: Record<string, unknown>;
  latitude?: number;
  longitude?: number;
  address?: string;
};

/** Fetches the signed-in worker's own worker_profiles row, if any. */
export async function getMyWorkerProfile(): Promise<{
  success: boolean;
  data?: WorkerProfile | null;
  error?: string;
}> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { success: false, error: 'Not signed in.' };
  }

  const { data, error } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('id', auth.user.id)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as WorkerProfile | null };
}

export async function getWorkerProfile(
  workerId: string
): Promise<{ success: boolean; data?: WorkerProfile; error?: string }> {
  const { data, error } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('id', workerId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as WorkerProfile };
}

/** Creates the worker_profiles row for the signed-in user (upserts if it already exists). */
export async function createWorkerProfile(
  input: CreateWorkerProfileInput
): Promise<{ success: boolean; error?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { success: false, error: 'Not signed in.' };
  }

  const { error } = await supabase
    .from('worker_profiles')
    .upsert({ id: auth.user.id, ...input }, { onConflict: 'id' });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateWorkerProfile(
  patch: Partial<CreateWorkerProfileInput>
): Promise<{ success: boolean; error?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { success: false, error: 'Not signed in.' };
  }

  const { error } = await supabase.from('worker_profiles').update(patch).eq('id', auth.user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
