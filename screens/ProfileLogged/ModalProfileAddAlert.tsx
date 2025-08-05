import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleModal, StyleZ } from "../../assets/css/styles";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { useEffect, useState } from "react";
import UIModalCloseButton from "../../components/UI/UIModal/UIModalCloseButton";
import LFInput from "../../components/LoginForms/LFInput";
import { EInputValidation } from "../../components/LoginForms/Interface";
import { GameTypes, IAlert } from "../../hooks/InterfacesGlobal";
import RnRangeSlider from "rn-range-slider";
import LFInputsRow from "../../components/LoginForms/LFInputsRow";
import Checkbox from "expo-checkbox";
import LFCheckBox from "../../components/LoginForms/LFCheckBox";
import LFCheckboxesGroup from "../../components/LoginForms/LFCheckboxesGroup";
import LBButtonsGroup from "../../components/LoginForms/Button/LBButtonsGroup";
import { CreateAlert, GetAlertById, UpdateAlert } from "../../ApiSupabase/CrudAlerts";
// import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useContextAuth } from "../../context/ContextAuth";
import ModalInfoMessage from "../../components/UI/UIModal/ModalInfoMessage";
// import { supabase } from "../../ApiSupabase/supabase";

export default function ModalProfileAddAlert({
  isOpened,
  F_isOpened,
  alertIdForEditing,
}:{
  isOpened:boolean,
  F_isOpened:(v:boolean)=>void,
  alertIdForEditing:string
}){

  const {
    user
  } = useContextAuth();
  // const [isOpened, F_isOpened] = useState<boolean>(true);


  const [alertName, set_alertName] = useState<string>('');
  const [preferredGame, set_preferredGame] = useState<string>('');
  const [fargoRangeFrom, set_fargoRangeFrom] = useState<number>(0);
  const [fargoRangeTo, set_fargoRangeTo] = useState<number>(4000);
  const [maxEntryFee, set_maxEntryFee] = useState<number>(0);
  const [location, set_location] = useState<string>('');

  const [checked_reports_to_fargo, set_checked_reports_to_fargo] = useState<boolean>(false);
  const [checked_open_tournament, set_checked_open_tournament] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  // const [info_message_visible, set_info_message_visible] = useState<boolean>(true);
  const [infoTitle, set_infoTitle] = useState<string>('');
  const [infoMessage, set_infoMessage] = useState<string>('');
  const [infoMessageId, set_infoMessageId] = useState<number>(0);

  const ___GetTheInputDetails = ():IAlert=>{
    return {
      creator_id: user?.id,
      name: alertName,
      preffered_game: preferredGame,
      fargo_range_from: fargoRangeFrom,
      fargo_range_to: fargoRangeTo,
      max_entry_fee: maxEntryFee,
      location: location,
      reports_to_fargo: checked_reports_to_fargo,
      checked_open_tournament: checked_open_tournament,
    } as IAlert;
  }
  const ___CreateTheAlert = async ()=>{
    setLoading(true);
    // const {} = await supabase.
    const details = await CreateAlert(___GetTheInputDetails());
    // Alert.alert(details.error as string);
    setLoading(false);
    set_infoTitle('Alert Created!');
    set_infoMessage('Your new alert has been successfully created.');
    set_infoMessageId((new Date()).valueOf());
    // closing the modal:
    // F_isOpened(false);
  }
  const ___UpdateTheAlert = async ()=>{
    setLoading(true);
    const details = await UpdateAlert(alertIdForEditing, ___GetTheInputDetails());
    setLoading(false);
    set_infoTitle('Alert Updated!');
    set_infoMessage('Your alert has been successfully updated.');
    set_infoMessageId((new Date()).valueOf());
  }

  const getTheAlert = async ()=>{
    const _alert:IAlert = await GetAlertById(alertIdForEditing);
    if(_alert!==null){
      set_alertName(_alert.name);
      set_preferredGame(_alert.preffered_game);
      set_fargoRangeFrom(_alert.fargo_range_from);
      set_fargoRangeTo(_alert.fargo_range_to);
      set_maxEntryFee(_alert.max_entry_fee);
      set_location(_alert.location);
      set_checked_reports_to_fargo(_alert.reports_to_fargo);
      set_checked_open_tournament(_alert.checked_open_tournament);
    }
    // // // // // // console.log('_alert:', _alert)
  }

  useEffect(()=>{
    if(alertIdForEditing!=='')
      getTheAlert();
  }, [alertIdForEditing])

  return <>
  <Modal
    animationType="fade"
    transparent={true}
    visible={isOpened}
  >
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
          StyleModal.scrollView
        ]}>
          
          <View style={[
            StyleModal.contentView
          ]}>
            
            
            {/*<View style={StyleModal.closeButtonContainer}>
              <LFButton type="outline-dark" label="" icon="close" size="small" onPress={()=>{
                F_isOpened(false)
              }} />
            </View>*/}
            <UIModalCloseButton F_isOpened={F_isOpened} />

            <View style={[
                          StyleModal.headingContainer
                        ]}>
              <Text style={[
                StyleModal.heading
              ]}>Create New Search Alert</Text>
            </View>

            <View style={[
              StyleZ.loginFromContainer,
              {
                minHeight: 0
              }
            ]}>
              <View style={StyleZ.loginForm}>
                
                <LFInput 
                  value={alertName}
                  keyboardType="default" label="Alert Name"
                  placeholder="e.g., Local 9-Ball Tournaments"
                  defaultValue={
                    // user?.user_name
                    alertName
                  }
                  onChangeText={(text:string)=>{
                    set_alertName(text);
                    // setErrorForm('')
                  }}
                  validations={[
                    EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}
                  />

                <LFInput 
                  typeInput="dropdown"
                  value={preferredGame}
                  keyboardType="default" label="Preferred Game"
                  placeholder="Select preferred game"
                  defaultValue={
                    // user?.preferred_game,
                    preferredGame
                  }
                  onChangeText={(text:string)=>{
                    set_preferredGame(text);
                    // setErrorForm('')
                  }}
                  validations={[
                    EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}
                  

                  items={GameTypes}

                  />
                
                {/*<RnRangeSlider min={0} max={4000} />*/}
                <LFInputsRow label="Fargo Range" inputs={[
                  <LFInput 
                    keyboardType="numeric"
                    placeholder="From"
                    value={fargoRangeFrom.toString()}
                    defaultValue={
                      // user?.user_name
                      fargoRangeFrom.toString()
                    }
                    onChangeText={(text:string)=>{
                      set_fargoRangeFrom(Number(text));
                      // setErrorForm('')
                    }}
                    validations={[
                      EInputValidation.Required,
                      // EInputValidation.Email,
                    ]}
                    />
                  ,
                  
                  <LFInput 
                    keyboardType="numeric"
                    placeholder="To"
                    value={fargoRangeTo.toString()}
                    defaultValue={
                      // user?.user_name
                      fargoRangeTo.toString()
                    }
                    onChangeText={(text:string)=>{
                      set_fargoRangeTo(Number(text));
                      // setErrorForm('')
                    }}
                    validations={[
                      EInputValidation.Required,
                      // EInputValidation.Email,
                    ]}
                    />
                ]} />

                <LFInput 
                  keyboardType="numeric" label="Max Entry Fee"
                  placeholder="Add Max Entry Fee"
                  value={maxEntryFee.toString()}
                  defaultValue={
                    // user?.user_name
                    maxEntryFee.toString()
                  }
                  onChangeText={(text:string)=>{
                    set_maxEntryFee(Number(text));
                    // setErrorForm('')
                  }}
                  validations={[
                    EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}
                  />

                
                <LFInput 
                  keyboardType="default" label="Location(optional)"
                  placeholder="City or venue name"
                  value={location}
                  defaultValue={
                    // user?.user_name
                    location
                  }
                  onChangeText={(text:string)=>{
                    set_location(text);
                    // setErrorForm('')
                  }}
                  validations={[
                    // EInputValidation.Required,
                    // EInputValidation.Email,
                  ]}
                  />
                

                <LFCheckboxesGroup checkboxes={[
                  <LFCheckBox label="Reports to Fargo" checked={checked_reports_to_fargo} set_checked={set_checked_reports_to_fargo} />,
                  <LFCheckBox label="Open Tournament" checked={checked_open_tournament} set_checked={set_checked_open_tournament} />
                ]} />

                <LBButtonsGroup buttons={[
                  (
                    alertIdForEditing===''?
                      <LFButton label="Create Alert" icon="notifications" type="primary" loading={loading} onPress={()=>{
                        ___CreateTheAlert()
                      }} />
                      :
                      <LFButton label="Update Alert" icon="notifications" type="primary" loading={loading} onPress={()=>{
                        ___UpdateTheAlert()
                      }} />
                  ),
                  <LFButton label="Cancel" type="secondary" onPress={()=>{
                    F_isOpened(false)
                  }} />
                ]} />



              </View>
            </View>


          </View>

        </ScrollView>
      </View>
    </View>
  </Modal>

  <ModalInfoMessage message={infoMessage} title={infoTitle} id={infoMessageId} />

  </>
}