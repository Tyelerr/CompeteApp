import { Text } from "react-native";
import StackHeader from "./StackHeader";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScreenAdminUsers from "../screens/Admin/ScreenAdminUsers";
import ScreenAdminPending from "../screens/Admin/ScreenAdminPending";
import ScreenAdminApproved from "../screens/Admin/ScreenAdminApproved";
import ScreenAdminDeleted from "../screens/Admin/ScreenAdminDeleted";
import ScreenAdminAnalytics from "../screens/Admin/ScreenAdminAnalytics";
import ScreenAdminMessages from "../screens/Admin/ScreenAdminMessages";
import ScreenShop from "../screens/Shop/ScreenShop";
import ScreenRewards from "../screens/Shop/ScreenRewards";

const Stack = createNativeStackNavigator();



const ExampleScreen = ()=>{
  return <Text>Example messages</Text>
}

export default function StackShop({navigation, route}){

  const ArrayAdminScreens = [
    { name: 'ShopHome', component: ScreenShop },
    { name: 'ShopRewards', component: ScreenRewards },
    /*{ name: 'AdminApproved', component: ScreenAdminApproved },
    { name: 'AdminDeleted', component: ScreenAdminDeleted },
    { name: 'AdminAnalytics', component: ScreenAdminAnalytics },
    { name: 'AdminMessages', component: ScreenAdminMessages },*/
  ];

  return <Stack.Navigator
    initialRouteName="ShopHome"
    // initialRouteName="AdminPending"
    screenOptions={
      {
        animation: "none",
        animationDuration: 0,
        // statusBarAnimation: 'none',
        // headerShown: false, 
        header: ()=> <StackHeader 
          title="Shope" 
          subtitle="Discover unique finds and everyday essentials at our welcoming shop."
          type="centered-no-icon"
          />,
      }
    }
  >
    {
      ArrayAdminScreens.map((obj, key:number)=>{
        return <Stack.Screen
          key={`admin-screen-${key}`}
          name={obj.name}
          component={obj.component}
        />;
      })
    }
  </Stack.Navigator>
}