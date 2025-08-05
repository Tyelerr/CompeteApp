import { Text, View } from "react-native"
import UIPanel from "../../components/UI/UIPanel"
import { Ionicons } from "@expo/vector-icons"
import { StyleTournamentAnalytics } from "../../assets/css/styles"

export default function AnalyticsPanelAdmin(
  {
    icon,
    iconColor,
    value,
    label,
  }
  :
  {
    icon:keyof typeof Ionicons.glyphMap,
    iconColor: string,
    value:string,
    label:string
  }
){
  
  return <UIPanel>
    <View style={StyleTournamentAnalytics.container}>
      <View style={StyleTournamentAnalytics.cellTrophy}>
        <Ionicons name={icon} style={[
          StyleTournamentAnalytics.icon,
          {
            color: iconColor
          }
        ]} />
      </View>
      <View style={StyleTournamentAnalytics.cellTexts}>
        <Text style={StyleTournamentAnalytics.n}>{value}</Text>
        <Text style={StyleTournamentAnalytics.p}>{label}</Text>
      </View>
    </View>
  </UIPanel>
}