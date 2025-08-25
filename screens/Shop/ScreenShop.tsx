// /screens/Shop/ScreenShop.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { supabase } from "../../ApiSupabase/supabase";
import {
  BaseColors,
  BasePaddingsMargins,
  TextsSizes,
} from "../../hooks/Template";

// Big tabs UI (same as Home)
import ShopSubNavigation, { ShopTab } from "./ShopSubNavigation";

// ✅ NEW: create-giveaway modal
import ModalCreateGiveaway from "./ModalCreateGiveaway";

type TShopTab = "shop" | "giveaways" | "manage";
type RouteParams = { initialTab?: TShopTab };

type GiveawayPublic = {
  id: string;
  title: string;
  image_url: string | null;
  prize_value: number | string | null;
  entries_count: number;
  end_at: string | null;
  status: "draft" | "scheduled" | "active" | "paused" | "ended" | "archived";
  created_at?: string | null;
};

type VRow = GiveawayPublic & {
  selection_method?: "random" | "judged" | "point_based";
  number_of_winners?: number | null;
  draw_mode?: "auto_on_end" | "manual";
};

type Metrics = {
  active_count: number;
  total_entries: number;
  total_prize_value: number;
};

// ---- Gate: master admin or is_giveaway_admin(uid) ----
async function canManageGiveaways(): Promise<boolean> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return false;

  if ((auth?.user?.user_metadata as any)?.role === "master-administrator")
    return true;

  try {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", uid)
      .maybeSingle();
    if (data?.role === "master-administrator") return true;
  } catch {}

  try {
    const { data, error } = await supabase.rpc("is_giveaway_admin", { uid });
    if (!error && typeof data === "boolean") return data;
  } catch {}

  return false;
}

/* ---------- small UI helpers ---------- */
const StatChip = ({ label, value }: { label: string; value: string }) => (
  <View
    style={{
      flex: 1,
      minWidth: 110,
      backgroundColor: BaseColors.dark,
      borderWidth: 1,
      borderColor: BaseColors.secondary,
      borderRadius: 12,
      padding: 14,
      marginRight: 10,
      marginBottom: 10,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 4,
      }}
    >
      {value}
    </Text>
    <Text style={{ color: BaseColors.othertexts }}>{label}</Text>
  </View>
);

const SectionTitle = ({ label }: { label: string }) => (
  <Text
    style={{ color: "#fff", fontWeight: "800", fontSize: 18, marginBottom: 10 }}
  >
    {label}
  </Text>
);

