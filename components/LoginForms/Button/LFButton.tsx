import { Alert, Animated, Easing, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { StyleZ } from "../../../assets/css/styles";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { BaseColors } from "../../../hooks/Template";

export default function LFButton(
  {
    label="",
    type='primary',
    onPress,
    loading,
    icon,
    size='default',
    marginbottom,
    disabled,
    StyleProp
  }
  :
  {
    label?: string,
    type: 'primary' | 'secondary' | 'danger' | 'dark' | 'outline-dark' | 'success',
    onPress?: ()=>void,
    loading?: boolean,
    icon?:keyof typeof Ionicons.glyphMap ,
    size?:'small' | 'default' | 'bigger' | 'big',
    marginbottom?:number,
    disabled?: boolean,
    StyleProp?: StyleProp<ViewStyle>
  }
){

  
  // const [loading, set_loading] = useState<boolean>(false);

  // rotation scripts for the loading
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const spin = rotateAnim.interpolate({
    inputRange: [0, .5, 1],
    outputRange: [0, 1, 0], // Full rotation
  });

  const [isPressed, set_isPressed] = useState<boolean>(false);


  const color = ()=>{
    if(type==='primary'){
      return StyleZ.LFButtonPrimary.color;
    }
    else if(type==='danger'){
      return StyleZ.LFButtonDanger.color;
    }
    else if(type==='outline-dark'){
      return StyleZ.LFButtonOutlineDark.color;
    }
    else if(type==='secondary'){
      return StyleZ.LFButtonSecondary.color;
    }
    else if(type==='success'){
      return StyleZ.LFButtonSuccess.color;
    }
    return BaseColors.othertexts;
  }
  const colorPressed = ()=>{
    return color();
  }
  /*const backgroundColor = ()=>{
    if(type==='primary'){
      return StyleZ.LFButtonPrimary.backgroundColor;
    }
    else if(type==='outline-dark'){
      return StyleZ.LFButtonOutlineDark.backgroundColor;
    }
    return StyleZ.LFBUtton.backgroundColor;
  }*/
  const style = ()=>{
    if(type==='primary'){
      return StyleZ.LFButtonPrimary;
    }
    else if(type==='danger'){
      return StyleZ.LFButtonDanger;
    }
    else if(type==='dark'){
      return StyleZ.LFButtonDark;
    }
    else if(type==='outline-dark'){
      return StyleZ.LFButtonOutlineDark;
    }
    else if(type==='secondary'){
      return StyleZ.LFButtonSecondary;
    }
    else if(type==='success'){
      return StyleZ.LFButtonSuccess;
    }
    return null;
  }
  const stylePressed = ()=>{
    if(type==='primary')return StyleZ.LFButtonPrimaryPressed;
    else if(type==='danger')return StyleZ.LFButtonDangerPressed;
    else if(type==='outline-dark')return StyleZ.LFButtonOutlineDarkPressed;
    return null;
  }
  const styleSize = ()=>{
    if(size==='small')return StyleZ.LFBUtton_Small;
    else if(size=='bigger')return StyleZ.LFBUtton_Bigger;
    return null;
  }
  const fontSize = ():number=>{
    if(size==='small')return StyleZ.LFBUtton_Small.fontSize;
    else if(size==='bigger')return StyleZ.LFBUtton_Bigger.fontSize;
    return StyleZ.LFBUtton.fontSize;
  }

  useEffect(() => {
    // Start the animation loop when the component mounts
    Animated.loop(
      Animated.timing(
        rotateAnim,
        {
          toValue: 1, // Animate to 1 (representing a full rotation)
          duration: 1000, // 1 second per rotation
          easing: Easing.linear, // Linear speed
          useNativeDriver: true, // Use native driver for performance (if possible for the property)
        }
      )
    ).start();

    // Cleanup function to stop animation when component unmounts
    return () => {
      rotateAnim.stopAnimation()
    };
  }, [rotateAnim]);

  return <View style={[
    StyleZ.LFButtonContainer,
    {
      width: '100%',
      // borderWidth: 4,
      // borderColor: 'green',
      // borderStyle: 'solid'
    },
    (
      loading===true?
        {
        pointerEvents: 'none',
        opacity: .7
      }
      :
      null
    ),
    (
      marginbottom!==undefined
      ?
      {
        marginBottom: marginbottom,
        marginBlockEnd: marginbottom
      }
      :
      null
    ),
    (StyleProp!==undefined?StyleProp:{})
  ]}>
    <TouchableOpacity 
      disabled={disabled===true}
      activeOpacity={1}
      style={[
      {
        // when width is 100% it shrink the buttons
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // opacity: 1,
        
        // borderWidth: 4,
        // borderColor: 'violete',
        // borderStyle: 'solid'
      },
      StyleZ.LFBUtton,
      style(),
      styleSize(),
      (isPressed?stylePressed():null),
      (isPressed?{
        transform:[{scale: .95}]
      }:null),
      (disabled===true?{opacity: .5}:{})
    ]} 
    onPressIn={()=>{
      set_isPressed(true);
    }}
    onPressOut={()=>{
      set_isPressed(false);
    }}
    onPress={()=>{
      // Alert.alert('it is working');
      if(onPress!==undefined){
        onPress();
      }
    }}>
      {
        icon!==undefined?
        <Ionicons name={icon} style={{
          fontSize: fontSize(), 
          color: color(), 
          marginRight: (label!==''?5:0),
          display: 'flex',
          justifyContent: 'center',
          // paddingRight: 15
        }} />
        :
        null
      }
      {
        label!==''
        ?
        <Text style={[
          // StyleZ.LFBUtton,
          {
            display: 'flex',
            fontSize: StyleZ.LFBUtton.fontSize,
            color: isPressed?colorPressed():color(),
            textAlign: 'center'
            // backgroundColor: 'grey'
          }
        ]}>{label}</Text>
        :
        null
      }
      
    </TouchableOpacity>


    {
      loading===true?
        <Animated.View style={{ 
          // transform: [{ rotate: spin }],
          opacity: spin,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          
          }}>
          {/* Replace this Text with your actual reloading icon component (e.g., from a library or SVG) */}
          <View style={{
            backgroundColor: 'white',
            width: 16,
            height: 16,
            borderRadius: 8
          }}></View>
          {/* Or <Image source={require('./reload-icon.png')} style={styles.imageIcon} /> */}
          {/* Or <MySvgReloadIcon width={50} height={50} /> */}
        </Animated.View>
      :
      null
    }

  </View> 
}