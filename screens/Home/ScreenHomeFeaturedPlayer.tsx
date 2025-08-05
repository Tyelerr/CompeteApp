import { Text, View } from "react-native";
import UIPanel from "../../components/UI/UIPanel";
import ScreenScrollView from "../ScreenScrollView";
import ScreenHomeSubNavigation from "./ScreenHomeSubNavigation";
import { Ionicons } from "@expo/vector-icons";
import UIBadge from "../../components/UI/UIBadge";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import { StyleZ } from "../../assets/css/styles";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { useContextAuth } from "../../context/ContextAuth";
import { ECustomContentType, EUserRole, ICAUserData, ICustomContent } from "../../hooks/InterfacesGlobal";
import ModalEditorContent from "./ModalEditorContent";
import { useEffect, useState } from "react";
import { ILFInputGridInput, ILFInputsGrid } from "../../components/LoginForms/LFInputsGrid";
import { GetTheLatestContent } from "../../ApiSupabase/CrudCustomContent";

export default function ScreenHomeFeaturedPlayer(){

  const {user} = useContextAuth();

  // // // console.log('user:', user);
  // // // console.log('user.role:', user?.role);

  const [modalEditorIsOpened, set_modalEditorIsOpened] = useState<boolean>(false);
  const [featuredPlayerData, set_featuredPlayerData] = useState<ICustomContent | null>(null);

  const theData = ():ICustomContent=>{
    return featuredPlayerData as ICustomContent;
  }

  const LoadData = async ()=>{
    const {data, error} = await GetTheLatestContent( ECustomContentType.ContentFeaturedPlayer );

    if(error===null && data!==null && data.length===1){
      set_featuredPlayerData( data[0] as ICustomContent )
    }
  }

  useEffect(()=>{
    LoadData()
  }, []);

  return <><ScreenScrollView>

    <ScreenHomeSubNavigation />

    <UIPanel>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: BasePaddingsMargins.formInputMarginLess
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Ionicons name="ribbon" style={{
            fontSize: TextsSizes.p,
            color: BaseColors.primary,
            marginRight: BasePaddingsMargins.m10
          }} />
          <UIBadge label="Featured Player" type="primary-outline" />
        </View>
        {
          user!==null && (user as ICAUserData).role === EUserRole.MasterAdministrator
          ?
          <View style={{
            width: 60
          }}>
            <LFButton icon="pencil" size="small" label="edit" type="primary" onPress={()=>{
              set_modalEditorIsOpened(true);
            }} />
          </View>
          :
          null
        }
        
      </View>


      {
        featuredPlayerData!==null?<>
        <View style={
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: BasePaddingsMargins.formInputMarginLess
          }
        }>
          <View style={{
            backgroundColor: BaseColors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            marginRight: BasePaddingsMargins.m20,
            borderRadius: 40,
          }}>
            <Text style={{
              fontSize: 30,
              color: BaseColors.light
            }}>{
              theData().name.split(' ')[0].substring(0, 1)
            }{theData().name.split(' ')[1]!==undefined?theData().name.split(' ')[1].substring(0, 1):null}</Text>
          </View>
          <View>
            <Text style={
              [
                StyleZ.h2,
                {
                  // color: BaseColors.light,
                  marginBottom: 0
                }
              ]
            }>{theData().name}</Text>
            <Text style={[
              StyleZ.p
            ]}>{theData().label_about_the_person}</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Ionicons name="location" style={[
                StyleZ.p,
                {
                  marginRight: BasePaddingsMargins.m5
                }
              ]} />
              <Text style={[
                StyleZ.p
              ]}>{theData().address}</Text>
            </View>
          </View>
        </View>


        <View style={{
          marginBottom: BasePaddingsMargins.formInputMarginLess
        }}>
          <Text style={[
            StyleZ.h4,
            {
              fontWeight: 'normal'
            }
          ]}>{theData().description}</Text>
        </View>
        <View>
          <Text style={[
            StyleZ.h4,
            {
              marginBottom: BasePaddingsMargins.m10
            }
          ]}>Recent Achievements:</Text>
          {
            theData().list.map((obj, key:number)=>{

              const itemObj: ILFInputGridInput = obj[0] as ILFInputGridInput;
              // // // console.log('obj:', obj);

              return <View key={`item-list-${key}`} style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: BasePaddingsMargins.m10
              }}>
                <Ionicons name="chevron-forward-circle" style={[
                  {
                    color: BaseColors.primary,
                    fontSize: StyleZ.h5.fontSize,
                    marginRight: BasePaddingsMargins.m10
                  }
                ]} />
                <Text style={[
                  StyleZ.h5
                ]}>{itemObj.value}</Text>
              </View>
            })
          }
        </View>
        </>
        :
        null
      }
      

    </UIPanel>

  </ScreenScrollView>
  <ModalEditorContent
    // key={`modal-editor-for-`}
    F_isOpened={set_modalEditorIsOpened}
    isOpened={modalEditorIsOpened}
    type={ECustomContentType.ContentFeaturedPlayer}
    data_row={featuredPlayerData}
    set_data_row={set_featuredPlayerData}
  />
  </>
}