const GiveawayPublicCard = ({
  row,
  onEnter,
}: {
  row: GiveawayPublic;
  onEnter: (id: string) => void;
}) => {
  const prize = Number(row.prize_value || 0);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: BaseColors.secondary,
        borderRadius: 12,
        padding: BasePaddingsMargins.m15,
        marginBottom: BasePaddingsMargins.m15,
        backgroundColor: BaseColors.dark,
      }}
    >
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        {!!row.image_url && (
          <Image
            source={{ uri: row.image_url }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: BaseColors.secondary,
            }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
              fontSize: TextsSizes.h5 ?? 18,
              marginBottom: 2,
            }}
            numberOfLines={2}
          >
            {row.title}
          </Text>
          <Text style={{ color: BaseColors.othertexts }}>${prize} Value</Text>
          <Text style={{ color: BaseColors.othertexts, marginTop: 4 }}>
            {row.entries_count} total entries
          </Text>
        </View>
      </View>
      <View style={{ marginTop: BasePaddingsMargins.m15 }}>
        <TouchableOpacity
          onPress={() => onEnter(row.id)}
          style={{
            backgroundColor: BaseColors.primary,
            borderRadius: 10,
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Enter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ManageCard = ({ r, onPick }: { r: VRow; onPick: (r: VRow) => void }) => {
  const canPick = r.status === "ended" || r.draw_mode === "manual";
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: BaseColors.secondary,
        borderRadius: 12,
        padding: BasePaddingsMargins.m15,
        marginBottom: BasePaddingsMargins.m15,
        backgroundColor: BaseColors.dark,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            backgroundColor: BaseColors.contentSwitcherBackgroundCOlor,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: BaseColors.primary, fontWeight: "700" }}>
            {r.status.toUpperCase()}
          </Text>
        </View>
        <Text style={{ color: "#fff", fontWeight: "800" }}>
          ${Number(r.prize_value || 0)}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        {!!r.image_url && (
          <Image
            source={{ uri: r.image_url }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: BaseColors.secondary,
            }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
              fontSize: TextsSizes.h5 ?? 18,
            }}
            numberOfLines={2}
          >
            {r.title}
          </Text>
          <Text style={{ color: BaseColors.othertexts }}>
            {r.entries_count} entries
          </Text>
          {!!r.end_at && (
            <Text style={{ color: BaseColors.othertexts }}>
              Ends: {new Date(r.end_at).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>

      <View style={{ marginTop: BasePaddingsMargins.m15 }}>
        <TouchableOpacity
          onPress={() => canPick && onPick(r)}
          disabled={!canPick}
          style={{
            backgroundColor: canPick
              ? BaseColors.primary
              : BaseColors.secondary,
            borderRadius: 10,
            paddingVertical: 12,
            alignItems: "center",
            opacity: canPick ? 1 : 0.6,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Pick Winner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ---------- Screen ---------- */
export default function ScreenShop() {
  const route = useRoute<any>();
  const [tab, setTab] = useState<TShopTab>("giveaways");
  const [canManage, setCanManage] = useState<boolean | null>(null);

  // ✅ NEW: modal state
  const [showCreate, setShowCreate] = useState(false);

  // public
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<GiveawayPublic[]>([]);

  // manage
  const [mLoading, setMLoading] = useState(false);
  const [mRows, setMRows] = useState<VRow[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  // gate
  useEffect(() => {
    (async () => setCanManage(await canManageGiveaways()))();
  }, []);

  // allow external navigation to set initial tab
  useEffect(() => {
    const p = (route?.params ?? {}) as RouteParams;
    if (
      p.initialTab &&
      ["shop", "giveaways", "manage"].includes(p.initialTab)
    ) {
      setTab(p.initialTab as TShopTab);
    }
  }, [route?.params]);

  // load public giveaways
  const loadGiveaways = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("v_giveaways_with_counts")
        .select(
          "id,title,image_url,prize_value,entries_count,end_at,status,created_at"
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data as GiveawayPublic[]) ?? []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // load manage data (rows + metrics)
  const loadManage = useCallback(async () => {
    setMLoading(true);
    try {
      const m = await supabase.rpc("fn_giveaway_metrics");
      if (!m.error) setMetrics(m.data as Metrics);

      const { data, error } = await supabase
        .from("v_giveaways_with_counts")
        .select("*")
        .in("status", ["active", "ended"])
        .order("end_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      setMRows((data as VRow[]) ?? []);
    } catch (e) {
      console.log(e);
    } finally {
      setMLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "giveaways") loadGiveaways();
    if (tab === "manage" && canManage) loadManage();
  }, [tab, canManage, loadGiveaways, loadManage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadGiveaways();
    setRefreshing(false);
  }, [loadGiveaways]);

  // RPC: enter
  const enterGiveaway = async (id: string) => {
    const { error } = await supabase.rpc("fn_enter_giveaway", {
      p_giveaway_id: id,
    });
    if (error) {
      Alert.alert("Could not enter", error.message);
    } else {
      Alert.alert("You're in!", "Good luck 🎉");
      loadGiveaways();
    }
  };

  // RPC: pick winners
  const pickWinners = async (r: VRow) => {
    const n = Math.max(1, Number(r.number_of_winners || 1));
    Alert.alert("Pick Winners", `Draw ${n} winner${n > 1 ? "s" : ""}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: async () => {
          const { data, error } = await supabase.rpc("fn_pick_random_winners", {
            p_giveaway_id: r.id,
            p_n: n,
          });
          if (error) {
            Alert.alert("Error", error.message);
            return;
          }
          const winners = (data as any[]) || [];
          Alert.alert(
            "Winners picked",
            winners.length
              ? winners
                  .map(
                    (w: any, i: number) => `#${i + 1} • user_id: ${w.user_id}`
                  )
                  .join("\n")
              : "No eligible entries."
          );
          loadManage();
        },
      },
    ]);
  };

  /* ---------- BIG TABS like Home (ShopSubNavigation) ---------- */
  const toShopTab = (t: TShopTab): ShopTab =>
    t === "shop" ? "home" : t === "giveaways" ? "rewards" : "manage";

  const onTopTabChange = (t: ShopTab) => {
    if (t === "home") setTab("shop");
    else if (t === "rewards") setTab("giveaways");
    else if (t === "manage") setTab("manage");
  };

  // While gate loads, avoid flicker
  if (canManage === null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0c0c0c",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#0c0c0c",
          padding: BasePaddingsMargins.m15,
        }}
      >
        {/* Big top tabs (same look as Home) */}
        <ShopSubNavigation
          active={toShopTab(tab)}
          onChange={onTopTabChange}
          isMaster={!!canManage}
        />

        {/* SHOP placeholder */}
        {tab === "shop" && (
          <View
            style={{
              borderWidth: 1,
              borderColor: BaseColors.secondary,
              borderRadius: 12,
              padding: BasePaddingsMargins.m15,
              backgroundColor: BaseColors.dark,
              marginTop: BasePaddingsMargins.m15,
            }}
          >
            <Text style={{ color: BaseColors.othertexts }}>
              Shop content goes here.
            </Text>
          </View>
        )}

        {/* GIVEAWAYS (public) */}
        {tab === "giveaways" && (
          <FlatList
            data={items}
            keyExtractor={(g) => g.id}
            renderItem={({ item }) => (
              <GiveawayPublicCard row={item} onEnter={enterGiveaway} />
            )}
            ListEmptyComponent={
              !loading ? (
                <View
                  style={{
                    paddingVertical: 40,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: BaseColors.secondary,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}
                  >
                    More giveaways coming soon
                  </Text>
                  <Text style={{ color: BaseColors.othertexts, marginTop: 6 }}>
                    Stay tuned for exciting new prizes and opportunities!
                  </Text>
                </View>
              ) : null
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
              paddingBottom: 40,
              marginTop: BasePaddingsMargins.m15,
            }}
          />
        )}

        {/* MANAGE (admin only) */}
        {tab === "manage" && !!canManage && (
          <FlatList
            data={mRows}
            keyExtractor={(r) => r.id}
            renderItem={({ item }) => (
              <ManageCard r={item} onPick={pickWinners} />
            )}
            refreshing={mLoading}
            onRefresh={loadManage}
            contentContainerStyle={{
              paddingBottom: 40,
              marginTop: BasePaddingsMargins.m15,
            }}
            ListHeaderComponent={
              <View>
                {/* ✅ QUICK ACTIONS FIRST */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: BaseColors.secondary,
                    borderRadius: 12,
                    padding: BasePaddingsMargins.m15,
                    backgroundColor: BaseColors.dark,
                    marginBottom: BasePaddingsMargins.m15,
                  }}
                >
                  <SectionTitle label="Quick Actions" />
                  {[
                    // ✅ opens the modal
                    {
                      label: "Create New Giveaway",
                      onPress: () => setShowCreate(true),
                    },
                    {
                      label: "View All Participants",
                      onPress: () => Alert.alert("Participants", "Coming soon"),
                    },
                    {
                      label: "Past Winners",
                      onPress: () => Alert.alert("Past Winners", "Coming soon"),
                    },
                    {
                      label: "Giveaway Settings",
                      onPress: () => Alert.alert("Settings", "Coming soon"),
                    },
                  ].map((a, i) => (
                    <TouchableOpacity
                      key={`qa-${i}`}
                      onPress={a.onPress}
                      style={{
                        borderWidth: 1,
                        borderColor: BaseColors.secondary,
                        borderRadius: 10,
                        paddingVertical: 12,
                        alignItems: "flex-start",
                        paddingHorizontal: 12,
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700" }}>
                        {a.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Random Winner Generator (title box) */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: BaseColors.secondary,
                    borderRadius: 12,
                    padding: BasePaddingsMargins.m15,
                    backgroundColor: BaseColors.dark,
                    marginBottom: BasePaddingsMargins.m15,
                  }}
                >
                  <SectionTitle label="Random Winner Generator" />
                </View>

                {/* Analytics */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: BaseColors.secondary,
                    borderRadius: 12,
                    padding: BasePaddingsMargins.m15,
                    backgroundColor: BaseColors.dark,
                    marginBottom: BasePaddingsMargins.m15,
                  }}
                >
                  <SectionTitle label="Giveaway Analytics" />
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <StatChip
                      label="Active Giveaways"
                      value={String(metrics?.active_count ?? 0)}
                    />
                    <StatChip
                      label="Total Entries"
                      value={String(metrics?.total_entries ?? 0)}
                    />
                    <StatChip
                      label="Total Prize Value"
                      value={`$${Number(metrics?.total_prize_value ?? 0)}`}
                    />
                  </View>
                </View>
              </View>
            }
            ListEmptyComponent={
              !mLoading ? (
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <Text style={{ color: BaseColors.othertexts }}>
                    No giveaways yet.
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>

      {/* ✅ Mounted modal */}
      <ModalCreateGiveaway
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          setShowCreate(false);
          if (tab === "manage") {
            // refresh the admin data after create
            loadManage();
          }
        }}
      />
    </>
  );
}
