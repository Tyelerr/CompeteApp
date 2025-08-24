import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
} from "react-native";
import { StyleZ } from "../../assets/css/styles";
import {
  BaseColors,
  BasePaddingsMargins,
  TextsSizes,
} from "../../hooks/Template";
import {
  ECustomContentType,
  ICustomContent,
} from "../../hooks/InterfacesGlobal";
import {
  GetContentItems,
  DeleteContent,
} from "../../ApiSupabase/CrudCustomContent";

// ⬇️ Your reward editor modal (path may need to be adjusted to where you put it)
import ModalEditorContentRewards from "./ModalEditorContentRewards";

type TShopTab = "shop" | "giveaways" | "manage";

export default function ScreenShop() {
  // Default to GIVEAWAYS tab
  const [tab, setTab] = useState<TShopTab>("giveaways");

  // Giveaways state
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [giveaways, setGiveaways] = useState<ICustomContent[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editRow, setEditRow] = useState<ICustomContent | null>(null);

  const loadGiveaways = async () => {
    setLoading(true);
    try {
      const { data, error } = await GetContentItems(
        ECustomContentType.ContentReward
      );
      if (error) {
        console.log(error);
      }
      setGiveaways((data as ICustomContent[]) ?? []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "giveaways") loadGiveaways();
  }, [tab]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGiveaways();
    setRefreshing(false);
  };

  const openCreate = () => {
    setEditRow(null);
    setEditorOpen(true);
  };

  const openEdit = (row: ICustomContent) => {
    setEditRow(row);
    setEditorOpen(true);
  };

  const afterCreate = () => loadGiveaways();
  const afterUpdate = () => loadGiveaways();

  const confirmDelete = (row: ICustomContent) => {
    Alert.alert(
      "Delete Giveaway",
      `Are you sure you want to delete “${row.name}”?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await DeleteContent(row.id);
            if (error) Alert.alert("Error", "Failed to delete giveaway");
            await loadGiveaways();
          },
        },
      ]
    );
  };

  const TabButton = ({
    current,
    label,
    value,
  }: {
    current: TShopTab;
    label: string;
    value: TShopTab;
  }) => {
    const active = current === value;
    return (
      <TouchableOpacity
        onPress={() => setTab(value)}
        style={[
          {
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 8,
            marginRight: 8,
            backgroundColor: active ? BaseColors.primary : "transparent",
            borderWidth: 1,
            borderColor: BaseColors.secondary,
          },
        ]}
      >
        <Text
          style={{
            color: active ? "#fff" : BaseColors.othertexts,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const HeaderTabs = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: BasePaddingsMargins.m15,
      }}
    >
      <TabButton current={tab} value="shop" label="Shop" />
      <TabButton current={tab} value="giveaways" label="Giveaways" />
      <TabButton current={tab} value="manage" label="Manage" />
    </View>
  );

  const Card = ({ row }: { row: ICustomContent }) => {
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
        {/* Top row: badge + actions */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: BasePaddingsMargins.m10,
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
              Reward • ID:{row.id}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => confirmDelete(row)}
              style={{
                backgroundColor: BaseColors.danger,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openEdit(row)}
              style={{
                backgroundColor: BaseColors.primary,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image + Title */}
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          {row.reward_picture ? (
            <Image
              source={{ uri: row.reward_picture }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: BaseColors.secondary,
              }}
            />
          ) : null}

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
              {row.name}
            </Text>
            {row.value ? (
              <Text style={{ color: BaseColors.othertexts }}>
                ${row.value} Value
              </Text>
            ) : null}
          </View>
        </View>

        {/* Entries / CTA */}
        <View style={{ marginTop: BasePaddingsMargins.m15 }}>
          {typeof row.entries === "number" ? (
            <Text style={{ color: BaseColors.othertexts, marginBottom: 8 }}>
              {row.entries} total entries
            </Text>
          ) : null}

          <TouchableOpacity
            style={{
              backgroundColor: BaseColors.primary,
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const GiveawaysList = () => {
    if (loading) {
      return (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator color={BaseColors.primary} />
        </View>
      );
    }
    if (!giveaways.length) {
      return (
        <View
          style={{
            paddingVertical: 40,
            alignItems: "center",
            borderWidth: 1,
            borderColor: BaseColors.secondary,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
            More giveaways coming soon
          </Text>
          <Text style={{ color: BaseColors.othertexts, marginTop: 6 }}>
            Stay tuned for new prizes and opportunities!
          </Text>
        </View>
      );
    }
    return (
      <>
        {giveaways.map((g) => (
          <Card key={`reward-${g.id}`} row={g} />
        ))}
      </>
    );
  };

  const ManagePanel = () => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: BaseColors.secondary,
          borderRadius: 12,
          padding: BasePaddingsMargins.m15,
          backgroundColor: BaseColors.dark,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "800",
            fontSize: 18,
            marginBottom: BasePaddingsMargins.m10,
          }}
        >
          Quick Actions
        </Text>

        <TouchableOpacity
          onPress={openCreate}
          style={{
            backgroundColor: BaseColors.primary,
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Create New Giveaway
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1, padding: BasePaddingsMargins.m15 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Title */}
        <Text
          style={{
            color: "#fff",
            fontWeight: "900",
            fontSize: 20,
            marginBottom: BasePaddingsMargins.m5,
            textAlign: "center",
          }}
        >
          SHOP
        </Text>
        <Text
          style={{
            color: BaseColors.othertexts,
            textAlign: "center",
            marginBottom: BasePaddingsMargins.m15,
          }}
        >
          Discover unique finds and giveaways at our welcoming shop.
        </Text>

        {/* Tabs */}
        <HeaderTabs />

        {/* Panels by tab */}
        {tab === "shop" && (
          <View
            style={{
              borderWidth: 1,
              borderColor: BaseColors.secondary,
              borderRadius: 12,
              padding: BasePaddingsMargins.m15,
              backgroundColor: BaseColors.dark,
            }}
          >
            <Text style={{ color: BaseColors.othertexts }}>
              Shop content goes here.
            </Text>
          </View>
        )}

        {tab === "giveaways" && <GiveawaysList />}

        {tab === "manage" && <ManagePanel />}
      </ScrollView>

      {/* Editor Modal */}
      <ModalEditorContentRewards
        isOpened={editorOpen}
        F_isOpened={setEditorOpen}
        type={ECustomContentType.ContentReward}
        data_row={editRow}
        set_data_row={(cc) => setEditRow(cc)}
        editOrCreate={editRow ? "edit" : "create-new"}
        afterCreatingNewGift={afterCreate}
        afterUpdatingTheGift={afterUpdate}
      />
    </>
  );
}
