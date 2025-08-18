import { Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleZ } from "../assets/css/styles";
import { BaseColors, BottomBarTab } from "../hooks/Template";
import { useEffect, useRef, useState } from "react";

export default function TabBarIconElement(

  {
    focused,
    icon
  }
  :
  {
    focused: boolean,
    icon?:keyof typeof Ionicons.glyphMap ,
  }

){

  // initial focusing

  if(icon==='help-circle'){

    // // // // console.log('isFocused:', focused);
  }
  
  
   // You can also trigger animation on component mount, for example
  useEffect(() => {

    // // // // // console.log('it is working');

    

  }, [focused, icon]); // Re-run effect if initialSize changes
  useEffect(()=>{
    // // // // console.log('This will change when focused changed');
  }, [focused])

  return <View style={[ 
        // styles.tabIconBackground,
        StyleZ.tabBarIcon,
        // { backgroundColor: focused ? BaseColors.contentSwitcherBackgroundCOlor : 'transparent' } // Dynamic background based on focus
      ]}>
        {/*<Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />*/}
        <Ionicons name={icon}  style={[
          {
            color: focused?BaseColors.primary:BaseColors.othertexts,
            fontSize: !focused? BottomBarTab.iconSize : BottomBarTab.iconSizeBigger
            // fontSize: animatedSize
          }
        ]} />
      </View>
}