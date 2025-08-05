import { Text, View } from "react-native";
import UIPanel from "../../components/UI/UIPanel";
import ProfileHeading from "./ProfileHeading";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import { useContextAuth } from "../../context/ContextAuth";
import { supabase } from "../../ApiSupabase/supabase";
import { useState } from "react";
import ModalProfileEditor from "./ModalProfileEditor";

export default function PanelUserDetailsAndEditor(){

  const {
      user
    } = useContextAuth();
  
    const [modalProfileIsOpened, set_modalProfileIsOpened] = useState<boolean>(false);
  
    const logout = async ()=>{
  
      // Alert.alert('singing out');
  
      // after calling this function the supabase event in context will know and will signout :)
      try{
        // const { error } = 
        supabase.auth.signOut();
      }
      catch(error){}
    }

  const ProfileDataDetails = [
    {label:'Home Zip Code', data: user?.zip_code},
    {label:'Favorite Player', data: user?.favorite_player},
    {label:'Favorite Game', data:user?.favorite_game},
  ];

  return <>
  
    <UIPanel>

      <ProfileHeading />

      <View style={{marginBottom: BasePaddingsMargins.m10}}>
        <LFButton type="outline-dark" label="Edit Profile" icon="settings" onPress={()=>{
          set_modalProfileIsOpened(true);
        }} />
      </View>
      <View style={{
        marginBottom: BasePaddingsMargins.m20
      }}>
        <LFButton 
          
          type="outline-dark" 
          label="Sign Out" 
          icon="log-out"

          onPress={()=>{
            logout();
          }}
          
          />
      </View>

      
      
      {
        ProfileDataDetails.map((data, key)=>{
          return <View key={`user-profile-details-item-${key}`} style={{
              marginBottom: BasePaddingsMargins.m20
            }}>
              <Text style={{
                color: BaseColors.othertexts,
                fontSize: TextsSizes.small,
                marginBottom: (key<ProfileDataDetails.length-1?BasePaddingsMargins.m5:0)
              }}>{data.label}</Text>
              <Text style={{
                color: BaseColors.light,
                fontSize: TextsSizes.p,
                fontWeight: 'bold'
              }}>{data.data}</Text>
            </View>
        })
      }
      





    </UIPanel>
    <ModalProfileEditor 
      isOpened={modalProfileIsOpened}
      F_isOpened={set_modalProfileIsOpened}
      />

  </>
}