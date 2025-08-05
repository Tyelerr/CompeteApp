import { View } from "react-native";
import { StylePanel } from "../../assets/css/styles";

export default function UIPanel(
  {
    children,
    size
  }
  :
  {
    children:React.ReactNode,
    size?: 'default' | 'for-calendar'
  }
){
  return <View style={[
    StylePanel.defaultStyle,
    {position: 'relative'},
    (size === 'for-calendar' ? StylePanel.ForCalendar : null)
  ]}>
    {children}
  </View>
}