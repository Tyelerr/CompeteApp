// screens/Admin/ScreenAdminUsers.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenScrollView from "../ScreenScrollView";
import ScreenAdminDropdownNavigation from "./ScreenAdminDropdownNavigation";
import UIPanel from "../../components/UI/UIPanel";
import LFInput from "../../components/LoginForms/LFInput";
import LFButton from "../../components/LoginForms/Button/LFButton";
import ModalInfoMessage from "../../components/UI/UIModal/ModalInfoMessage";

import {
  BaseColors,
  BasePaddingsMargins,
  TextsSizes,
} from "../../hooks/Template";
import { TIMEOUT_DELAY_WHEN_SEARCH } from "../../hooks/constants";
import {
  EUserRole,
  ICAUserData,
  UserRoles,
} from "../../hooks/InterfacesGlobal";
import { useContextAuth } from "../../context/ContextAuth";

import {
  FetchUsersV2,
  UpdateProfile,
  DeleteUser,
} from "../../ApiSupabase/CrudUser";
import FormCreateNewUser from "../ProfileLoginRegister/FormCreateNewUser";

/* ---------- helpers ---------- */
const ROLE_LABEL: Record<EUserRole, string> = {
  [EUserRole.BasicUser]: "Basic User",
  [EUserRole.CompeteAdmin]: "Compete Admin",
  [EUserRole.BarAdmin]: "Bar Owner",
  [EUserRole.TournamentDirector]: "Tournament Director",
  [EUserRole.MasterAdministrator]: "Master Admin",
};

// sorting
type SortBy = "role-az" | "role-za" | "hierarchy";
const ROLE_ORDER: Partial<Record<EUserRole, number>> = {
  [EUserRole.MasterAdministrator]: 1,
  [EUserRole.CompeteAdmin]: 2,
  [EUserRole.BarAdmin]: 3,
  [EUserRole.TournamentDirector]: 4,
  [EUserRole.BasicUser]: 9,
};

const fmtDate = (iso?: string) =>
  !iso
    ? ""
    : new Date(iso).toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });

const initials = (name?: string) =>
  (name || "")
    .trim()
    .split(/\s|_/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "US";

const venuesCountOf = (u: any) =>
  u?.venues_count ?? (Array.isArray(u?.venues) ? u.venues.length : 0);
const directorsCountOf = (u: any) =>
  u?.directors_count ?? (Array.isArray(u?.directors) ? u.directors.length : 0);
const formatUserId = (n?: number | null) =>
  n == null ? "" : String(n).padStart(6, "0");

/* ---------- small chips ---------- */
function RoleChip({ role }: { role: EUserRole }) {
  const color =
    role === EUserRole.CompeteAdmin
      ? "#3b82f6"
      : role === EUserRole.BarAdmin
      ? "#7c3aed"
      : role === EUserRole.TournamentDirector
      ? "#06b6d4"
      : role === EUserRole.MasterAdministrator
      ? "#f59e0b"
      : "#374151";
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: color + "66",
        backgroundColor: color + "22",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
      }}
    >
      <Text style={{ color, fontWeight: "700" }}>{ROLE_LABEL[role]}</Text>
    </View>
  );
}
function Badge({ text, prefix }: { text: string; prefix?: string }) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: BaseColors.PanelBorderColor,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "#1b1c20",
      }}
    >
      <Text style={{ color: "#9ca3af", fontWeight: "700" }}>
        {prefix ? `${prefix} ` : ""}
        {text}
      </Text>
    </View>
  );
}
function SortPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: BaseColors.PanelBorderColor,
        marginRight: 8,
        backgroundColor: active ? "#0ea5e9" : "transparent",
      }}
    >
      <Text style={{ color: active ? "#000" : "#ddd", fontWeight: "700" }}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- EDIT PROFILE MODAL ---------- */
