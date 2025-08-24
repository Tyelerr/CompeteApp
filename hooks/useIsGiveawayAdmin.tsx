// hooks/useIsGiveawayAdmin.ts
import { useEffect, useState } from "react";
import { useContextAuth } from "../context/ContextAuth";
// ⬇️ Adjust this import if your Supabase client lives elsewhere
import { supabase } from "../ApiSupabase";

export default function useIsGiveawayAdmin() {
  const { user, isLogged } = useContextAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!isLogged || !user?.id) {
          mounted && setIsAdmin(false);
          return;
        }

        // Hard allow master-admins
        if (user.role === "master-administrator") {
          mounted && setIsAdmin(true);
          return;
        }

        // Otherwise ask Postgres
        const { data, error } = await supabase.rpc("is_giveaway_admin", {
          uid: user.id,
        });
        if (error) throw error;
        mounted && setIsAdmin(Boolean(data));
      } catch {
        mounted && setIsAdmin(false);
      } finally {
        mounted && setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isLogged, user?.id, user?.role]);

  return { isAdmin, loading };
}
