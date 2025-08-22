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

export default function ScreenHomeFeaturedBar(){

  const {user} = useContextAuth();

  // // // // // // // console.log('user:', user);
  // // // // // // // console.log('user.role:', user?.role);

  const [modalEditorIsOpened, set_modalEditorIsOpened] = useState<boolean>(false);
  const [featuredPlayerData, set_featuredPlayerData] = useState<ICustomContent | null>(null);

  const theData = ():ICustomContent=>{
    return featuredPlayerData as ICustomContent;
  }

  const LoadData = async ()=>{
    const {data, error} = await GetTheLatestContent( ECustomContentType.ContentFeaturedBar );

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
          <UIBadge label="Featured Bar" type="primary-outline" />
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
        <View style={{
          marginBottom: BasePaddingsMargins.formInputMarginLess
        }}>
          <Text style={[
            StyleZ.h4,
            {
              marginBottom: BasePaddingsMargins.m10
            }
          ]}>Highlights:</Text>
          <View style={{
            flexDirection: 'row', 
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
          }}>
            {
            theData().labels.map((obj, key:number)=>{

              const itemObj: ILFInputGridInput = obj[0] as ILFInputGridInput;
              // // // // // // // console.log('obj:', obj);

              return <View key={`item-list-${key}`} style={{
                marginBottom: BasePaddingsMargins.m5,
                marginRight: BasePaddingsMargins.m5
              }}>
                <UIBadge type="secondary" label={itemObj.value as string} /> 
              </View>
            })
          }
          </View>


        </View>


        <View style={{
          flexDirection: 'row'
        }}>
          <Text style={[
            StyleZ.p,
            {
              fontSize: StyleZ.h3.fontSize,
              marginRight: BasePaddingsMargins.m5
            }
          ]}>Contact: </Text>
          <Text style={[
            StyleZ.p,
            {
              fontSize: StyleZ.h3.fontSize
            }
          ]}>{theData().phone_number}</Text>
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
    type={ECustomContentType.ContentFeaturedBar}
    data_row={featuredPlayerData}
    set_data_row={set_featuredPlayerData}
  />
  </>
}