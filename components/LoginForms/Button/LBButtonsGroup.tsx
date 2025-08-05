import { View } from "react-native";
import { BasePaddingsMargins } from "../../../hooks/Template";

export default function LBButtonsGroup({buttons}:{buttons:React.ReactNode[]}){
  return <View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
  }}>
    {
      buttons.map((button:React.ReactNode, key:number)=>{
        return <View key={`button-${key}`} style={{
          // marginRight: key<buttons.length-1?BasePaddingsMargins.m10:0,
          width:'48%'
        }}>{button}</View>
      })
    }
  </View>
}