import ScreenScrollView from "../ScreenScrollView";
import ScreenHomeSubNavigation from "./ScreenHomeSubNavigation";
import { View, Text, Alert } from "react-native";

export default function ScreenHomePlayerSpotlight(){
  
  // // // // // // // // // // console.log('BBBB');
  // Alert.alert('BBBBBB');

  return <ScreenScrollView>

    <ScreenHomeSubNavigation />

    <View>
      <Text>ScreenHomePlayerSpotlight</Text>
    </View>

  </ScreenScrollView>
}