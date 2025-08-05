// import { Alert, Text, View } from "react-native";
import { Text, View } from "react-native";
import ScreenScrollView from "../ScreenScrollView";
// import UIPanel from "../../components/UI/UIPanel";
// import LFButton from "../../components/LoginForms/Button/LFButton";
// import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
// import { supabase } from "../../ApiSupabase/supabase";
// import ProfileLoggedHeading from "./ProfileLoggedHeading";
// import ModalProfileEditor from "./ModalProfileEditor";
// import { useState } from "react";
// import { useContextAuth } from "../../context/ContextAuth";
import PanelUserDetailsAndEditor from "./PanelUserDetailsAndEditor";
import ProfileLoggedSubNavigation from "./ProfileLoggedSubNavigation";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import UIPanel from "../../components/UI/UIPanel";
import UIBadge from "../../components/UI/UIBadge";
import LFButton from "../../components/LoginForms/Button/LFButton";
import ModalProfileAddAlert from "./ModalProfileAddAlert";
import { useEffect, useState } from "react";
import { IAlert } from "../../hooks/InterfacesGlobal";
import { DeleteAlert, GetAlerts } from "../../ApiSupabase/CrudAlerts";
import { useContextAuth } from "../../context/ContextAuth";
import ModalInfoMessage from "../../components/UI/UIModal/ModalInfoMessage";


const AlertItem = ({label, value}:{label:string, value:string})=>{
  return <View>
    <Text style={{
      color: BaseColors.othertexts,
      fontSize: TextsSizes.small,
      marginBottom: BasePaddingsMargins.m5
    }}>{label}</Text>
    <Text style={{
      color: BaseColors.light,
      fontWeight: 'bold',
      fontSize: TextsSizes.p
    }}>{value}</Text>
  </View>
}
const AlrtItemRow = ({item1, item2, addMargin=false}:{item1:React.ReactNode, item2:React.ReactNode, addMargin?:boolean})=>{
  return <View style={{
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'flex-start',
    marginBottom: addMargin===true?BasePaddingsMargins.m15:0
  }}>
    <View style={{width: '48%'}}>{item1}</View>
    <View style={{width: '48%'}}>{item2}</View>
  </View>
}


export default function ProfileLoggedSearchAlerts(){

  const {
    user
  } = useContextAuth();

  const [isOpened, F_isOpened] = useState<boolean>(false);
  const [alerts, set_alerts] = useState<IAlert[]>([]);
  const [alertIdForEditing, setAlertIdForEditing] = useState<string>('');
  const [modal_delete_question_visible, set_modal_delete_question_visible] = useState<boolean>(false); 

  const GetTheAlerts = async ()=>{
    if(user!==null){
      const _alerts:IAlert[] = await GetAlerts(user.id);
      set_alerts(_alerts);
    }
  }

  const _DeleteAlert = async ()=>{
    const details = await DeleteAlert( alertIdForEditing );
    set_modal_delete_question_visible(false)
    GetTheAlerts()
  }

  useEffect(()=>{
    GetTheAlerts();
  }, [])

  return <>
    <ScreenScrollView>
      

      <View>


      <PanelUserDetailsAndEditor />

      <View style={{marginBottom: BasePaddingsMargins.m10}}>
        <ProfileLoggedSubNavigation />
      </View>
      
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: BasePaddingsMargins.m30
      }}>
        {/*<UIBadge label="4 favorites" marginBottom={BasePaddingsMargins.m5} type="secondary" />*/}
        <Text style={{
          fontSize: TextsSizes.h2, 
          fontWeight: 'bold',
          textAlign: 'center',
          color: BaseColors.light,
          width: '100%',
          marginBottom: BasePaddingsMargins.m10
        }}>Tournament Search Alerts</Text>
        <Text style={{
          fontSize: TextsSizes.p, color: BaseColors.othertexts,
          textAlign: 'center'
        }}>Save search criteria and get notified when tournaments match your preferences</Text>
      </View>

      <View style={{
        marginBottom: BasePaddingsMargins.m30,
        flexDirection: 'row',
        justifyContent: 'center'
      }}>
        <View>
          <LFButton 
            size="bigger"
            icon="add" 
            label="New Alert" 
            type="primary"
            onPress={()=>{
              F_isOpened(true);
              setAlertIdForEditing('')
            }}
             />
        </View>
      </View>

      {
        alerts.map((alert:IAlert, key)=>{
          return <UIPanel key={`alert-panel-${key}`}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: BasePaddingsMargins.m20
            }}>
              <View style={{
                width: '70%',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}>
                <Text style={{
                  display: 'flex',
                  color: BaseColors.light,
                  fontSize: TextsSizes.h4,
                  fontWeight: 'bold',
                  width: '100%',
                  marginBottom: BasePaddingsMargins.m10
                }}>{alert.name}</Text>
                <UIBadge label="Active" type="secondary" />
              </View>
              <View style={{
                width: '25%',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <View style={{
                  flexDirection: 'row',
                  width: '45%'
                }}>
                  <LFButton size="small" icon="pencil" type="outline-dark" onPress={()=>{
                    F_isOpened(true);
                    setAlertIdForEditing(alert.id);
                  }} />
                </View>
                <View style={{
                  flexDirection: 'row',
                  width: '45%'
                }}>
                  <LFButton size="small" icon="trash" type="danger" onPress={()=>{
                    set_modal_delete_question_visible(true);
                    setAlertIdForEditing(alert.id);
                  }} />
                </View>
              </View>
            </View>

            <AlrtItemRow 
              item1={<AlertItem label="Game Type" value={alert.preffered_game} />} 
              item2={<AlertItem label="Fargo Range" value={`${alert.fargo_range_from} - ${alert.fargo_range_to}`} />} 
              addMargin={true}
              />
            <View style={{
              marginBottom: BasePaddingsMargins.m20
            }}>
              <AlrtItemRow 
                item1={<AlertItem label="Max Entry Fee" value={`$${alert.max_entry_fee}`} />} 
                item2={<AlertItem label="Location" value={alert.location} />} />
            </View>

            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              {
                [1,2].map((obj, key_badge:number)=>{
                  return <View key={`footer-badge-${key}-${key_badge}`} style={{
                    marginRight: 10, marginBottom: 5
                  }}><UIBadge label="Reports to Fargo" /></View>
                })
              }
            </View>
            

          </UIPanel>
        })
      }

      </View>

        
    </ScreenScrollView>

    {
      isOpened===true?
      <ModalProfileAddAlert F_isOpened={F_isOpened} isOpened={isOpened} alertIdForEditing={alertIdForEditing} />
      :null
    }

    {
      modal_delete_question_visible===true?
      <ModalInfoMessage 
        id={0} 
        visible={modal_delete_question_visible}
        set_visible={set_modal_delete_question_visible}
        title="Delete Alert?" message="Are you sure you want to delete this alert? This action cannot be undone." buttons={[
        <LFButton label="Cancel" type="secondary" size="small" onPress={()=>{
          set_modal_delete_question_visible(false);
        }} />,
        <LFButton label="Delete" type="danger" size="small" icon="trash" onPress={()=>{
          _DeleteAlert()
        }} 
        />

        
      ]} />
      :
      null
    }

  </>
}