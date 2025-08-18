import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleModal, StyleZ } from "../../assets/css/styles";
import UIModalCloseButton from "../../components/UI/UIModal/UIModalCloseButton";
import LFInput from "../../components/LoginForms/LFInput";
import { EUserRole, ICAUserData, UserRoles } from "../../hooks/InterfacesGlobal";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { BasePaddingsMargins } from "../../hooks/Template";
import { useEffect, useState } from "react";
import { UpdateProfile } from "../../ApiSupabase/CrudUser";

export default function ScreenAdminUserModalEditor(
  {
    F_isOpened,
    isOpened,
    userForEditing,
    onSubmitUpdateUserButton
  }
  :
  {
    F_isOpened: (b:boolean)=>void,
    isOpened: boolean,
    userForEditing: ICAUserData,
    onSubmitUpdateUserButton?: ()=>void
  }
){

  const [localUserRole, set_localUserRole] = useState<EUserRole | null>(null);

  const __UpdateUser = async ()=>{
    await UpdateProfile(userForEditing.id, {
      role: localUserRole
    });

    // finally we ask the function from autside to load again the users list
    if(onSubmitUpdateUserButton!==undefined)
      onSubmitUpdateUserButton()
  }

  useEffect(()=>{
    // // // console.log('userForEditing:', userForEditing);
  }, []);
  useEffect(()=>{
    set_localUserRole(userForEditing.role);
    // // // console.log('userForEditing.role:', userForEditing.role);
  }, [userForEditing.role]);

  return <Modal animationType="fade" transparent={true} visible={isOpened}>
    <View style={[
              StyleModal.container
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
            <UIModalCloseButton F_isOpened={F_isOpened} />

            <View style={[
              StyleModal.headingContainer
            ]}>
              <Text style={[
                StyleModal.heading
              ]}>User Editor</Text>
            </View>

            <Text style={[
              {
                color: 'white'
              }
            ]}>

              localUserRole: {localUserRole}
            </Text>

            
            {/*<LFInput label="Name" placeholder="Enter Name" 
              // value={name} 
              // onChangeText={set_name} 
              />*/}

            <View style={[
              StyleZ.hr
            ]} />

            <View style={[
              {
                marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
              }
            ]}>
              <LFInput
                typeInput="dropdown"
                placeholder="User Role"
                defaultValue={localUserRole as string}
                value={localUserRole as string}
                marginBottomInit={0}
                // items={UserRoles.slice(1,UserRoles.length)}
                items={UserRoles}
                onChangeText={(text:string)=>{
                  // Alert.alert('12');
                  // // // // // // // // // console.log('Updating the role of the user');
                  // // // // console.log('New role: ', text);
                  // UpdateProfile( userFromTheList.id, {role:text} ); 
                  set_localUserRole(text);
                }}
              />
            </View>

            <LFButton
              label="Update the user"
              type="primary"
              onPress={()=>{
                F_isOpened(false)

                __UpdateUser()
              }}  
            />

          </View>
        </ScrollView>
        
      </View>
    </View>
  </Modal>
}