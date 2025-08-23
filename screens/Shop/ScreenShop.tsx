import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import ScreenScrollView from "../ScreenScrollView";
import {
  BaseColors,
  BasePaddingsMargins,
  TextsSizes,
} from "../../hooks/Template";
import UIPanel from "../../components/UI/UIPanel";
import { Ionicons } from "@expo/vector-icons";
import { StyleZ } from "../../assets/css/styles";
import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import ShopSubNavigation, { ShopTab } from "./ShopSubNavigation";

import { useContextAuth } from "../../context/ContextAuth";
import { EUserRole } from "../../hooks/InterfacesGlobal";
import ShopManage from "./ShopManage";
import LFButton from "../../components/LoginForms/Button/LFButton";

interface INewsFeed {
  category?: { __cdata?: string }[];
  "dc:creator"?: { __cdata?: string } | string;
  description?: { __cdata?: string } | string;
  link: string;
  pubDate?: string;
  title: string;
}

export default function ScreenShop({ route }: { route?: any }) {
  const { user } = useContextAuth();
  const roleStr = String(user?.role ?? "").toLowerCase();
  const isMaster =
    user?.role === EUserRole.MasterAdministrator || roleStr.includes("master");

  // read initial tab from navigation param (e.g. { initialTab: 'manage' })
  const initialTabFromRoute: ShopTab | undefined = route?.params?.initialTab;

  const [tab, setTab] = useState<ShopTab>(initialTabFromRoute ?? "home");
  const [itemsNews, set_itemsNews] = useState<INewsFeed[]>([]);

  // if the param changes (navigating again), honor it
  useEffect(() => {
    if (initialTabFromRoute) setTab(initialTabFromRoute);
  }, [initialTabFromRoute]);

  useEffect(() => {
    if (!isMaster && tab === "manage") setTab("home");
  }, [isMaster, tab]);

  const fetchFeed = async () => {
    try {
      const response = await fetch("https://www.azbilliards.com/feed/");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const xmlText = await response.text();
      const parser = new XMLParser({
        ignoreAttributes: false,
        cdataPropName: "__cdata",
      });
      const result = parser.parse(xmlText);
      set_itemsNews(
        Array.isArray(result?.rss?.channel?.item) ? result.rss.channel.item : []
      );
    } catch (error) {
      console.error("Failed to fetch XML feed:", error);
    }
  };

  const openExternal = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert(`Don't know how to open this URL: ${url}`);
    } catch {
      Alert.alert("Failed to open link.");
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const cdataOr = (v: any, fallback = "") =>
    v && typeof v === "object" && typeof v.__cdata === "string"
      ? v.__cdata
      : typeof v === "string"
      ? v
      : fallback;

  const shortPub = (v?: string) => {
    if (!v) return "";
    return v.includes(" 20") ? v.split(" 20")[0] : v;
    // keeps the left part before year if their format matches
  };

  return (
    <ScreenScrollView>
      <ShopSubNavigation active={tab} onChange={setTab} isMaster={isMaster} />

      {/* ===== SHOP HOME ===== */}
      {tab === "home" && (
        <View>
          {itemsNews.map((news: INewsFeed, key: number) => (
            <UIPanel key={`panel-news-${key}`}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "10%" }}>
                  <Ionicons
                    name="star-outline"
                    style={{
                      fontSize: TextsSizes.h1,
                      color: BaseColors.warning,
                    }}
                  />
                </View>
                <View style={{ width: "88%" }}>
                  <Text style={[StyleZ.h2]}>{news.title}</Text>
                  <Text
                    style={[
                      StyleZ.p,
                      { marginBottom: BasePaddingsMargins.m20 },
                    ]}
                  >
                    {cdataOr(news.description ?? "", "").slice(0, 200)}
                    {cdataOr(news.description ?? "", "").length > 200
                      ? "..."
                      : ""}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "flex-start" }}
                    >
                      <Text
                        style={[
                          StyleZ.p,
                          { marginRight: BasePaddingsMargins.m10 },
                        ]}
                      >
                        {cdataOr(news["dc:creator"] ?? "", "")}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                        }}
                      >
                        <Ionicons
                          name="time"
                          style={[
                            StyleZ.p,
                            {
                              marginRight: BasePaddingsMargins.m5,
                              marginBottom: 0,
                            },
                          ]}
                        />
                        <Text style={[StyleZ.p, { marginBottom: 0 }]}>
                          {shortPub(news.pubDate)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => openExternal(news.link)}>
                      <Ionicons
                        name="open"
                        style={{
                          color: BaseColors.success,
                          fontSize: TextsSizes.h1,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </UIPanel>
          ))}
        </View>
      )}

      {/* ===== GIVEAWAYS (optional: keep your existing ScreenRewards route) ===== */}
      {tab === "rewards" && (
        <View>
          {/* You can render anything here or keep using your separate ScreenRewards screen */}
          <UIPanel>
            <Text style={{ color: "#9ca3af" }}>
              Giveaways content goes here.
            </Text>
          </UIPanel>
        </View>
      )}

      {/* ===== MANAGE (Master Admins only) ===== */}
      {isMaster && tab === "manage" && <ShopManage />}
    </ScreenScrollView>
  );
}
