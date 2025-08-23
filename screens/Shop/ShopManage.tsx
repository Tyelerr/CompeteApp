import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import UIPanel from "../../components/UI/UIPanel";
import LFButton from "../../components/LoginForms/Button/LFButton";
import {
  BaseColors,
  BasePaddingsMargins,
  TextsSizes,
} from "../../hooks/Template";
import { Ionicons } from "@expo/vector-icons";

/* ----------------------------------------------------------------------------
  Types
---------------------------------------------------------------------------- */
type GiveawayStatus = "active" | "ended" | "scheduled";

export interface IGiveaway {
  id: string;
  title: string;
  prizeValue?: number;
  status: GiveawayStatus;
  endAt?: string; // ISO
  entriesCount: number;
  imageUrl?: string;
  description?: string;
  winnerEntryId?: string | null;
}

export interface IEntry {
  id: string;
  userId?: string;
  name?: string;
  email?: string;
}

/* ----------------------------------------------------------------------------
  API - Default in-memory implementation (works immediately)
  Swap these with your Supabase calls later (same signatures).
---------------------------------------------------------------------------- */
const memoryDB = {
  giveaways: [
    {
      id: "g1",
      title: "Premium Pool Cue Giveaway",
      prizeValue: 500,
      status: "active" as GiveawayStatus,
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      entriesCount: 347,
      imageUrl: "",
      description: "Win a professional-grade Predator pool cue.",
      winnerEntryId: null,
    },
    {
      id: "g2",
      title: "Professional Tournament Set",
      prizeValue: 300,
      status: "ended" as GiveawayStatus,
      endAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      entriesCount: 0,
      imageUrl: "",
      description: "Ended example giveaway.",
      winnerEntryId: "e-2-13",
    },
  ] as IGiveaway[],
  entries: {
    g1: Array.from({ length: 347 }, (_, i) => ({
      id: `e-1-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })),
    g2: Array.from({ length: 89 }, (_, i) => ({
      id: `e-2-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })),
  } as Record<string, IEntry[]>,
};

const api = {
  async list(): Promise<IGiveaway[]> {
    // TODO: Swap with Supabase:
    // const { data, error } = await supabase.from('giveaways').select('*')
    // if (error) throw error;
    // return data as IGiveaway[];
    return JSON.parse(JSON.stringify(memoryDB.giveaways));
  },
  async create(input: Partial<IGiveaway>): Promise<IGiveaway> {
    const g: IGiveaway = {
      id: `g-${Date.now()}`,
      title: input.title || "Untitled Giveaway",
      prizeValue: input.prizeValue || 0,
      status: input.status || "active",
      endAt: input.endAt,
      imageUrl: input.imageUrl,
      description: input.description,
      entriesCount: 0,
      winnerEntryId: null,
    };
    memoryDB.giveaways.unshift(g);
    return g;
  },
  async end(id: string): Promise<void> {
    const g = memoryDB.giveaways.find((x) => x.id === id);
    if (g) g.status = "ended";
  },
  async entries(giveawayId: string): Promise<IEntry[]> {
    return JSON.parse(JSON.stringify(memoryDB.entries[giveawayId] || []));
  },
  async setWinner(giveawayId: string, entryId: string): Promise<void> {
    const g = memoryDB.giveaways.find((x) => x.id === giveawayId);
    if (g) {
      g.winnerEntryId = entryId;
      g.status = "ended";
    }
  },
  async delete(giveawayId: string): Promise<void> {
    const i = memoryDB.giveaways.findIndex((g) => g.id === giveawayId);
    if (i >= 0) memoryDB.giveaways.splice(i, 1);
  },
};

/* ----------------------------------------------------------------------------
  Small UI helpers
---------------------------------------------------------------------------- */
const fmtMoney = (n?: number) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : "";

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "—";

const StatusPill = ({ s }: { s: GiveawayStatus }) => {
  const map =
    s === "active"
      ? { bg: "#022c22", text: "#34d399", label: "Active" }
      : s === "scheduled"
      ? { bg: "#1f2a44", text: "#93c5fd", label: "Scheduled" }
      : { bg: "#2a1f1f", text: "#fca5a5", label: "Ended" };
  return (
    <View
      style={{
        backgroundColor: map.bg,
        borderColor: map.text + "66",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: map.text, fontWeight: "700", fontSize: 12 }}>
        {map.label}
      </Text>
    </View>
  );
};

