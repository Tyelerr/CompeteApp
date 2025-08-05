import { TouchableOpacity, View, Text, Button, Alert } from "react-native";
import { StyleZ } from "../../assets/css/styles";
import { useNavigation } from "@react-navigation/native";

export default function LFForgotPasswordLink(
  {
    label,
    route,
  }
  :
  {
    label:string,
    route:string
  }
){

  
  const navigation = useNavigation();
  // const route = useRoute();

  return <View style={StyleZ.LFForgotPasswordLink_Container}>
    <TouchableOpacity onPress={()=>{
      navigation.navigate(route, {});
    }}>
      <Text style={StyleZ.LFForgotPasswordLink}>
        {label}
      </Text>
    </TouchableOpacity>
  </View>
}