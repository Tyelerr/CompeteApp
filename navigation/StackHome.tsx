// navigation/StackHome.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TRootStackParamList } from "./Interface";
import { ScrollView, Text, View } from "react-native";
import { StyleZ } from "../assets/css/styles";

import StackHeader from "./StackHeader";

// Home screens
import ScreenHome from "../screens/Home/ScrenHome";
import ScreenHomePlayerSpotlight from "../screens/Home/ScreenHomePlayerSpotlight";
import ScreenHomeBarOfTheMonth from "../screens/Home/ScreenHomeBarOfTheMonth";
import ScreenHomeFeaturedPlayer from "../screens/Home/ScreenHomeFeaturedPlayer";
import ScreenHomeFeaturedBar from "../screens/Home/ScreenHomeFeaturedBar";

// ✅ FAQ screen
import ScreenFAQs from "../screens/FAQs/ScreenFAQs";

// const Stack = createNativeStackNavigator<TRootStackParamList>();
const Stack = createNativeStackNavigator();

/* (kept from your original file; unused demo stubs) */
const latestNews = () => {
  return (
    <View>
      <Text>Those will be the latest news</Text>
    </View>
  );
};
const BarOfTheMonth = () => {
  return (
    <View>
      <Text>Those will be the latest bar of the month</Text>
    </View>
  );
};

export default function StackHome() {
  const HomeScreensArr = [
    { name: "LatestNews", component: ScreenHome },
    { name: "PlayerSpotlight", component: ScreenHomePlayerSpotlight },
    { name: "BarOfTheMonth", component: ScreenHomeBarOfTheMonth },
    { name: "HomeFeaturedPlayer", component: ScreenHomeFeaturedPlayer },
    { name: "HomeFeaturedBar", component: ScreenHomeFeaturedBar },
  ] as const;

  const HomeHeader = () => (
    <StackHeader
      title="Billiards Hub"
      subtitle="Your source for the latest pool news and updates"
      type="centered-no-icon"
    />
  );

  const FaqHeader = () => (
    <StackHeader
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions and get in touch with support"
      type="centered-no-icon"
    />
  );

  return (
    <Stack.Navigator
      initialRouteName="LatestNews"
      screenOptions={{
        animation: "none",
        animationDuration: 0,
        headerStyle: {
          backgroundColor: StyleZ.colors.backgroundColor,
        },
      }}
    >
      {HomeScreensArr.map((obj, key: number) => (
        <Stack.Screen
          key={`home-screen-${key}`}
          name={obj.name as string}
          component={obj.component as any}
          options={{
            headerShown: true,
            header: HomeHeader,
            headerStyle: {
              backgroundColor: StyleZ.colors.backgroundColor,
            },
            // 🔒 Only hide back button on the root screen
            headerBackVisible: obj.name === "LatestNews" ? false : true,
            title: "home home",
          }}
        />
      ))}

      {/* ✅ FAQ as a push screen */}
      <Stack.Screen
        name="FAQ"
        component={ScreenFAQs}
        options={{
          headerShown: true,
          header: FaqHeader,
          headerStyle: {
            backgroundColor: StyleZ.colors.backgroundColor,
          },
          headerBackVisible: true,
        }}
      />

      {/* ✅ Legacy alias so existing navigation.navigate("FAQTab") still works */}
      <Stack.Screen
        name="FAQTab"
        component={ScreenFAQs}
        options={{
          headerShown: true,
          header: FaqHeader,
          headerStyle: {
            backgroundColor: StyleZ.colors.backgroundColor,
          },
          headerBackVisible: true,
        }}
      />
    </Stack.Navigator>
  );
}
