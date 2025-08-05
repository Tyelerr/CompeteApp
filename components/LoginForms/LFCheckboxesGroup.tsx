import { View } from "react-native";
import { BasePaddingsMargins } from "../../hooks/Template";

export default function LFCheckboxesGroup({checkboxes}:{checkboxes:React.ReactNode[]}){
  return <View style={{
    marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
  }}>
    {
      checkboxes.map((checkbox, key)=>{
        return <View key={`checkbox-${key}`} style={{
          marginBottom: key<checkboxes.length-1?BasePaddingsMargins.m10 : 0
        }}>{checkbox}</View>
      })
    }
  </View>
}