import { SafeAreaView, ScrollView, View } from "react-native";
import { BaseColors, BasePaddingsMargins } from "../hooks/Template";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function ScreenScrollView({children}:{children:React.ReactNode}){
  
  return <View style={{
      flex: 1,
      height: '100%',
    }}>
      <SafeAreaView style={{
        flex: 1,
        height: '100%'
      }}>
    <ScrollView style={{
        // marginInline: 16,
        paddingInline: BasePaddingsMargins.marginInline,
        // paddingBlock: 5,
        
        backgroundColor: BaseColors.backgroundColor,
        // backgroundColor: 'yellow',
        
        // backgroundColor: 'blue',
        // paddingBlockStart: 10,
        // paddingBlockEnd: 40
        height: '100%',
        flex: 1,
        // alignItems: 'center'
      
      }}>
        {children}
    </ScrollView>
    </SafeAreaView>
  </View>;
    
}