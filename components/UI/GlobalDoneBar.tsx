// components/UI/GlobalDoneBar.tsx
import React from "react";
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BaseColors, BasePaddingsMargins } from "../../hooks/Template";

export const DONE_ACCESSORY_ID = "lf-done-accessory";

export default function GlobalDoneBar() {
  if (Platform.OS !== "ios") return null;

  return (
    <InputAccessoryView nativeID={DONE_ACCESSORY_ID}>
      <View
        style={{
          backgroundColor: BaseColors.dark,
          borderTopWidth: 1,
          borderTopColor: BaseColors.secondary,
          paddingHorizontal: BasePaddingsMargins.m15,
          paddingVertical: BasePaddingsMargins.m10,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: BaseColors.primary,
            borderRadius: 10,
          }}
        >
          {/* Bigger text to match the picker “Done” */}
          <Text
            style={{
              color: "white",
              fontWeight: "700",
              fontSize: 17, // ⬅️ bump size
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  );
}