function EditUserProfileModal({
  visible,
  user,
  onClose,
  onSaved,
}: {
  visible: boolean;
  user: ICAUserData | null;
  onClose: () => void;
  onSaved: (partial: Partial<ICAUserData>) => void;
}) {
  const [form, setForm] = useState<Record<string, any>>({});
  const [zipKey, setZipKey] = useState<string>("home_zip");
  const ZIP_KEYS = [
    "home_zip",
    "home_zip_code",
    "zip_home",
    "zip_code",
    "zipcode",
  ];

  useEffect(() => {
    if (!user) return;

    const detectedZipKey =
      ZIP_KEYS.find((k) =>
        Object.prototype.hasOwnProperty.call(user as any, k)
      ) ?? "home_zip";
    setZipKey(detectedZipKey);

    setForm({
      user_name: user.user_name ?? user.name ?? "",
      name: user.name ?? "",
      zip_value: (user as any)[detectedZipKey] ?? "",
      favorite_player: (user as any).favorite_player ?? "",
      favorite_game: (user as any).favorite_game ?? "",
    });
  }, [user]);

  if (!user) return null;

  const setField = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const updates: any = {
      user_name: form.user_name ?? "",
      name: form.name ?? "",
      favorite_player: form.favorite_player ?? "",
      favorite_game: form.favorite_game ?? "",
      [zipKey]: form.zip_value ?? "",
    };
    await UpdateProfile(user.id, updates);
    onSaved(updates);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          justifyContent: "center",
          padding: 18,
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            backgroundColor: "#141416",
            borderWidth: 1,
            borderColor: BaseColors.PanelBorderColor,
            borderRadius: 14,
            padding: 16,
            maxHeight: "90%",
            width: "100%",
          }}
        >
          <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
            Edit Profile
          </Text>

          <View style={{ height: 12 }} />

          <LFInput
            label="Username"
            placeholder="Enter username"
            value={form.user_name}
            onChangeText={(t: string) => setField("user_name", t)}
            marginBottomInit={10}
          />
          <LFInput
            label="Name"
            placeholder="Full name"
            value={form.name}
            onChangeText={(t: string) => setField("name", t)}
            marginBottomInit={10}
          />
          <LFInput
            label="Home Zip Code"
            placeholder="Enter your zip code"
            value={form.zip_value}
            onChangeText={(t: string) => setField("zip_value", t)}
            marginBottomInit={10}
          />
          <LFInput
            label="Favorite Player"
            placeholder="Enter your favorite player"
            value={form.favorite_player}
            onChangeText={(t: string) => setField("favorite_player", t)}
            marginBottomInit={10}
          />
          <LFInput
            label="Favorite Game"
            placeholder="Enter your favorite game"
            value={form.favorite_game}
            onChangeText={(t: string) => setField("favorite_game", t)}
            marginBottomInit={16}
          />

          {/* Buttons row: SAVE (left) | CANCEL (right) */}
          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={handleSave}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: "#3b82f6", // blue save
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#000", fontWeight: "800" }}>
                Save Changes
              </Text>
            </Pressable>

            <View style={{ width: 10 }} />

            <Pressable
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: "#b91c1c", // red cancel
                borderWidth: 1,
                borderColor: "#7a1f1f",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "800" }}>Cancel</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

