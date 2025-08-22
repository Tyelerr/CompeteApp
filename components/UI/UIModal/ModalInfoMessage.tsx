import { Modal, Text, View } from "react-native";
import { StyleModal } from "../../../assets/css/styles";
import LFButton from "../../LoginForms/Button/LFButton";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../../hooks/Template";
import { useEffect, useState } from "react";

export default function ModalInfoMessage(
  {
    message,
    title,
    id,
    buttons,
    visible,
    set_visible,
    messageNodes
  }
  :
  {
    message?:string,
    title?:string,
    id:number,
    buttons?:React.ReactNode[],
    visible?: boolean,
    set_visible?: (v:boolean)=>void,
    messageNodes?: React.ReactNode
  }
  
){

  const [_visible, _set_visible] = useState<boolean>(true);
  const FVisible = ():boolean=>{
    return (visible!==undefined?visible:_visible);
  }
  // // // // // // // // // // // console.log('buttons:', buttons);

  const __SingleOkButton = ()=>{
    return <View style={{
      flexDirection: "row",
      justifyContent: 'center'
    }}>
      <View style={{width: 120}}>
        <LFButton type="primary" label="OK" onPress={()=>{
          _set_visible(false);
        }} />
      </View>
    </View>
  }
  const __Buttons = ()=>{
    return <View style={{
      flexDirection: "row",
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {/*<View style={{width: 120}}>
        <LFButton type="primary" label="OK" onPress={()=>{
          _set_visible(false);
        }} />
      </View>*/}
      {
        buttons?.map((node:React.ReactNode, key:number)=>{
          return <View key={`button-key-${key}`} style={{
            width: buttons.length===1 || 1===1?'100%':'47%',
            marginBottom: BasePaddingsMargins.m10
            }}>
            {node}
          </View>
        })
      }
    </View>
  }

  useEffect(()=>{
    if(set_visible!==undefined){
      // when set_visible is set that mean we will show it manually
    }
    else{
      if(message!==''){
        _set_visible(true);
      }
      else{
        _set_visible(false);
      }
    }
  }, [id]);

  return <Modal 
    animationType="fade" 
    transparent={true} 
    visible={FVisible()}
    style={{
      zIndex: 1001
    }}
    >
    <View style={[
          StyleModal.container,
        ]}>
      <View style={[
        StyleModal.ModalInfoMessageContainer
      ]}>
        {
          title !==undefined && title!==""?
          <Text style={{color: BaseColors.light, fontSize: TextsSizes.h4, fontWeight: 'bold', textAlign: 'center', marginBottom: BasePaddingsMargins.m10}}>{title}</Text>
          :
          null
        }


        {
          message!==undefined && message!==''
          ?
          <Text style={{color: BaseColors.othertexts, fontSize: TextsSizes.p, textAlign: "center", marginBottom: BasePaddingsMargins.m25}}>{message}</Text>
          :
          null
        }

        {
          messageNodes!==undefined
          ?
          <View style={{
            marginBottom: BasePaddingsMargins.m20
          }}>{messageNodes}</View>
          :
          null
        }
        
        
        {
          buttons===undefined
          ?
          __SingleOkButton()
          :
          __Buttons()
        }
        



      </View>
    </View>
  </Modal>
}