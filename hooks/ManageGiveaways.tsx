// ManageGiveaways.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Platform,
  Keyboard,
  ActivityIndicator,
  Alert,
  InputAccessoryView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "./hooks/Template";

// ⬇️ Adjust this import if your supabase client is elsewhere
import { supabase } from "./ApiSupabase";

// iOS “Done” bar id used for numeric keyboards
const LOCAL_ACCESSORY_ID = "giveaway-done-accessory";

type GiveawayRow = {
  id: string;
  title: string;
  prize_value: number;
  status: "draft" | "scheduled" | "active" | "paused" | "ended" | "archived";
  created_at: string;
  end_at: string | null;
  image_url: string | null;
  entries_count?: number; // from view v_giveaways_with_counts
};

export default function ManageGiveaways() {
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [rows, setRows] = useState<GiveawayRow[]>([]);
  const [showModal, setShowModal] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [prizeValue, setPrizeValue] = useState<string>("500");
  const [description, setDescription] = useState("");
  const [prizeDetails, setPrizeDetails] = useState("");
  const [startAt, setStartAt] = useState(""); // yyyy-mm-dd hh:mm (local)
  const [endAt, setEndAt] = useState("");
  const [selection, setSelection] = useState<
    "random" | "judged" | "point_based"
  >("random");
  const [winners, setWinners] = useState<string>("1");

  const canCreate = useMemo(() => {
    if (!title.trim()) return false;
    if (!prizeValue || isNaN(Number(prizeValue))) return false;
    return true;
  }, [title, prizeValue]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("v_giveaways_with_counts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      Alert.alert("Load failed", error.message);
    } else {
      setRows((data as GiveawayRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setTitle("");
    setPrizeValue("500");
    setDescription("");
    setPrizeDetails("");
    setStartAt("");
    setEndAt("");
    setSelection("random");
    setWinners("1");
  };

  const createGiveaway = async () => {
    if (!canCreate) return;
    setCreating(true);

    // Convert local ISO-ish strings to UTC timestamptz if provided
    const toTz = (s: string | null) => {
      if (!s) return null;
      // naive parse (yyyy-mm-dd hh:mm) -> Date -> toISOString
      const d = new Date(s.replace(" ", "T"));
      if (isNaN(d.getTime())) return null;
      return d.toISOString();
    };

    const payload = {
      title: title.trim(),
      prize_value: Number(prizeValue),
      description: description.trim() || null,
      prize_details: prizeDetails.trim() || null,
      start_at: toTz(startAt || null),
      end_at: toTz(endAt || null),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      status: "draft",
      selection_method: selection,
      number_of_winners: Math.max(1, parseInt(winners || "1", 10)),
      draw_mode: "auto_on_end",
      public_winner_display: false,
    };

    const { error } = await supabase.from("giveaways").insert([payload]);
    setCreating(false);

    if (error) {
      console.error(error);
      Alert.alert("Create failed", error.message);
      return;
    }

    setShowModal(false);
    resetForm();
    load();
  };

  const renderRow = ({ item }: { item: GiveawayRow }) => {
    const statusColor =
      item.status === "active"
        ? "#36D399"
        : item.status === "draft"
        ? "#9AA6B2"
        : item.status === "ended"
        ? "#F87272"
        : "#60A5FA";

    return (
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={[styles.pill, { backgroundColor: statusColor }]}>
              <Text style={styles.pillText}>{item.status}</Text>
            </View>
            {typeof item.prize_value === "number" ? (
              <Text style={styles.money}>${item.prize_value}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Coming soon", "Edit screen will be added next.")
            }
            style={styles.smallBtn}
          >
            <Ionicons name="create" size={14} color="#fff" />
            <Text style={styles.smallBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>
          {item.entries_count ?? 0} total entries
          {item.end_at
            ? ` • ends ${new Date(item.end_at).toLocaleDateString()}`
            : ""}
        </Text>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Coming soon", "Participants view will be added next.")
          }
          style={[styles.primaryBtn, { marginTop: 10 }]}
        >
          <Text style={styles.primaryBtnText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Giveaway Management</Text>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.createBtn}
          accessibilityLabel="Create New Giveaway"
        >
          <Ionicons name="add-circle" size={18} color="#fff" />
          <Text style={styles.createBtnText}>Create New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ padding: 20 }}>
          <ActivityIndicator />
        </View>
      ) : rows.length === 0 ? (
        <View style={{ padding: BasePaddingsMargins.m15 }}>
          <Text style={styles.emptyText}>
            No giveaways yet. Create your first one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{
            padding: BasePaddingsMargins.m15,
            paddingBottom: 40,
          }}
          renderItem={renderRow}
        />
      )}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Giveaway</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.iconBtn}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>Giveaway Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title..."
                placeholderTextColor={BaseColors.othertexts}
                style={styles.input}
                keyboardAppearance="dark"
                returnKeyType="done"
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>Prize Value (USD)</Text>
              <TextInput
                value={prizeValue}
                onChangeText={setPrizeValue}
                placeholder="500"
                placeholderTextColor={BaseColors.othertexts}
                style={styles.input}
                keyboardAppearance="dark"
                keyboardType="decimal-pad"
                inputAccessoryViewID={
                  Platform.OS === "ios" ? LOCAL_ACCESSORY_ID : undefined
                }
                returnKeyType="done"
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your giveaway..."
                placeholderTextColor={BaseColors.othertexts}
                style={[styles.input, styles.textarea]}
                keyboardAppearance="dark"
                multiline
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>Prize Details</Text>
              <TextInput
                value={prizeDetails}
                onChangeText={setPrizeDetails}
                placeholder="Detailed prize description..."
                placeholderTextColor={BaseColors.othertexts}
                style={[styles.input, styles.textarea]}
                keyboardAppearance="dark"
                multiline
              />
            </View>

            <View style={[styles.row2, { gap: 10 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Start (yyyy-mm-dd hh:mm)</Text>
                <TextInput
                  value={startAt}
                  onChangeText={setStartAt}
                  placeholder="2025-09-01 10:00"
                  placeholderTextColor={BaseColors.othertexts}
                  style={styles.input}
                  keyboardAppearance="dark"
                  returnKeyType="done"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>End (yyyy-mm-dd hh:mm)</Text>
                <TextInput
                  value={endAt}
                  onChangeText={setEndAt}
                  placeholder="2025-09-15 23:59"
                  placeholderTextColor={BaseColors.othertexts}
                  style={styles.input}
                  keyboardAppearance="dark"
                  returnKeyType="done"
                />
              </View>
            </View>

            <View style={[styles.row2, { gap: 10 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Selection</Text>
                <View style={styles.segment}>
                  {(["random", "judged", "point_based"] as const).map((opt) => {
                    const active = selection === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => setSelection(opt)}
                        style={[
                          styles.segmentBtn,
                          active && styles.segmentBtnActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.segmentText,
                            active && styles.segmentTextActive,
                          ]}
                        >
                          {opt === "point_based" ? "point-based" : opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={{ width: 110 }}>
                <Text style={styles.label}>Winners</Text>
                <TextInput
                  value={winners}
                  onChangeText={setWinners}
                  placeholder="1"
                  placeholderTextColor={BaseColors.othertexts}
                  style={styles.input}
                  keyboardAppearance="dark"
                  keyboardType="number-pad"
                  inputAccessoryViewID={
                    Platform.OS === "ios" ? LOCAL_ACCESSORY_ID : undefined
                  }
                  returnKeyType="done"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={createGiveaway}
              disabled={!canCreate || creating}
              style={[
                styles.primaryBtn,
                (!canCreate || creating) && { opacity: 0.6 },
                { marginTop: 14 },
              ]}
            >
              {creating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Create Giveaway</Text>
              )}
            </TouchableOpacity>

            {/* iOS local “Done” bar for numeric fields */}
            {Platform.OS === "ios" && (
              <InputAccessoryView nativeID={LOCAL_ACCESSORY_ID}>
                <View style={styles.accessoryBar}>
                  <TouchableOpacity
                    onPress={() => Keyboard.dismiss()}
                    style={styles.doneChip}
                  >
                    <Text style={styles.doneChipText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </InputAccessoryView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: BaseColors.backgroundColor },
  headerRow: {
    paddingHorizontal: BasePaddingsMargins.m15,
    paddingTop: BasePaddingsMargins.m15,
    paddingBottom: BasePaddingsMargins.m10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: BaseColors.light,
    fontSize: TextsSizes.h3 ?? 18,
    fontWeight: "800",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BaseColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  createBtnText: { color: "#fff", fontWeight: "700" },

  card: {
    backgroundColor: BaseColors.dark,
    borderWidth: 1,
    borderColor: BaseColors.secondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pillText: { color: "#0B1220", fontSize: 11, fontWeight: "800" },
  money: { color: BaseColors.othertexts, fontWeight: "700" },
  cardTitle: { color: BaseColors.light, fontWeight: "800", fontSize: 16 },
  cardSub: { color: BaseColors.othertexts, marginTop: 2 },

  primaryBtn: {
    backgroundColor: BaseColors.primary,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },

  smallBtn: {
    backgroundColor: BaseColors.secondary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  emptyText: { color: BaseColors.othertexts },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: BaseColors.backgroundColor,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderColor: BaseColors.secondary,
    borderTopWidth: 1,
    padding: BasePaddingsMargins.m15,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  modalTitle: { color: BaseColors.light, fontSize: 18, fontWeight: "800" },
  iconBtn: {
    backgroundColor: BaseColors.secondary,
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  formRow: { marginTop: 10 },
  label: { color: BaseColors.othertexts, marginBottom: 6 },
  input: {
    backgroundColor: BaseColors.dark,
    borderWidth: 1,
    borderColor: BaseColors.secondary,
    borderRadius: 10,
    color: BaseColors.light,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
  },
  textarea: { minHeight: 90, textAlignVertical: "top" },

  row2: { flexDirection: "row" },

  segment: {
    backgroundColor: BaseColors.dark,
    borderWidth: 1,
    borderColor: BaseColors.secondary,
    borderRadius: 10,
    flexDirection: "row",
    overflow: "hidden",
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: BaseColors.secondary,
  },
  segmentBtnActive: { backgroundColor: BaseColors.primary },
  segmentText: {
    color: BaseColors.othertexts,
    fontWeight: "700",
    fontSize: 12,
  },
  segmentTextActive: { color: "#fff" },

  accessoryBar: {
    backgroundColor: BaseColors.dark,
    borderTopWidth: 1,
    borderTopColor: BaseColors.secondary,
    alignItems: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  doneChip: {
    backgroundColor: BaseColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  doneChipText: { color: "#fff", fontWeight: "800" },
});
