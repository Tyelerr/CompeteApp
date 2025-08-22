import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleModal, StyleZ } from "../../assets/css/styles";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import LFButton from "../../components/LoginForms/Button/LFButton";
import LFInput from "../../components/LoginForms/LFInput";
import { EInputValidation } from "../../components/LoginForms/Interface";
import { useEffect, useState } from "react";
import { ICAUserData, useContextAuth } from "../../context/ContextAuth";
import { FetchProfileData, UpdateProfile } from "../../ApiSupabase/CrudUser";
import { TheFormIsValid } from "../../hooks/Validations";
import UIModalCloseButton from "../../components/UI/UIModal/UIModalCloseButton";
import { GameTypes } from "../../hooks/InterfacesGlobal";
import LBButtonsGroup from "../../components/LoginForms/Button/LBButtonsGroup";
import { CapitalizeWords } from "../../hooks/hooks";
import AttachImage from "../../components/UI/Attach/AttachImage";
import VenuesEditor from "../../components/google/VenuesEditor/VenuesEditor";
import FormUserEditor from "./FormUserEditor";

export default function ModalProfileEditor(
  {
    isOpened,
    F_isOpened
  }
  :
  {
    isOpened: boolean,
    F_isOpened: (v:boolean)=>void
  }
){



  const {
    user,
    set_user
  } = useContextAuth();

  /*const [isLoading, set_isLoading] = useState<boolean>(false);

  const __SaveTheDetails = async ()=>{

    
    if(!TheFormIsValid([
      {
        value: username,
        validations: [EInputValidation.Required]
      },
      {
        value: name, 
        validations: [EInputValidation.Required]
      },
      {
        value: preferred_game,
        validations: [EInputValidation.Required]
      },
      {
        value: skill_level,
        validations: [EInputValidation.Required]
      },
      {
        value: zip_code,
        validations: [EInputValidation.Required]
      },
      {
        value: favorite_player,
        validations: [EInputValidation.Required]
      }
      // [username, [EInputValidation.Required]],
      // [name, [EInputValidation.Required]],
      // [preferred_game, [EInputValidation.Required]],
      // [skill_level, [EInputValidation.Required]],
      // [zip_code, [EInputValidation.Required]],
      // [favorite_player, [EInputValidation.Required]],
    ])){
      setErrorForm('All inputs are required.');
      // Alert.alert('error')
      return;
    }

    set_isLoading(true);
    const NewData = {
      user_name:username,
      // email,
      name:name,
      preferred_game:preferred_game,
      skill_level:skill_level,
      zip_code:zip_code, 
      favorite_player:favorite_player,
      favorite_game:favorite_game,
      profile_image_url:profile_image_url
    };
    // // // // // console.log('NewData:', NewData);

    const updatingIsCompleted = await UpdateProfile(
      user?.id as string,
      NewData
    );

    if(updatingIsCompleted===true){
      const updatedUserData = await FetchProfileData(user?.id as string);
      set_user(updatedUserData.user as ICAUserData)
    }

    set_isLoading(false);
    F_isOpened( false );

  }

  const [errorFormMessagem, setErrorForm] = useState<string>('');
  const [username, set_username] = useState<string>('');
  const [name, set_name] = useState<string>('');
  const [preferred_game, set_preferred_game] = useState<string>('');
  const [skill_level, set_skill_level] = useState<string>('');
  const [zip_code, set_zip_code] = useState<string>('');
  const [favorite_player, set_favorite_player] = useState<string>('');
  const [favorite_game, set_favorite_game] = useState<string>('');
  const [profile_image_url, set_profile_image_url] = useState<string>('');

  useEffect(()=>{
    // // // // // // // // // // console.log('Modal mount');
    // // // // // // // // // // console.log('Modal Logged User 222:', user);

    set_username(user?.user_name as string);
    set_name(user?.name as string);
    set_preferred_game(user?.preferred_game as string);
    set_skill_level(user?.skill_level as string);
    set_zip_code(user?.zip_code as string);
    set_favorite_player(user?.favorite_player as string);
    set_favorite_game(user?.favorite_game as string);
    set_profile_image_url( user?.profile_image_url as string );

  }, [])*/

  return <Modal 
    animationType="fade"
    transparent={true}
    visible={isOpened}
    
    >
      
    {/*KeyboardAvoidingView is to see the inputs when they are focused*/}
    <KeyboardAvoidingView
      style={{
        flex: 1
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' is ideal for iOS
      keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0} // Adjust this offset for iOS
      >
    <View style={[
      StyleModal.container,
    ]}>

      <TouchableOpacity 
        style={[StyleModal.backgroundTouchableForClosing]} 
        onPress={()=>{
        F_isOpened(false)
      }} />

      <View style={[
        StyleModal.containerForScrollingView,
      ]}>


        <ScrollView style={[
          StyleModal.scrollView,
          /*{
            maxHeight: '100%',
            // height: '50%',

            // backgroundColor: 'red'
          }*/
        ]}>



          

          <View style={[
            StyleModal.contentView
          ]}>


            {/*<View style={StyleModal.closeButtonContainer}>
              <LFButton type="danger" label="" icon="close" onPress={()=>{
                F_isOpened(false)
              }} />
            </View>*/}

            
            <UIModalCloseButton F_isOpened={F_isOpened} />

            <FormUserEditor 
              userThatNeedToBeEdited={user as ICAUserData}
              EventAfterUpdatingTheUser={(updatedUser:ICAUserData)=>{
                set_user( updatedUser );
                F_isOpened( false )
              }}
              EventAfterCancelUpdating={()=>{
                F_isOpened(false)
              }}
              />
            
            


          </View>



        </ScrollView>

      </View>
    </View>
    </KeyboardAvoidingView>
  </Modal>
}