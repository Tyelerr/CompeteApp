// screens/ProfileLoginRegister/FormCreateNewUser.tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import LFInput from "../../components/LoginForms/LFInput";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import { EUserRole, UserRoles } from "../../hooks/InterfacesGlobal";
import { useContextAuth } from "../../context/ContextAuth";

import { UpdateProfile } from "../../ApiSupabase/CrudUser";
import {
  AdminCreateUser,
  FindProfileIdByEmail,
} from "../../ApiSupabase/AdminAuthHelpers";

type Props = {
  /** When used from Admin screen, this is set to "for-administrator" */
  type?: "for-administrator" | string;
  /** Called after a successful register */
  AfterRegisteringNewUser?: () => void;
  /** Called when the Close button is pressed */
  EventAfterCloseTheForm?: () => void;
};

export default function FormCreateNewUser(props: Props) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<EUserRole>(EUserRole.BasicUser);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Only allow role assignment when used from Admin AND current user is an admin
  const { user: current } = useContextAuth();
  const isAdminMode =
    props.type === "for-administrator" &&
    (current?.role === EUserRole.CompeteAdmin ||
      current?.role === EUserRole.MasterAdministrator);

  const canSubmit =
    email.trim().length > 0 &&
    userName.trim().length > 0 &&
    password.length >= 6;

  async function handleSubmit() {
    if (!canSubmit || loading) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1) Create the auth user
      const { data, error } = await AdminCreateUser(
        email.trim(),
        password,
        userName.trim()
      );
      if (error) throw error;

      // 2) Resolve new user's UUID from profiles (trigger usually inserts on sign-up)
      const { data: prof, error: profErr } = await FindProfileIdByEmail(
        email.trim()
      );
      if (profErr) throw profErr;

      const newUserId = prof?.id || data?.user?.id || null;

      // 3) If created from Admin, set the selected role immediately
      if (isAdminMode && newUserId) {
        await UpdateProfile(newUserId, { role });
      }

      // 4) Clear and notify parent
      setEmail("");
      setUserName("");
      setPassword("");
      props.AfterRegisteringNewUser?.();
    } catch (err: any) {
      setErrorMsg(
        err?.message || "Something went wrong while creating the user."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ padding: BasePaddingsMargins.m10 }}>
      <Text
        style={{
          color: "white",
          fontSize: TextsSizes.h3,
          fontWeight: "800",
          marginBottom: BasePaddingsMargins.m10,
          textAlign: "center",
        }}
      >
        New User Form
      </Text>

      <Text
        style={{
          color: "#9ca3af",
          textAlign: "center",
          marginBottom: BasePaddingsMargins.m10,
        }}
      >
        Enter your credentials below and create the new user
      </Text>

      <LFInput
        label="Enter Email Address"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
        marginBottomInit={BasePaddingsMargins.m10}
      />

      <LFInput
        label="Username"
        placeholder="Enter your username"
        autoCapitalize="none"
        onChangeText={setUserName}
        value={userName}
        marginBottomInit={BasePaddingsMargins.m10}
      />

      <LFInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        marginBottomInit={BasePaddingsMargins.m10}
      />

      {/* Role selector appears only for admins on the Admin screen */}
      {isAdminMode ? (
        <LFInput
          typeInput="dropdown"
          label="Assign Role"
          placeholder="Choose a role"
          defaultValue={EUserRole.BasicUser as unknown as string}
          items={UserRoles /* [{label, value}] */}
          onChangeText={(v: string) => setRole(v as unknown as EUserRole)}
          marginBottomInit={BasePaddingsMargins.m10}
        />
      ) : null}

      {errorMsg ? (
        <Text
          style={{ color: "#f87171", marginBottom: BasePaddingsMargins.m10 }}
        >
          {errorMsg}
        </Text>
      ) : null}

      <LFButton
        type="primary"
        label={loading ? "Creating..." : "Create account"}
        disabled={!canSubmit || loading}
        onPress={handleSubmit}
      />

      <View style={{ height: BasePaddingsMargins.m10 }} />

      <LFButton
        type="secondary"
        label="Close the form"
        onPress={props.EventAfterCloseTheForm}
      />
    </View>
  );
}
