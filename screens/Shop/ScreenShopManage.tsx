// /screens/Shop/ScreenShopManage.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  BaseColors,
  BasePaddingsMargins,
} from "../../hooks/Template";
import { ECustomContentType } from "../../hooks/InterfacesGlobal";
import ModalEditorContentRewards from "./ModalEditorContentRewards";

export default function ScreenShopManage() {
  const nav = useNavigation<any>();
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#0c0c0c",
          padding: BasePaddingsMargins.m15,
        }}
      >
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
              marginBottom: 10,
            }}
          >
            Manage Giveaways
          </Text>

          <TouchableOpacity
            onPress={() => setEditorOpen(true)}
            style={{
              backgroundColor: BaseColors.primary,
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: BasePaddingsMargins.m10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Create New Giveaway
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => nav.navigate("ShopHome", { initialTab: "giveaways" })}
            style={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: BaseColors.secondary,
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Back to Giveaways
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ModalEditorContentRewards
        isOpened={editorOpen}
        F_isOpened={setEditorOpen}
        type={ECustomContentType.ContentReward}
        data_row={null}
        set_data_row={() => {}}
        editOrCreate="create-new"
        afterCreatingNewGift={() => {
          // optional: you can navigate back or refresh Shop after creating
          nav.navigate("ShopHome", { initialTab: "giveaways" });
        }}
      />
    </>
  );
}
