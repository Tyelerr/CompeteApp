import React from "react";
import { ICustomHeaderTitleProps } from "./Interface";
import { Image, Text, View } from "react-native";
import { StyleZ } from "../assets/css/styles";
import { BasePaddingsMargins } from "../hooks/Template";


// const app_logo = require('./../assets/images/billiards-logo-2.svg'); //svg not working still
const app_logo = require('./../assets/images/billiards-logo-2.png');

export default function StackHeader (
  { 
    title, subtitle, textColor = 'white', 
    type
  }
  :
  {
    title: string, subtitle?:string, textColor?: string,
    type?: 'default' | 'centered-no-icon'
}){


  // return null;

  return (<View id="stack-header-content" style={{
      backgroundColor:StyleZ.colors.backgroundColor, 
      // flexDirection: 'row',
      // flex: 1, 
      // paddingBlockEnd: 30

      paddingInline: BasePaddingsMargins.marginInline,

      // height: 100,
      paddingTop: 60,
      paddingBottom: 10,

      justifyContent: "center",

      
    }}>
    <View style={{
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      // position: ''
      // flex: 1
    }}>
      {
        type==="centered-no-icon"?
        null
        :
        <Image 
          source={app_logo} 
          accessibilityLabel="Application logo"
          style={{
            // borderWidth: 3,
            // borderColor: 'yellow',
            width: 34,
            height: 22,
            marginInlineEnd: 10,
          }}
          />
      }

      <Text style={[
        StyleZ.headerTitleStyle,
        (type==='centered-no-icon'?{textAlign: 'center', width: '100%'}:null)
      ]}>{title.toUpperCase()}</Text>
    </View>
    {
      subtitle!==undefined?
      <Text style={[
        StyleZ.headerSubtitleStyle,
        (type==='centered-no-icon'?{textAlign:'center'}:null)
      ]}>{subtitle}</Text>
      :
      null
    }
    
  </View>)
}