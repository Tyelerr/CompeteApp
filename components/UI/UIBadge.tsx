import { Text, View } from "react-native";
import { StyleBadge } from "../../assets/css/styles";

export default function UIBadge({
  label,
  marginBottom=0,
  type='default',
  size="small"
}:{
  label:string,
  marginBottom?: number,
  type?:'default' | 'secondary' | 'primary' | 'primary-outline', 
  size?:'small' | 'default' | 'bigger' | "big"
}){

  const _typeStyle = ()=>{
    if(type==='secondary')return StyleBadge.secondary;
    if(type==='primary')return StyleBadge.primary;
    if(type==='primary-outline')return StyleBadge.primaryOutline;
    return null;
  }
  const _typeStyleText = ()=>{
    if(type==='secondary')return StyleBadge.secondaryText;
    if(type==='primary')return StyleBadge.primaryText;
    if(type==='primary-outline')return StyleBadge.primaryOutlineText;
    return null;
  }

  const _typeSize = ()=>{
    if(size==='small')return StyleBadge.sizeSmall;
    return null;
  }
  const _fontSize = ()=>{
    if(size==='small')return StyleBadge.sizeSmall.fontSize;
    return StyleBadge.defaultTextStyle.fontSize;
  }

  return <View style={[
    StyleBadge.defaultStyle,
    {
      marginBottom: marginBottom
    },
    _typeStyle(),
    _typeSize()
  ]}>
    <Text style={[
      StyleBadge.defaultTextStyle,
      _typeStyleText(),
      {
        fontSize: _fontSize()
      }
    ]}>{label}</Text>
  </View>
}