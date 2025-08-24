// screens/ScreenScrollView.tsx
import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { BaseColors, BasePaddingsMargins } from "../hooks/Template";
import GlobalDoneBar from "../components/UI/GlobalDoneBar";

type Props = {
  children: ReactNode;
  contentContainerStyle?: any;
  /** If your custom header overlaps inputs on iOS, bump this (e.g., 44 or 64) */
  keyboardVerticalOffsetIOS?: number;
};

export default function ScreenScrollView({
  children,
  contentContainerStyle,
  keyboardVerticalOffsetIOS = 0,
}: Props) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BaseColors.backgroundColor }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={keyboardVerticalOffsetIOS}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: BaseColors.backgroundColor }}
        contentContainerStyle={[
          {
            paddingHorizontal: BasePaddingsMargins.m10,
            paddingBottom: BasePaddingsMargins.m30,
          },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        overScrollMode="never"
        bounces={false}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>

      {/* iOS-only; renders above the keyboard via InputAccessoryView */}
      <GlobalDoneBar />
    </KeyboardAvoidingView>
  );
}
