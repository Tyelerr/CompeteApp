import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleModal, StyleZ } from "../../../assets/css/styles";
import { BasePaddingsMargins } from "../../../hooks/Template";
import LFButton from "../../LoginForms/Button/LFButton";
import DirectPlaceSearch from "../GoogleSearchVenue";
import LFInput from "../../LoginForms/LFInput";
import { useEffect, useState } from "react";
import { EInputValidation } from "../../LoginForms/Interface";
import UIModalCloseButton from "../../UI/UIModal/UIModalCloseButton";
import { AddNewVenue } from "../../../ApiSupabase/CrudVenues";
import { ICAUserData, IVenue } from "../../../hooks/InterfacesGlobal";
import { useContextAuth } from "../../../context/ContextAuth";

export default function ModalAddVenue(

  {
    show,
    showF,
    barOwner
  }
  :
  {
    show: boolean,
    showF: (v:boolean)=>void,
    barOwner: ICAUserData
  }

){

  /*const {
    user
  } = useContextAuth();*/

  const [venue, set_venue] = useState<string>('');
  const [venueLat, set_venueLat] = useState<string>('');
  const [venueLng, set_venueLng] = useState<string>('');
  const [venueAddress, set_venueAddress] = useState<string>('');
  const [phone_number, set_phone_number] = useState<string>('');
  const [pingValidation, set_pingValidation] = useState<boolean>(false);
  const [loading, set_loading] = useState<boolean>(false);

  const __AddNewVenue = async ()=>{
    
    // if(user===null)return;

    set_loading(true);

    const {
      error, data
    } = await AddNewVenue(
      {
        id: -1,
        venue: venue,
        address: venueAddress,
        venue_lat: venueLat,
        venue_lng: venueLng,
        point_location: 'this will be set inside the crud function',
        profile_id: barOwner.id_auto,
        phone: phone_number
      } as IVenue
    );

    set_loading(false);


    showF( false );
  }

  useEffect(()=>{

    set_pingValidation(!pingValidation);

  }, [
    venue, venueLat, venueLng, venueAddress
  ])

  return <Modal animationType="fade"
    transparent={true}
    visible={show}
  >
    <View style={[
      StyleModal.container
    ]}>

      
      <TouchableOpacity 
          style={[StyleModal.backgroundTouchableForClosing]} 
          onPress={()=>{
          // F_isOpened(false)
          showF(false)
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
      
            <UIModalCloseButton F_isOpened={showF} />

            <View style={[
              {
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between'
              }
            ]}>
              <Text style={[
                StyleZ.h4,
                {
                  marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
                }
              ]}>Venue Information</Text>
              {/*<View style={[
                {
                  width: 120
                }
              ]}>
                <LFButton 
                  type="primary"
                  icon="add"
                  label="Add New"
                  marginbottom={BasePaddingsMargins.formInputMarginLess}
                />
              </View>*/}
            </View>

            <Text style={[
              StyleZ.p,
              {
                marginBottom: BasePaddingsMargins.formInputMarginLess
              }
            ]}>Search your venue address and select from the items.</Text>




            <DirectPlaceSearch 
              setVenueOut={(v:string)=>{
                set_venue(v);
              }} 
              setAddressOut={(va:string)=>{
                set_venueAddress(va);
              }} 
              setLatOut={set_venueLat}
              setLngOut={set_venueLng}
              />


            
            <LFInput 
              keyboardType="default" 
              label="Address"
              typeInput="textarea"
              // onlyRead={true}
              onlyRead={true}

              defaultValue={
                venueAddress
              }
              value={venueAddress}
              placeholder="Address will be automatically filled..."
              onChangeText={(text:string)=>{
              }}
              validations={[
                EInputValidation.Required,
              ]}
              />

            <LFInput 
              pingValidation={pingValidation}
              keyboardType="phone-pad" 
              label="*Phone Number"
              defaultValue={
                "*Enter Phone Number"
              }
              value={phone_number}
              placeholder="Enter contact phone number..."
              onChangeText={(text:string)=>{
                set_phone_number(text)
              }}
              validations={[
                EInputValidation.Required,
              ]}
              />


            <LFButton type="primary" label="Create Your Venue" loading={loading} onPress={()=>{
              __AddNewVenue()
            }} />

          </View>

        </ScrollView>
      </View>



    </View>
  </Modal>
}