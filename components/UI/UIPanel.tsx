import { StyleProp, View, ViewStyle } from "react-native";
import { StylePanel } from "../../assets/css/styles";

export default function UIPanel(
  {
    children,
    size,
    style
  }
  :
  {
    children:React.ReactNode,
    size?: 'default' | 'for-calendar',
    style?: StyleProp<ViewStyle>
  }
){
  return <View style={[
    StylePanel.defaultStyle,
    {position: 'relative'},
    (size === 'for-calendar' ? StylePanel.ForCalendar : null),
    (style!==undefined?style:{})
  ]}>
    {children}
  </View>
}