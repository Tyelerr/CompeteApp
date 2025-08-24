// App.tsx
if (typeof (global as any).structuredClone === "undefined") {
  (global as any).structuredClone = (obj: any) =>
    JSON.parse(JSON.stringify(obj));
}

import React from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, KeyboardAvoidingView, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import AuthProvider from "./context/ContextAuth";
import { enableFreeze } from "react-native-screens";
import { useKeepAwake } from "expo-keep-awake";
import GlobalDoneBar from "./components/UI/GlobalDoneBar";
import { BaseColors } from "./hooks/Template";

enableFreeze(true);

export default function App() {
  useKeepAwake();

  return (
    <>
      <AuthProvider>
        {Platform.OS === "ios" && <GlobalDoneBar />}

        {/* Avoid layout jump; give it a dark bg to prevent white flash */}
        <KeyboardAvoidingView
          behavior="padding"
          enabled={Platform.OS === "ios"}
          style={{ flex: 1, backgroundColor: BaseColors.backgroundColor }}
        >
          <View
            style={{ flex: 1, backgroundColor: BaseColors.backgroundColor }}
          >
            <AppNavigator />
          </View>
        </KeyboardAvoidingView>
      </AuthProvider>
      <StatusBar style="light" />
    </>
  );
}
