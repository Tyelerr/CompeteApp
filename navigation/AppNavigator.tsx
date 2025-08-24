import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, Text, View } from "react-native";
import { TRootTabParamList } from "./Interface";
import StackHome from "./StackHome";
import { BaseColors } from "../hooks/Template";
import { useEffect } from "react";
import StackProfileLoginRegister from "./StackProfileLoginRegister";
import { useContextAuth } from "../context/ContextAuth";
import StackAdmin from "./StackAdmin";
import StackHeader from "./StackHeader";
import StackProfileAdmin from "./StackProfileAdmin";
import StackSubmit from "./StackSubmit";
import ScreenFAQs from "../screens/FAQs/ScreenFAQs";
import StackBilliards from "./StackBilliards";
import { EUserRole, ICAUserData } from "../hooks/InterfacesGlobal";
import TabBarIconElement from "./TabBarIcon";
import CustomTabNavigator from "./CustomTabNavigator";
import StackShop from "./StackShop";

const Tab = createBottomTabNavigator<TRootTabParamList>();
const Stack = createNativeStackNavigator();

// Dark theme so background never flashes white
const DarkNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: BaseColors.backgroundColor,
    card: BaseColors.backgroundColor,
    border: BaseColors.secondary,
    text: "#fff",
    primary: BaseColors.primary,
  },
};

const CompTemp = function () {
  return (
    <View>
      <Text>Temporary Component {Math.random()}</Text>
    </View>
  );
};

const NavigatorBarSettings = () => {
  if (Platform.OS === "android") {
    // Add Android nav bar styling if you want
  }
};

const TabScreenHome = () => (
  <Tab.Screen
    key={`tab-screen-HomeTab`}
    name="HomeTab"
    options={{
      title: "Home",
      headerShown: false,
      iconName: "home",
      tabBarIcon: ({ focused }) => (
        <TabBarIconElement focused={focused as boolean} icon={"home"} />
      ),
    }}
    component={StackHome}
  />
);

const TabScreenBilliards = () => (
  <Tab.Screen
    key={`tab-screen-BilliardsTab`}
    name="BilliardsTab"
    options={{
      title: "Billiards",
      iconName: "trophy",
      tabBarIcon: ({ focused }) => (
        <TabBarIconElement focused={focused as boolean} icon={"trophy"} />
      ),
    }}
    component={StackBilliards}
  />
);

const TabScreenProfile = () => (
  <Tab.Screen
    key={`tab-screen-ProfileTab`}
    name="ProfileTab"
    options={{
      title: "Profile",
      headerShown: false,
      iconName: "person",
      tabBarIcon: ({ focused }) => (
        <TabBarIconElement focused={focused as boolean} icon={"person"} />
      ),
    }}
    component={StackProfileLoginRegister}
  />
);

const TabScreenProfileLogged = () => (
  <Tab.Screen
    key={`tab-screen-ProfileLoggedTab`}
    name="ProfileLoggedTab"
    options={{
      title: "Profile",
      headerShown: false,
      iconName: "person",
      tabBarIcon: ({ focused }) => (
        <TabBarIconElement focused={focused as boolean} icon={"person"} />
      ),
    }}
    component={StackProfileAdmin}
  />
);

const TabShop = () => (
  <Tab.Screen
    key={`tab-screen-Shop`}
    name="ShopTab"
    options={{
      title: "Shop",
      headerShown: false,
      iconName: "bag-handle",
      tabBarIcon: ({ focused }) => (
        <TabBarIconElement focused={focused as boolean} icon={"bag-handle"} />
      ),
    }}
    component={StackShop}
  />
);

const TabScreenAdmin = () => (
  <Tab.Screen
    key={`tab-screen-AdminTab`}
    name="AdminTab"
    options={{
      title: "Admin",
      headerShown: false,
      iconName: "settings",
      tabBarIcon: ({ focused }) => (
        <TabBarIconElement focused={focused as boolean} icon={"settings"} />
      ),
    }}
    component={StackAdmin}
  />
);

const TabScreenSubmit = () => (
  <Tab.Screen
    key={`tab-screen-SubmitTab`}
    name="SubmitTab"
    options={{
      title: "Submit",
      headerShown: false,
      iconName: "add-circle",
      tabBarIcon: ({ focused }) => (
        <TabBarIconElement focused={focused as boolean} icon={"add-circle"} />
      ),
    }}
    component={StackSubmit}
  />
);

const TabScreenFAQTab = () => (
  <Tab.Screen
    key={`tab-screen-FAQTab`}
    name="FAQTab"
    options={{
      title: "FAQ",
      headerShown: true,
      header: () => (
        <StackHeader
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions and get in touch with support"
          type="centered-no-icon"
        />
      ),
      iconName: "help-circle",
      tabBarIcon: ({ focused }) => (
        <TabBarIconElement focused={focused as boolean} icon={"help-circle"} />
      ),
    }}
    component={ScreenFAQs}
  />
);

const AppTabNavigatorLogged = (user: ICAUserData) => {
  useEffect(() => {
    NavigatorBarSettings();
  }, []);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabNavigator {...props} />}
      key={`tab-navigator-logged`}
      initialRouteName={"HomeTab"}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BaseColors.primary,
        tabBarHideOnKeyboard: true, // avoid tabbar popping over inputs
        sceneContainerStyle: {
          backgroundColor: BaseColors.backgroundColor, // no white flashes
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderColor: BaseColors.contentSwitcherBackgroundCOlor,
          backgroundColor: BaseColors.backgroundColor,
          paddingBottom: 0,
          paddingTop: 10,
          height: 110,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
          fontSize: 12,
        },
      }}
    >
      {TabScreenHome()}
      {TabScreenBilliards()}
      {user.role === EUserRole.BasicUser ? null : TabScreenSubmit()}
      {user?.role === EUserRole.MasterAdministrator ? TabScreenAdmin() : null}
      {TabScreenProfileLogged()}
      {TabShop()}
      {TabScreenFAQTab()}
    </Tab.Navigator>
  );
};

const AppTabNavigator = () => {
  useEffect(() => {
    NavigatorBarSettings();
  }, []);

  return (
    <Tab.Navigator
      key={`tab-navigator-not-logged`}
      tabBar={(props) => <CustomTabNavigator {...props} />}
      initialRouteName={"HomeTab"}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BaseColors.primary,
        tabBarHideOnKeyboard: true,
        sceneContainerStyle: {
          backgroundColor: BaseColors.backgroundColor,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderColor: BaseColors.contentSwitcherBackgroundCOlor,
          backgroundColor: BaseColors.backgroundColor,
          paddingBottom: 0,
          paddingTop: 10,
          height: 110,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
          fontSize: 12,
        },
      }}
    >
      {TabScreenHome()}
      {TabScreenBilliards()}
      {TabScreenProfile()}
      {TabScreenFAQTab()}
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  const { isLogged, user } = useContextAuth();

  if (isLogged)
    return (
      <NavigationContainer
        key={"logged-navigation-container"}
        theme={DarkNavTheme}
      >
        {AppTabNavigatorLogged(user as ICAUserData)}
      </NavigationContainer>
    );

  return (
    <NavigationContainer
      key={"not-logged-navigation-container"}
      theme={DarkNavTheme}
    >
      {AppTabNavigator()}
    </NavigationContainer>
  );
}
