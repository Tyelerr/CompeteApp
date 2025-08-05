import { View } from "react-native";
import UIPanel from "../../components/UI/UIPanel";
import ScreenScrollView from "../ScreenScrollView";
import ScreenAdminDropdownNavigation from "./ScreenAdminDropdownNavigation";

export default function ScreenAdminMessages(){
  return <ScreenScrollView>
    <View>
      <ScreenAdminDropdownNavigation />
    </View>
  </ScreenScrollView>
}