/* ----------------------------------------------------------------------------
  Create Giveaway Modal
---------------------------------------------------------------------------- */
function ModalCreateGiveaway({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (payload: Partial<IGiveaway>) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [prize, setPrize] = useState("");
  const [endAt, setEndAt] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await onCreate({
      title: title.trim() || "Untitled Giveaway",
      prizeValue: Number(prize) || 0,
      endAt: endAt ? new Date(endAt).toISOString() : undefined,
      status: "active",
      description: desc.trim(),
    });
    setLoading(false);
    setTitle("");
    setPrize("");
    setEndAt("");
    setDesc("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          padding: 22,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            backgroundColor: "#16171a",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: BaseColors.PanelBorderColor,
            padding: 16,
          }}
        >
          <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
            Create New Giveaway
          </Text>

          <View style={{ height: 10 }} />

          <Text style={{ color: "#9ca3af", marginBottom: 6 }}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Giveaway title"
            placeholderTextColor="#6b7280"
            style={{
              color: "white",
              borderWidth: 1,
              borderColor: BaseColors.PanelBorderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 10,
            }}
          />

          <Text style={{ color: "#9ca3af", marginBottom: 6 }}>
            Prize Value (USD)
          </Text>
          <TextInput
            value={prize}
            onChangeText={setPrize}
            keyboardType="numeric"
            placeholder="500"
            placeholderTextColor="#6b7280"
            style={{
              color: "white",
              borderWidth: 1,
              borderColor: BaseColors.PanelBorderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 10,
            }}
          />

          <Text style={{ color: "#9ca3af", marginBottom: 6 }}>
            End Date (YYYY-MM-DD)
          </Text>
          <TextInput
            value={endAt}
            onChangeText={setEndAt}
            placeholder="2025-09-15"
            placeholderTextColor="#6b7280"
            style={{
              color: "white",
              borderWidth: 1,
              borderColor: BaseColors.PanelBorderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 10,
            }}
          />

          <Text style={{ color: "#9ca3af", marginBottom: 6 }}>Description</Text>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="What will the winner receive?"
            placeholderTextColor="#6b7280"
            multiline
            style={{
              color: "white",
              borderWidth: 1,
              borderColor: BaseColors.PanelBorderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              minHeight: 80,
            }}
          />

          <View style={{ height: 14 }} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <LFButton type="danger" label="Cancel" onPress={onClose} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <LFButton
                type="primary"
                label={loading ? "Saving..." : "Save Giveaway"}
                onPress={submit}
                disabled={loading}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

/* ----------------------------------------------------------------------------
  Pick Winner Modal
---------------------------------------------------------------------------- */
function ModalPickWinner({
  visible,
  onClose,
  giveaway,
  onPicked,
}: {
  visible: boolean;
  onClose: () => void;
  giveaway: IGiveaway | null;
  onPicked: (entry: IEntry) => Promise<void>;
}) {
  const [entries, setEntries] = useState<IEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<IEntry | null>(null);

  useEffect(() => {
    (async () => {
      if (!giveaway) return;
      setLoading(true);
      const data = await api.entries(giveaway.id);
      setEntries(data);
      setLoading(false);
    })();
  }, [giveaway?.id, visible]);

  const pick = async () => {
    if (!entries.length) return;
    const idx = Math.floor(Math.random() * entries.length);
    const e = entries[idx];
    setPicked(e);
    await onPicked(e);
  };

  if (!giveaway) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          padding: 22,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            backgroundColor: "#16171a",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: BaseColors.PanelBorderColor,
            padding: 16,
          }}
        >
          <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
            Pick Winner — {giveaway.title}
          </Text>

          <Text style={{ color: "#9ca3af", marginTop: 8 }}>
            Entries: {entries.length}
          </Text>

          <View style={{ height: 14 }} />

          {picked ? (
            <View
              style={{
                backgroundColor: "#0f172a",
                borderWidth: 1,
                borderColor: "#1f2937",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <Text style={{ color: "#34d399", fontWeight: "800" }}>
                🎉 Winner Selected!
              </Text>
              <Text style={{ color: "white", marginTop: 6 }}>
                {picked.name || "Entry"}{" "}
                <Text style={{ color: "#9ca3af" }}>{picked.email || ""}</Text>
              </Text>
            </View>
          ) : null}

          <View style={{ height: 14 }} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <LFButton type="danger" label="Close" onPress={onClose} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <LFButton
                type="primary"
                label={loading ? "Loading..." : "Pick Random Winner"}
                onPress={pick}
                disabled={loading || !!picked || !entries.length}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

/* ----------------------------------------------------------------------------
  Main Manage Screen
---------------------------------------------------------------------------- */
export default function ShopManage({
  onCreateGift,
}: {
  onCreateGift?: () => void; // still supported if you need it elsewhere
}) {
  const [items, setItems] = useState<IGiveaway[]>([]);
  const [loading, setLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [pickOpen, setPickOpen] = useState(false);
  const [current, setCurrent] = useState<IGiveaway | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await api.list();
      setItems(data);
      setLoading(false);
    })();
  }, []);

  const analytics = useMemo(() => {
    const active = items.filter((g) => g.status === "active");
    const totalPrize = items.reduce((sum, g) => sum + (g.prizeValue || 0), 0);
    const totalEntries = items.reduce(
      (sum, g) => sum + (g.entriesCount || 0),
      0
    );
    return { activeCount: active.length, totalEntries, totalPrize };
  }, [items]);

  const openPicker = (g: IGiveaway) => {
    setCurrent(g);
    setPickOpen(true);
  };

  const endGiveaway = async (g: IGiveaway) => {
    await api.end(g.id);
    setItems((prev) =>
      prev.map((x) => (x.id === g.id ? { ...x, status: "ended" } : x))
    );
  };

  const removeGiveaway = async (g: IGiveaway) => {
    await api.delete(g.id);
    setItems((prev) => prev.filter((x) => x.id !== g.id));
  };

  return (
    <>
      {/* Analytics */}
      <UIPanel>
        <Text style={{ color: "white", fontWeight: "800", fontSize: 18 }}>
          Giveaway Analytics
        </Text>

        <View style={{ height: 10 }} />

        <View
          style={{ flexDirection: "row", gap: 10 as any, flexWrap: "wrap" }}
        >
          <StatCard
            label="Active Giveaways"
            value={String(analytics.activeCount)}
          />
          <StatCard
            label="Total Entries"
            value={String(analytics.totalEntries)}
          />
          <StatCard
            label="Total Prize Value"
            value={fmtMoney(analytics.totalPrize)}
          />
        </View>
      </UIPanel>

      {/* Quick Actions */}
      <UIPanel>
        <Text style={{ color: "white", fontWeight: "800", fontSize: 18 }}>
          Quick Actions
        </Text>

        <View style={{ height: 12 }} />

        <View style={{ gap: 10 }}>
          <LFButton
            type="primary"
            label="Create New Giveaway"
            icon="gift"
            onPress={() => setCreateOpen(true)}
          />
          <LFButton
            type="secondary"
            label="View All Participants"
            icon="people"
            onPress={() => {}}
          />
          <LFButton
            type="secondary"
            label="Past Winners"
            icon="trophy"
            onPress={() => {}}
          />
        </View>
      </UIPanel>

      {/* List */}
      <UIPanel>
        <Text
          style={{
            color: "white",
            fontWeight: "800",
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          Random Winner Generator
        </Text>

        {loading ? (
          <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading…</Text>
        ) : items.length === 0 ? (
          <Text style={{ color: "#9ca3af", marginTop: 8 }}>
            No giveaways found.
          </Text>
        ) : (
          <View style={{ gap: 12 }}>
            {items.map((g) => (
              <GiveawayCard
                key={g.id}
                g={g}
                onPick={() => openPicker(g)}
                onEnd={() => endGiveaway(g)}
                onDelete={() => removeGiveaway(g)}
              />
            ))}
          </View>
        )}
      </UIPanel>

      {/* Modals */}
      <ModalCreateGiveaway
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={async (payload) => {
          const created = await api.create(payload);
          setItems((prev) => [created, ...prev]);
        }}
      />
      <ModalPickWinner
        visible={pickOpen}
        onClose={() => setPickOpen(false)}
        giveaway={current}
        onPicked={async (entry) => {
          if (!current) return;
          await api.setWinner(current.id, entry.id);
          setItems((prev) =>
            prev.map((x) =>
              x.id === current.id
                ? { ...x, status: "ended", winnerEntryId: entry.id }
                : x
            )
          );
        }}
      />
    </>
  );
}

/* ----------------------------------------------------------------------------
  Subcomponents
---------------------------------------------------------------------------- */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexGrow: 1,
        minWidth: 110,
        backgroundColor: "#0f1115",
        borderWidth: 1,
        borderColor: BaseColors.PanelBorderColor,
        borderRadius: 10,
        padding: 14,
      }}
    >
      <Text style={{ color: "#93c5fd", fontWeight: "800", fontSize: 18 }}>
        {value}
      </Text>
      <Text style={{ color: "#9ca3af", marginTop: 6 }}>{label}</Text>
    </View>
  );
}

