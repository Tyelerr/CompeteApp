// ApiSupabase/AdminAuthHelpers.ts
import { supabase } from "./supabase";

/** Create a user via Supabase Auth (client-side) */
export async function AdminCreateUser(
  email: string,
  password: string,
  user_name: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { user_name } },
  });
  return { data, error };
}

/** Right after sign-up, find the profile row so we know the UUID */
export async function FindProfileIdByEmail(email: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  return { data, error };
}
