import { Text, View } from "react-native";
import { StyleZ } from "../../assets/css/styles";
import { BasePaddingsMargins } from "../../hooks/Template";

export default function LoginFormHeading({
  title, subtitle
}:{
  title:string,
  subtitle?:string
}){
  return <View style={[
    StyleZ.loginFormHeading
  ]}>
    <Text style={[
      StyleZ.headerTitleStyle,
      {
        textAlign: 'center',
        marginBottom: BasePaddingsMargins.titleMarginBottom,
      }
    ]}>{title}</Text>
    {
      subtitle!==undefined?
      <Text style={[
        StyleZ.headerSubtitleStyle,
        {
          textAlign: 'center'
        }
      ]}>{subtitle}</Text>
      :
      null
    }
    
  </View>
}