import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Text, TouchableOpacity, View } from "react-native";
// import { Text } from "react-native-svg";
import { StyleZ } from "../assets/css/styles";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../hooks/Template";
import { Ionicons } from "@expo/vector-icons";


export interface IContentSwitcherButtonDetails{
  title: string,
  route?: string,
  icon?: keyof typeof Ionicons.glyphMap
};


export default function ContentSwitcher({buttonsDetails}:{
  buttonsDetails:IContentSwitcherButtonDetails[]
}){

  const navigation = useNavigation();
  const route = useRoute();

  // // // // // // console.log('buttonsDetails:', buttonsDetails);

  return <View style={
    [
      {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flex: 1,
        flexWrap: 'nowrap',
        backgroundColor: BaseColors.contentSwitcherBackgroundCOlor,
        borderRadius: 5,
        padding: 3,
        marginBlockEnd: BasePaddingsMargins.sectionMarginBottom
      }
    ]
  }>
    {buttonsDetails.map((obj:IContentSwitcherButtonDetails, key:number)=>{
      return <TouchableOpacity key={`navigation-item-${key}`}
        style={[
          {
            width: `${100/buttonsDetails.length}%`,
          },
          StyleZ.contentSwitcherButton,
          (obj.route===route.name?StyleZ.contentSwitcherButtonActive:null),
          {
            marginBottom: 0,
            // width: '100%',
            padding: 0,
            display: 'flex'
          }
        ]} 
        activeOpacity={1}
        onPress={()=>{
        if(obj.route!==undefined)
          navigation.navigate(obj.route, {});
      }}>
        <View style={{
          // flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
          // backgroundColor: 'yellow',
          width: '100%'
        }}>

          {
            obj.icon!==undefined
            ?
            <Ionicons name={obj.icon} size={15} color={StyleZ.contentSwitcherButton.color} style={{
              // marginRight: BasePaddingsMargins.m10
              marginBottom: BasePaddingsMargins.m5,
            }} />
            :
            null
          }

          <Text 
            style={
            {
              // backgroundColor: 'red',
              display: 'flex',
              width: '100%',
              textAlign: 'center',
              color: BaseColors.light,
              fontSize: TextsSizes.small,
              fontFamily:"BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            }
          }  >{obj.title}</Text>
        </View>
      </TouchableOpacity>

    })}
  </View>
}