/* ---------- DETAILS SHEET (pop out) ---------- */
function UserDetailsSheet({
  visible,
  user,
  onClose,
  onChangeRole,
  onAddVenue,
  onAddDirector,
  onDelete,
  onEdit, // NEW
}: {
  visible: boolean;
  user: ICAUserData | null;
  onClose: () => void;
  onChangeRole: (id: string, role: EUserRole) => void;
  onAddVenue: (id: string) => void;
  onAddDirector: (id: string) => void;
  onDelete: (u: ICAUserData) => void;
  onEdit: (u: ICAUserData) => void;
}) {
  if (!user) return null;
  const venuesCount = venuesCountOf(user);
  const directorsCount = directorsCountOf(user);

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: "#9ca3af", fontSize: 12, marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ color: "white", fontWeight: "700" }}>{value ?? "—"}</Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* dim background - tap to close */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* bottom sheet */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            marginTop: "auto",
            backgroundColor: "#141416",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderColor: BaseColors.PanelBorderColor,
            borderWidth: 1,
            paddingBottom: 24,
            maxHeight: "85%",
          }}
        >
          {/* header */}
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: BaseColors.PanelBorderColor,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#222228",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: BaseColors.PanelBorderColor,
                marginRight: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "800" }}>
                {initials(user.user_name || user.name)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: "white", fontWeight: "800", fontSize: 16 }}
                numberOfLines={1}
              >
                {user.user_name || user.name || "User"}
              </Text>
              <View
                style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}
              >
                <Badge text={`User ID: ${formatUserId(user.id_auto)}`} />
                {user.created_at ? <View style={{ width: 8 }} /> : null}
                {user.created_at ? (
                  <Badge text={`Joined ${fmtDate(user.created_at)}`} />
                ) : null}
              </View>
            </View>

            {/* NEW: quick edit icon in the sheet header */}
            <Pressable
              onPress={() => onEdit(user)}
              hitSlop={10}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="create-outline" size={22} color="#9ca3af" />
            </Pressable>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={26} color="#9ca3af" />
            </Pressable>
          </View>

          {/* content */}
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* role + counts */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <RoleChip role={user.role} />
              {venuesCount ? <View style={{ width: 8 }} /> : null}
              {venuesCount ? (
                <Badge prefix="🔒" text={String(venuesCount)} />
              ) : null}
              {directorsCount ? <View style={{ width: 8 }} /> : null}
              {directorsCount ? (
                <Badge prefix="👤" text={String(directorsCount)} />
              ) : null}
            </View>

            <View style={{ height: 16 }} />

            {/* fields */}
            <Row label="Email" value={user.email} />
            <Row label="Username" value={user.user_name || user.name} />
            <Row label="Role" value={ROLE_LABEL[user.role]} />
            <Row label="Created" value={fmtDate(user.created_at)} />
            <Row label="UUID" value={user.id} />

            {/* danger zone */}
            <View style={{ marginTop: 18, alignItems: "center" }}>
              <Pressable
                onPress={() => onDelete(user)}
                accessibilityRole="button"
                style={{
                  backgroundColor: "#b91c1c",
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#7a1f1f",
                  minWidth: 160,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "800" }}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

