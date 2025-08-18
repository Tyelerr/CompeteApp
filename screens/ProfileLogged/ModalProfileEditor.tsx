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

  const [isLoading, set_isLoading] = useState<boolean>(false);

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
    // // // // console.log('NewData:', NewData);

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
    // // // // // // // // // console.log('Modal mount');
    // // // // // // // // // console.log('Modal Logged User 222:', user);

    set_username(user?.user_name as string);
    set_name(user?.name as string);
    set_preferred_game(user?.preferred_game as string);
    set_skill_level(user?.skill_level as string);
    set_zip_code(user?.zip_code as string);
    set_favorite_player(user?.favorite_player as string);
    set_favorite_game(user?.favorite_game as string);
    set_profile_image_url( user?.profile_image_url as string );

  }, [])

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

            <View style={[
              StyleModal.headingContainer
            ]}>
              <Text style={[
                StyleModal.heading
              ]}>Update Profile</Text>
            </View>

            <View style={[
              StyleZ.loginFromContainer,
              {
                minHeight: 0
              }
            ]}>

              {
                errorFormMessagem!==''
                ?
                <View style={{
                  justifyContent: 'center',
                  marginBottom: BasePaddingsMargins.sectionMarginBottom
                }}>
                  <Text style={[
                    StyleZ.LFErrorMessage,
                    StyleZ.LFErrorMessage_addon_centered
                  ]}>{errorFormMessagem}</Text>
                </View>
                :
                null
              }

            

              <View style={StyleZ.loginForm}>

                <View style={[
                  {
                    marginBottom: BasePaddingsMargins.formInputMarginLess,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                ]}>
                  <AttachImage
                    set_thumbnailType={(t:string)=>{}}
                    set_thumbnail_url={set_profile_image_url}
                    defaultUrl={profile_image_url}
                  />
                </View>

                <LFInput 
                  keyboardType="default" label="Username"
                  placeholder="Enter username"
                  capitalizeTheWords={true}
                  defaultValue={user?.user_name}
                  value={username}
                  onChangeText={(text:string)=>{
                    set_username( text );
                    setErrorForm('')
                  }}
                  validations={[
                    EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}
                  />

                <LFInput 
                  keyboardType="default" label="Name"
                  placeholder="Cesar Morales (As shown in Fargo Rate)"
                  defaultValue={user?.name}
                  value={name}
                  capitalizeTheWords={true}
                  onChangeText={(text:string)=>{
                    set_name( text );
                    setErrorForm('')
                  }}
                  validations={[
                    EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}
                  />

                {/*
                <LFInput 
                  typeInput="dropdown"
                  keyboardType="default" label="Preferred Game"
                  placeholder="Select preferred game"
                  defaultValue={user?.preferred_game}
                  onChangeText={(text:string)=>{
                    set_preferred_game(text);
                    setErrorForm('')
                  }}
                  validations={[
                    EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}
                  

                  items={GameTypes}

                  />
                  */}

                {/*<LFInput 
                  typeInput="dropdown"
                  keyboardType="default" label="Skill level"
                  defaultValue={user?.skill_level}
                  placeholder="Select skill level"
                  onChangeText={(text:string)=>{
                    set_skill_level(text);
                    setErrorForm('')
                  }}
                  validations={[
                    EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}

                  items={[
                    {label:'Beginner', value:'beginner'},
                    {label:'Intermediate', value:'intermediate'},
                    {label:'Advanced', value:'advanced'},
                    {label:'Pro', value:'pro'},
                  ]}

                  />*/}

                <LFInput 
                  keyboardType="default" label="Home Zip Code"
                  placeholder="Enter your zip code"
                  defaultValue={user?.zip_code}
                  description="Used for local tournament recommendations"
                  onChangeText={(text:string)=>{
                    set_zip_code(text);
                    setErrorForm('')
                  }}
                  validations={[
                    EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}
                  />
                

                  <LFInput 
                    keyboardType="default" label="Favorite Player 3"
                    placeholder="Enter your favorite player"
                    capitalizeTheWords={true}
                    defaultValue={user?.favorite_player}
                    value={favorite_player}
                    description="Your pool hero or role model"
                    onChangeText={(text:string)=>{
                      set_favorite_player(text);
                      setErrorForm('')
                    }}
                    validations={[
                      EInputValidation.Required,
                      // EInputValidation.Email,
                    ]}
                    />

                <LFInput 
                  keyboardType="default" label="Favorite Game"
                  placeholder="Enter your favorite game"
                  capitalizeTheWords={true}
                  defaultValue={user?.favorite_game}
                  value={favorite_game}
                  onChangeText={(text:string)=>{
                    set_favorite_game(text);
                    setErrorForm('')
                  }}
                  validations={[
                    EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}
                  />


                <VenuesEditor />

                

                
                <LBButtonsGroup buttons={[
                  <LFButton label="Cancel" type="danger" onPress={()=>{
                        F_isOpened(false)
                      }} />,
                  <LFButton
                      loading={isLoading}
                      label="Save Changes" type="primary" icon="save" onPress={()=>{
                      __SaveTheDetails()
                    }} />
                ]} />

              </View>

            </View>
            


          </View>



        </ScrollView>

      </View>
    </View>
    </KeyboardAvoidingView>
  </Modal>
}