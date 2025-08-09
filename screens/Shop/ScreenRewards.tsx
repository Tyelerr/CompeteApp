import ScreenHomeSubNavigation from "../Home/ScreenHomeSubNavigation";
import ScreenScrollView from "../ScreenScrollView";
// import ScreenHomeSubNavigation from "./ScreenHomeSubNavigation";
import { View, Text, Alert } from "react-native";
import ShopSubNavigation from "./ShopSubNavigation";

export default function ScreenRewards(){
  
  // // // // // // // console.log('BBBB');
  // Alert.alert('BBBBBB');

  return <ScreenScrollView>

    <ShopSubNavigation />

    <View>
      <Text>ScreenHomePlayerSpotlight</Text>
    </View>

  </ScreenScrollView>
}