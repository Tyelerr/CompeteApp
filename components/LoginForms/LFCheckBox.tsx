import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";

export default function LFCheckBox(
  {
    label,
    subLabel,
    checked,
    set_checked,
    type,
    onPress
  }
  :
  {
    label?:string,
    subLabel?: string,
    checked?: boolean,
    set_checked?: (v:boolean)=>void,
    type?:'default' | 'slider-yes-no',
    onPress?: ()=>void
  }
){
  
  const [_checkedLocal, _set__checkedLocal] = useState<boolean>(false);
  const isChecked = ()=>{
    return (checked!==undefined?checked:_checkedLocal);
  }


  if(type==='slider-yes-no'){
    
    return <View style={{
    }}>
      <TouchableOpacity
        onPress={()=>{
          _set__checkedLocal(!_checkedLocal);
          if(set_checked!==undefined && checked!==undefined){
            set_checked(!checked)
          }
          if(onPress!==undefined){
            onPress();
          }
        }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        
        

        <View>
          <Text style={{
            color: BaseColors.light,
            fontSize: TextsSizes.h4,
            fontWeight: 'bold'
          }}>{label}</Text>
          <Text style={{
            color: BaseColors.othertexts,
            fontSize: TextsSizes.p
          }}>
            {
              
              (checked===true?'Yes' : 'No')
            }
          </Text>
        </View>

        <View style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          backgroundColor: (isChecked()?BaseColors.primary:BaseColors.othertexts),
          position: 'relative'
        }}>
          <View style={{
            width: 22,
            height: 22,
            backgroundColor: (isChecked()?BaseColors.light:BaseColors.dark),
            borderRadius: 11,
            position: 'absolute',
            left: (isChecked()===true? 'auto' : 1),
            right: (isChecked()===true? 1: 'auto'), 
            top: 1
          }}>

          </View>
        </View>

      </TouchableOpacity>
    </View>
  }

  // this is for the default checkbox
  return <View style={{
  }}>
    <TouchableOpacity
      onPress={()=>{
        _set__checkedLocal(!_checkedLocal);
        if(set_checked!==undefined && checked!==undefined){
          set_checked(!checked)
        }
        if(onPress!==undefined){
          onPress();
        }
      }}
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BaseColors.secondary,
        padding: BasePaddingsMargins.m5,
        marginRight: BasePaddingsMargins.m10
      }}>
        <Ionicons name="checkmark" size={TextsSizes.p} color={BaseColors.light} style={{
          opacity: isChecked()===true?1:0
        }} />
      </View>
      {
        (subLabel===undefined || subLabel==='' && label!==undefined)
        ?
        <Text style={{
          color: BaseColors.light,
          fontSize: TextsSizes.p
        }}>{label}</Text>
        :
        null
      }
    </TouchableOpacity>
  </View>
}