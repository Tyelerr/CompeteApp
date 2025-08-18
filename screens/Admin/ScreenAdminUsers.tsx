import { Alert, Text, View } from "react-native";
import ScreenScrollView from "../ScreenScrollView";
import ScreenAdminDropdownNavigation from "./ScreenAdminDropdownNavigation";
import UIPanel from "../../components/UI/UIPanel";
import { StyleZ } from "../../assets/css/styles";
import LFInput from "../../components/LoginForms/LFInput";
import { EUserRole, ICAUserData, UserRoles } from "../../hooks/InterfacesGlobal";
import ProfileHeadingAdmin from "./ProfileHeadingAdmin";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { useEffect, useRef, useState } from "react";
import { 
  // ICAUserData, 
  useContextAuth 
} from "../../context/ContextAuth";
import { DeleteUser, FetchUsers, FetchUsersV2, UpdateProfile } from "../../ApiSupabase/CrudUser";
import ModalInfoMessage from "../../components/UI/UIModal/ModalInfoMessage";
import { TIMEOUT_DELAY_WHEN_SEARCH } from "../../hooks/constants";
import { BaseColors, BasePaddingsMargins } from "../../hooks/Template";
import LFCheckBox from "../../components/LoginForms/LFCheckBox";
import ProfileHeadingAdminV2 from "./ProfileHeadingAdminV2";
import ScreenAdminUserItem from "./ScreenAdminUserItem";