function GiveawayCard({
  g,
  onPick,
  onEnd,
  onDelete,
}: {
  g: IGiveaway;
  onPick: () => void;
  onEnd: () => void;
  onDelete: () => void;
}) {
  return (
    <View
      style={{
        backgroundColor: "#141416",
        borderWidth: 1,
        borderColor: BaseColors.PanelBorderColor,
        borderRadius: 12,
        padding: 12,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <StatusPill s={g.status} />
        <Text style={{ color: "#60a5fa", fontWeight: "800" }}>
          {fmtMoney(g.prizeValue)}
        </Text>
      </View>

      <Text
        style={{
          color: "white",
          fontWeight: "800",
          fontSize: 16,
          marginTop: 8,
        }}
      >
        {g.title}
      </Text>

      <View style={{ flexDirection: "row", marginTop: 6 }}>
        <Text style={{ color: "#9ca3af" }}>Entries </Text>
        <Text style={{ color: "white", fontWeight: "700" }}>
          {g.entriesCount}
        </Text>
        <Text style={{ color: "#9ca3af" }}> · Ends {fmtDate(g.endAt)}</Text>
      </View>

      <View style={{ height: 10 }} />

      <View style={{ flexDirection: "row", gap: 10 as any }}>
        <View style={{ flex: 1 }}>
          <LFButton
            type="primary"
            label={g.status === "ended" ? "View Winner" : "Pick Winner"}
            icon="shuffle"
            onPress={onPick}
          />
        </View>
        {g.status !== "ended" ? (
          <View style={{ width: 120 }}>
            <LFButton type="secondary" label="End" onPress={onEnd} />
          </View>
        ) : null}
        <TouchableOpacity
          onPress={onDelete}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#221416",
            borderWidth: 1,
            borderColor: "#7a1f1f",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="trash" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
