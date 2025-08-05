// import { ReactNode } from "react";
// import React from "react";
import { Text, View } from "react-native";
import { StyleZ } from "../../assets/css/styles";

export default function LFInputsRow({inputs, label}:{inputs:React.ReactNode[], label?:string}){
  return <View>
    
    {
      label !== undefined
      ?
      <Text style={StyleZ.loginFormInputLabel}>{label}</Text>
      :
      null
    }
    
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between'
    }}>
      {
        inputs.map((input:React.ReactNode, key:number)=>{
          return <View key={`input-${key}`} style={{
            width: `${100/inputs.length - (inputs.length-1)*2}%`
          }}>
            {input}
          </View>
        })
      }
    </View>
  </View>
}