export default function ScreenAdminUsers(){


  const { user } = useContextAuth();

  const [users, set_users] = useState<ICAUserData[]>([]);
  const [loading, set_loading] = useState<boolean>(false);
  const [actualUserIndex, set_actualUserIndex] = useState<number>(-1);
  const [showMessageToDeleteUser, set_showMessageToDeleteUser] = useState<boolean>(false);
  const [userForDelete, set_userForDelete] = useState<ICAUserData | null>(null);

  const [searchUsersTerm, set_searchUsersTerm] = useState<string>('');
  const [searchUserRole, set_searchUserRole] = useState<string>('');
  const [searchIdNumber, set_searchIdNumber] = useState<string>('');

  const _LoadUsers = async ()=>{
    
    set_loading(true);

    const {
      data,
      error
    } = await FetchUsersV2( 
      user as ICAUserData,
      searchUsersTerm,
      searchUserRole as EUserRole,
      searchIdNumber
    );

    // // // // console.log('error:', error);

    // // // // // // // // // console.log('data:', data);
    const newUsers:ICAUserData[] = [];
    if(data!==undefined && data!==null){
      for(let i=0;i<data.length;i++){
        newUsers.push( data[i] as ICAUserData );
      }
      set_users(newUsers);
      // // // console.log('users.length:', users.length);
    }

    set_loading(false);

  }


  const __DeleteUser = (_user_for_deleting: ICAUserData, userIndexForDeleting:number)=>{
    set_userForDelete(_user_for_deleting);
    set_actualUserIndex( userIndexForDeleting );
    set_showMessageToDeleteUser(true);
  }
  const __DeleteUsersByArrayIds = ()=>{
    set_showMessageToDeleteUser(true);
  }

  /*useEffect(()=>{
    _LoadUsers();
  }, []);*/


  const debounceTimeout = useRef(null);


  useEffect(()=>{
    // // // // // // // // console.log('searchUsersTerm, userRole:', searchUsersTerm);
    if(debounceTimeout.current){
      clearTimeout(debounceTimeout.current)
    }
    set_loading(true);
    debounceTimeout.current = setTimeout(()=>{
      _LoadUsers()
    }, TIMEOUT_DELAY_WHEN_SEARCH);

    return ()=>{
      if(debounceTimeout.current){
        clearTimeout(debounceTimeout.current)
      }
    }

  }, [searchUsersTerm, searchUserRole, searchIdNumber]);

  /*useEffect(()=>{
    // // // // // // // // console.log('searching when searchUserRole is changed');
    _LoadUsers()
  }, [searchUserRole]);*/

  return <>
  <ScreenScrollView>

    <View>
    
      <ScreenAdminDropdownNavigation />

      <View style={[
        StyleZ.loginFromContainer,
      ]}>

        <View style={[
          StyleZ.loginForm
        ]}>

          <LFInput 
            keyboardType="default"
            placeholder="Search users..."
            iconFront="search"
            marginBottomInit={BasePaddingsMargins.formInputMarginLess}
            defaultValue={
              ""
            }
            onChangeText={(text:string)=>{
              // set_tournamentName(text);
              // setErrorForm('')
              set_searchUsersTerm(text)
            }}
            validations={[
              // EInputValidation.Required,
            ]}
            />
          <View style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between'
            }
          ]}>

            <View style={[
              {
                width: '48%'
              }
            ]}>
              <LFInput 
                typeInput="dropdown"
                placeholder="All Roles"
                label="Filter By Role"
                defaultValue={
                  ""
                }
                onChangeText={(text:string)=>{
                  // set_tournamentName(text);
                  // setErrorForm('')
                  set_searchUserRole(text)
                }}
                validations={[
                  // EInputValidation.Required,
                ]}
                items={UserRoles}
                />
            </View>
            <View style={[
              {
                width: '48%'
              }
            ]}>
              <LFInput 
                label="Filter by ID"
                placeholder="ID Number"
                onChangeText={(text)=>{
                  set_searchIdNumber(text)
                }}
                />
            </View>

          </View>

          <View style={[
            StyleZ.hr
          ]} />
          {/*<View style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomColor: BaseColors.secondary,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    marginBottom: 0,
                    paddingVertical: BasePaddingsMargins.m5
                    // height: 20,
                    // backgroundColor: 'red'
                  }
                ]}>
            <View style={[
              {
                flex: 1
              }
            ]}>
              <LFButton 
                type="danger" 
                label="Delete The Checked Users" 
                icon="trash"
                onPress={()=>{
                  // // // // // // // // console.log('userFromTheList:', userFromTheList);
                  // set_actualUserIndex(key);
                  // __DeleteUser(userFromTheList)
                  __DeleteUsersByArrayIds();
                }}
                />
            </View>
          </View>*/}
          {
            users.map((userFromTheList:ICAUserData, key:number)=>{
              return <View key={`user-panel-${key}`}>
                {/*<UIPanel>
                  <ProfileHeadingAdmin user={userFromTheList} />
                  <LFInput
                    typeInput="dropdown"
                    placeholder=""
                    defaultValue={userFromTheList.role}
                    // items={UserRoles.slice(1,UserRoles.length)}
                    items={UserRoles}
                    onChangeText={(text:string)=>{
                      // Alert.alert('12');
                      // // // // // // // // // console.log('Updating the role of the user');
                      UpdateProfile( userFromTheList.id, {role:text} );
                    }}
                  />
                  <LFButton 
                    type="danger" 
                    label="Delete" 
                    icon="trash"
                    onPress={()=>{
                      // // // // // // // // console.log('userFromTheList:', userFromTheList);
                      set_actualUserIndex(key);
                      __DeleteUser(userFromTheList)
                    }}
                    />
                </UIPanel>*/}
                <ScreenAdminUserItem 
                  userFromTheList={userFromTheList} 
                  onSubmitUpdateUserButton={()=>{
                    _LoadUsers()
                  }}
                  __DeleteUser={(user:ICAUserData)=>{
                    __DeleteUser(user, key)
                    
                  }}
                  />
              </View>
            })
          }

        </View>

      </View>

    </View>

  </ScreenScrollView>
  <ModalInfoMessage 
    message="Are you sure you want to delete the selected accounts?"
    id={100}
    set_visible={set_showMessageToDeleteUser}
    visible={showMessageToDeleteUser}
    buttons={[
      <LFButton label="Cancel" type="secondary" onPress={()=>{
        set_showMessageToDeleteUser(false);
      }} />,
      <LFButton label="Delete" type="danger" onPress={()=>{
        // // // // // // // // console.log('userForDelete:', userForDelete);
        users.splice(actualUserIndex, 1);
        set_users([...users]);
        DeleteUser( userForDelete as ICAUserData );
        set_showMessageToDeleteUser(false)
      }} />
    ]}
    />
  </>
}