/* ---------- user card (full / role-only) ---------- */
function UserCard({
  u,
  compact,
  onOpenDetails,
  onChangeRole,
  onAddVenue,
  onAddDirector,
  onDelete,
  onEdit, // NEW
}: {
  u: ICAUserData;
  compact: boolean;
  onOpenDetails: (u: ICAUserData) => void;
  onChangeRole: (id: string, role: EUserRole) => void;
  onAddVenue: (id: string) => void;
  onAddDirector: (id: string) => void;
  onDelete: (u: ICAUserData) => void;
  onEdit: (u: ICAUserData) => void;
}) {
  const [roleOpen, setRoleOpen] = useState(false);
  const venuesCount = venuesCountOf(u);
  const directorsCount = directorsCountOf(u);

  return (
    <View
      style={{
        backgroundColor: "#161618",
        borderColor: BaseColors.PanelBorderColor,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        marginBottom: BasePaddingsMargins.m15,
        overflow: "hidden",
        maxWidth: "100%",
      }}
    >
      {/* header */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* tap avatar/name to open details */}
        <Pressable
          onPress={() => onOpenDetails(u)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#222228",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: BaseColors.PanelBorderColor,
              marginRight: 12,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>
              {initials(u.user_name || u.name)}
            </Text>
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={{ color: "white", fontSize: 16, fontWeight: "800" }}
              numberOfLines={1}
            >
              {u.user_name || u.name || "User"}
            </Text>

            {!compact ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 4,
                  }}
                >
                  <Badge text={`User ID: ${formatUserId(u.id_auto)}`} />
                  {u.created_at ? <View style={{ width: 8 }} /> : null}
                  {u.created_at ? (
                    <Badge text={`Joined ${fmtDate(u.created_at)}`} />
                  ) : null}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  <RoleChip role={u.role} />
                  {venuesCount ? <View style={{ width: 8 }} /> : null}
                  {venuesCount ? (
                    <Badge prefix="🔒" text={String(venuesCount)} />
                  ) : null}
                  {directorsCount ? <View style={{ width: 8 }} /> : null}
                  {directorsCount ? (
                    <Badge prefix="👤" text={String(directorsCount)} />
                  ) : null}
                </View>

                {u.email ? (
                  <Text
                    style={{
                      color: "#9ca3af",
                      marginTop: 4,
                      fontSize: TextsSizes.small,
                    }}
                    numberOfLines={1}
                  >
                    {u.email}
                  </Text>
                ) : null}
              </>
            ) : (
              // role-only row (tap anywhere left area to open details)
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <RoleChip role={u.role} />
                {venuesCount ? <View style={{ width: 8 }} /> : null}
                {venuesCount ? (
                  <Badge prefix="🔒" text={String(venuesCount)} />
                ) : null}
                {directorsCount ? <View style={{ width: 8 }} /> : null}
                {directorsCount ? (
                  <Badge prefix="👤" text={String(directorsCount)} />
                ) : null}
              </View>
            )}
          </View>
        </Pressable>

        {/* right-side icons */}
        {compact ? (
          <View style={{ flexDirection: "row", marginLeft: 8 }}>
            {/* NEW: pencil on compact */}
            <Pressable
              onPress={() => onEdit(u)}
              hitSlop={10}
              accessibilityRole="button"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                marginRight: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1b2130",
                borderWidth: 1,
                borderColor: "#26354f",
              }}
            >
              <Ionicons name="create-outline" size={18} color="#93c5fd" />
            </Pressable>

            <Pressable
              onPress={() => onDelete(u)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Delete user"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#221416",
                borderWidth: 1,
                borderColor: "#7a1f1f",
              }}
            >
              <Ionicons name="trash" size={18} color="#ef4444" />
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* full controls */}
      {!compact && (
        <View style={{ marginTop: 12 }}>
          <Pressable
            onPress={() => setRoleOpen(true)}
            style={{
              borderWidth: 1,
              borderColor: BaseColors.PanelBorderColor,
              backgroundColor: "#111214",
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
              alignSelf: "flex-start",
              maxWidth: "100%",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              {ROLE_LABEL[u.role]}
            </Text>
          </Pressable>

          <View
            style={{ flexDirection: "row", marginTop: 10, flexWrap: "wrap" }}
          >
            <LFButton
              type="secondary"
              label="Add Venue"
              onPress={() => onAddVenue(u.id)}
            />
            <View style={{ width: 10 }} />
            <LFButton
              type="secondary"
              label="Add Director"
              onPress={() => onAddDirector(u.id)}
            />
            <View style={{ width: 10 }} />
            {/* NEW: prominent edit button on Full view */}
            <LFButton
              type="primary"
              label="Edit Profile"
              icon="create"
              onPress={() => onEdit(u)}
            />
          </View>

          {/* centered, shorter delete */}
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <Pressable
              onPress={() => onDelete(u)}
              accessibilityRole="button"
              style={{
                backgroundColor: "#b91c1c",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#7a1f1f",
                minWidth: 160,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "800" }}>Delete</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* single, clean role modal (card-level) */}
      <Modal visible={!compact && roleOpen} transparent animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 24,
          }}
          activeOpacity={1}
          onPress={() => setRoleOpen(false)}
        >
          <View
            style={{
              backgroundColor: "#17181a",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: BaseColors.PanelBorderColor,
              overflow: "hidden",
            }}
          >
            {(
              [
                EUserRole.BasicUser,
                EUserRole.BarAdmin,
                EUserRole.TournamentDirector,
                EUserRole.CompeteAdmin,
                EUserRole.MasterAdministrator,
              ] as const
            ).map((r) => (
              <Pressable
                key={r}
                onPress={() => {
                  setRoleOpen(false);
                  onChangeRole(u.id, r);
                }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: BaseColors.PanelBorderColor,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>
                  {ROLE_LABEL[r]}
                </Text>
              </Pressable>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/* ---------- screen ---------- */
export default function ScreenAdminUsers() {
  const { user } = useContextAuth();

  const [users, setUsers] = useState<ICAUserData[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>(""); // '' = all
  const [modeFull, setModeFull] = useState(false); // default to Role Only

  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toDelete = useRef<ICAUserData | null>(null);

  // details sheet state
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailsUser, setDetailsUser] = useState<ICAUserData | null>(null);

  // suggestions dropdown state
  const [showSuggestions, setShowSuggestions] = useState(false);

  // NEW: sort state
  const [sortBy, setSortBy] = useState<SortBy>("hierarchy");

  // NEW: edit modal state
  const [editVisible, setEditVisible] = useState(false);
  const [editUser, setEditUser] = useState<ICAUserData | null>(null);

  // fetch on search/filter
  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        setLoading(true);
        const roleArg = roleFilter
          ? (roleFilter as unknown as EUserRole)
          : undefined;
        const { data } = await FetchUsersV2(
          user as ICAUserData,
          search,
          roleArg,
          ""
        );
        const arr: ICAUserData[] = Array.isArray(data) ? (data as any) : [];
        setUsers(arr);
        setLoading(false);
      })();
    }, TIMEOUT_DELAY_WHEN_SEARCH);
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  // initial
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await FetchUsersV2(
        user as ICAUserData,
        "",
        undefined,
        ""
      );
      const arr: ICAUserData[] = Array.isArray(data) ? (data as any) : [];
      setUsers(arr);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search && !roleFilter) return users;
    let u = users;
    if (roleFilter) u = u.filter((x) => String(x.role) === roleFilter);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      u = u.filter(
        (x) =>
          (x.user_name || x.name || "").toLowerCase().includes(s) ||
          (x.email || "").toLowerCase().includes(s) ||
          String(x.id_auto || "").includes(s)
      );
    }
    return u;
  }, [users, search, roleFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    return arr.sort((a, b) => {
      if (sortBy === "role-az")
        return ROLE_LABEL[a.role].localeCompare(ROLE_LABEL[b.role]);
      if (sortBy === "role-za")
        return ROLE_LABEL[b.role].localeCompare(ROLE_LABEL[a.role]);

      const ra = ROLE_ORDER[a.role] ?? 999;
      const rb = ROLE_ORDER[b.role] ?? 999;
      if (ra !== rb) return ra - rb;

      const an = (a.user_name || a.name || "").toString();
      const bn = (b.user_name || b.name || "").toString();
      const nameCmp = an.localeCompare(bn);
      if (nameCmp !== 0) return nameCmp;
      return String(a.id_auto || "").localeCompare(String(b.id_auto || ""));
    });
  }, [filtered, sortBy]);

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return users
      .filter(
        (u) =>
          (u.user_name || u.name || "").toLowerCase().includes(q) ||
          String(u.id_auto || "").includes(q)
      )
      .slice(0, 8);
  }, [users, search]);

  // actions
  const handleChangeRole = async (id: string, newRole: EUserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    ); // optimistic
    if (detailsUser && detailsUser.id === id) {
      setDetailsUser({ ...detailsUser, role: newRole } as ICAUserData);
    }
    await UpdateProfile(id, { role: newRole });
  };
  const handleAddVenue = (_id: string) => {};
  const handleAddDirector = (_id: string) => {};
  const askDelete = (u: ICAUserData) => {
    toDelete.current = u;
    setConfirmDelete(true);
  };
  const doDelete = async () => {
    setConfirmDelete(false);
    const u = toDelete.current;
    if (!u) return;
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    if (detailsUser?.id === u.id) {
      setDetailsVisible(false);
      setDetailsUser(null);
    }
    await DeleteUser(u);
    toDelete.current = null;
  };

  const openDetails = (u: ICAUserData) => {
    setDetailsUser(u);
    setDetailsVisible(true);
  };
  const closeDetails = () => {
    setDetailsVisible(false);
    setDetailsUser(null);
  };

  // edit handlers
  const openEdit = (u: ICAUserData) => {
    setEditUser(u);
    setEditVisible(true);
  };
  const closeEdit = () => {
    setEditVisible(false);
    setEditUser(null);
  };
  const applyEditLocally = (partial: Partial<ICAUserData>) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editUser?.id ? ({ ...u, ...partial } as ICAUserData) : u
      )
    );
    if (detailsUser && detailsUser.id === editUser?.id) {
      setDetailsUser({ ...detailsUser, ...partial } as ICAUserData);
    }
  };

  return (
    <>
      <ScreenScrollView>
        <View style={{ padding: BasePaddingsMargins.m15 }}>
          <ScreenAdminDropdownNavigation />

          {/* top buttons */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: 8 as any,
              columnGap: 8 as any,
              marginBottom: BasePaddingsMargins.m10,
            }}
          >
            <LFButton
              type="secondary"
              label="Deleted"
              icon="trash"
              onPress={() => {}}
            />
            <LFButton
              type="secondary"
              label="Analytics"
              icon="bar-chart"
              onPress={() => {}}
            />
          </View>

          {/* search/filter/assign */}
          <UIPanel>
            {/* Search input */}
            <LFInput
              placeholder="Search users..."
              label=""
              onChangeText={(t: string) => {
                setSearch(t);
                setShowSuggestions(!!t.trim());
              }}
              onFocus={() => setShowSuggestions(!!search.trim())}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              marginBottomInit={BasePaddingsMargins.m10}
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 ? (
              <View
                style={{
                  backgroundColor: "#101113",
                  borderWidth: 1,
                  borderColor: BaseColors.PanelBorderColor,
                  borderRadius: 10,
                  marginTop: -6,
                  marginBottom: 10,
                  overflow: "hidden",
                  maxHeight: 240,
                }}
              >
                <ScrollView>
                  {suggestions.map((u) => (
                    <Pressable
                      key={u.id}
                      onPress={() => {
                        setSearch(
                          u.user_name || u.name || String(u.id_auto || "")
                        );
                        setShowSuggestions(false);
                        openDetails(u);
                      }}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: BaseColors.PanelBorderColor,
                      }}
                    >
                      <Text
                        style={{ color: "white", fontWeight: "700" }}
                        numberOfLines={1}
                      >
                        {u.user_name || u.name || "User"}
                      </Text>
                      <Text style={{ color: "#9ca3af", marginTop: 2 }}>
                        User ID: {formatUserId(u.id_auto)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexGrow: 1,
                  flexBasis: 220,
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                <LFInput
                  typeInput="dropdown"
                  placeholder="Filter by role"
                  defaultValue=""
                  items={[{ label: "All Roles", value: "" }, ...UserRoles]}
                  onChangeText={(v: string) => setRoleFilter(v)}
                />
              </View>

              <View style={{ width: 160, marginBottom: 10 }}>
                <LFButton
                  type="secondary"
                  label="Assign Venues"
                  icon="business"
                  onPress={() => {}}
                />
              </View>
            </View>

            {/* Sort bar */}
            <View style={{ marginTop: 6, marginBottom: 6 }}>
              <Text style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>
                Sort
              </Text>
              <View style={{ flexDirection: "row" }}>
                <SortPill
                  label="Role A–Z"
                  active={sortBy === "role-az"}
                  onPress={() => setSortBy("role-az")}
                />
                <SortPill
                  label="Role Z–A"
                  active={sortBy === "role-za"}
                  onPress={() => setSortBy("role-za")}
                />
                <SortPill
                  label="Hierarchy"
                  active={sortBy === "hierarchy"}
                  onPress={() => setSortBy("hierarchy")}
                />
              </View>
            </View>

            {/* view toggle + create */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#111214",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: BaseColors.PanelBorderColor,
                  overflow: "hidden",
                  flexShrink: 1,
                }}
              >
                <Pressable
                  onPress={() => setModeFull(true)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    backgroundColor: modeFull ? "#1c1c20" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: modeFull ? "white" : "#9ca3af",
                      fontWeight: "700",
                    }}
                  >
                    Full
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setModeFull(false)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    backgroundColor: !modeFull ? "#1c1c20" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: !modeFull ? "white" : "#9ca3af",
                      fontWeight: "700",
                    }}
                  >
                    Role Only
                  </Text>
                </Pressable>
              </View>

              <View style={{ width: 10 }} />

              {user?.role === EUserRole.MasterAdministrator ? (
                <View style={{ width: 160, marginTop: 8 }}>
                  <LFButton
                    type="primary"
                    label="Create User"
                    icon="person-add"
                    onPress={() => setShowCreate((v) => !v)}
                  />
                </View>
              ) : null}
            </View>
          </UIPanel>

          {/* create user panel */}
          {user?.role === EUserRole.MasterAdministrator && showCreate ? (
            <UIPanel>
              <FormCreateNewUser
                type="for-administrator"
                AfterRegisteringNewUser={() => {
                  setShowCreate(false);
                  setSearch("");
                }}
                EventAfterCloseTheForm={() => setShowCreate(false)}
              />
            </UIPanel>
          ) : null}

          {/* list */}
          <Text
            style={{
              color: "white",
              fontSize: TextsSizes.h4,
              fontWeight: "800",
              marginTop: BasePaddingsMargins.m10,
              marginBottom: BasePaddingsMargins.m10,
            }}
          >
            Users
          </Text>

          <View style={{ maxWidth: "100%" }}>
            {sorted.map((u) => (
              <UserCard
                key={u.id}
                u={u}
                compact={!modeFull}
                onOpenDetails={openDetails}
                onChangeRole={handleChangeRole}
                onAddVenue={handleAddVenue}
                onAddDirector={handleAddDirector}
                onDelete={askDelete}
                onEdit={openEdit} // NEW
              />
            ))}
            {!loading && sorted.length === 0 ? (
              <Text
                style={{ color: "#9ca3af", textAlign: "center", marginTop: 20 }}
              >
                No users found.
              </Text>
            ) : null}
            {loading ? (
              <Text
                style={{ color: "#9ca3af", textAlign: "center", marginTop: 20 }}
              >
                Loading…
              </Text>
            ) : null}
          </View>
        </View>
      </ScreenScrollView>

      {/* details pop out */}
      <UserDetailsSheet
        visible={detailsVisible}
        user={detailsUser}
        onClose={closeDetails}
        onChangeRole={handleChangeRole}
        onAddVenue={handleAddVenue}
        onAddDirector={handleAddDirector}
        onDelete={(u) => {
          closeDetails();
          askDelete(u);
        }}
        onEdit={(u) => {
          closeDetails();
          openEdit(u);
        }}
      />

      {/* EDIT PROFILE modal */}
      <EditUserProfileModal
        visible={editVisible}
        user={editUser}
        onClose={closeEdit}
        onSaved={applyEditLocally}
      />

      {/* confirm delete */}
      <ModalInfoMessage
        message="Are you sure you want to delete this account?"
        id={1001}
        visible={confirmDelete}
        set_visible={setConfirmDelete}
        buttons={[
          <LFButton
            key="c"
            type="secondary"
            label="Cancel"
            onPress={() => setConfirmDelete(false)}
          />,
          <LFButton key="d" type="danger" label="Delete" onPress={doDelete} />,
        ]}
      />
    </>
  );
}
