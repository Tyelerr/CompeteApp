import { useEffect, useState } from "react";
import { EInputValidation } from "../../components/LoginForms/Interface";
import { TheFormIsValid } from "../../hooks/Validations";
import { FetchProfileData, UpdateProfile } from "../../ApiSupabase/CrudUser";
import { ICAUserData } from "../../hooks/InterfacesGlobal";
import { Text, View } from "react-native";
import { StyleModal, StyleZ } from "../../assets/css/styles";
import { BasePaddingsMargins } from "../../hooks/Template";
import AttachImage from "../../components/UI/Attach/AttachImage";
import LFInput from "../../components/LoginForms/LFInput";
import VenuesEditor from "../../components/google/VenuesEditor/VenuesEditor";
import LBButtonsGroup from "../../components/LoginForms/Button/LBButtonsGroup";
import LFButton from "../../components/LoginForms/Button/LFButton";

export default function FormUserEditor(
  {
    userThatNeedToBeEdited,
    EventAfterUpdatingTheUser,
    EventAfterCancelUpdating
  }
  :
  {
    userThatNeedToBeEdited:ICAUserData,
    EventAfterUpdatingTheUser: (user: ICAUserData)=>void,
    EventAfterCancelUpdating: ()=>void
  }
){
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
      // // // // // console.log('NewData:', NewData);
  
      const updatingIsCompleted = await UpdateProfile(
        userThatNeedToBeEdited.id as string,
        NewData
      );
  
      set_isLoading(false);
      const updatedUserData = await FetchProfileData(userThatNeedToBeEdited.id as string);
      EventAfterUpdatingTheUser( updatedUserData.user as ICAUserData );
      /*set_user(updatedUserData.user as ICAUserData);
  
      F_isOpened( false );*/
  
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
  
      set_username(userThatNeedToBeEdited.user_name as string);
      set_name(userThatNeedToBeEdited.name as string);
      set_preferred_game(userThatNeedToBeEdited.preferred_game as string);
      set_skill_level(userThatNeedToBeEdited.skill_level as string);
      set_zip_code(userThatNeedToBeEdited.zip_code as string);
      set_favorite_player(userThatNeedToBeEdited.favorite_player as string);
      set_favorite_game(userThatNeedToBeEdited.favorite_game as string);
      set_profile_image_url( userThatNeedToBeEdited.profile_image_url as string );
  
    }, [])

  return <>
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
            defaultValue={userThatNeedToBeEdited.user_name}
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
            defaultValue={userThatNeedToBeEdited.name}
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
            defaultValue={userThatNeedToBeEdited.preferred_game}
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
            defaultValue={userThatNeedToBeEdited.skill_level}
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
            defaultValue={userThatNeedToBeEdited.zip_code}
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
              defaultValue={userThatNeedToBeEdited.favorite_player}
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
            defaultValue={userThatNeedToBeEdited.favorite_game}
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


          <VenuesEditor barOwner={userThatNeedToBeEdited} />

          

          
          <LBButtonsGroup buttons={[
            <LFButton label="Close" type="danger" onPress={()=>{
                  // F_isOpened(false)
                  EventAfterCancelUpdating()
                }} />,
            <LFButton
                loading={isLoading}
                label="Save Changes" type="primary" icon="save" onPress={()=>{
                __SaveTheDetails()
              }} />
          ]} />

        </View>

      </View>
  </>
}