import { Ionicons } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import { useEffect, useState } from "react";
import { StyleZ } from "../../assets/css/styles";
import LFButton from "../LoginForms/Button/LFButton";
import LFInput from "../LoginForms/LFInput";
import DirectPlaceSearch from "./GoogleSearchVenue";
import RnRangeSlider from "rn-range-slider";
import ZSlider from "../UI/ZSlider/ZSlider";
import * as Location from 'expo-location';

export default function GoogleLocationRadis(
  {
    resetTheComponent,
    onChange
  }
  :
  {
    onChange?: (location:string, lan:string, lng:string, radius:number)=>void,
    resetTheComponent?: boolean
  }
){

  const [boxIsVisible, set_boxIsVisible] = useState<boolean>(false);
  const [milesRadius, set_milesRadius] = useState<number>(0);
  const [locationName, set_locationName] = useState<string>('');
  const [locationLat, set_locationLat] = useState<string>('');
  const [locationLng, set_locationLng] = useState<string>('');

  const [loadingCurrentLocation, set_loadingCurrentLocation] = useState<boolean>(false);

  useEffect(()=>{
    // // console.log('Constructing GoogleLocationRadius');
  }, []);

  useEffect(()=>{
    if(resetTheComponent===undefined)return;

    set_boxIsVisible(false);
    set_milesRadius(0);
    set_locationName('');
    set_locationLat('');
    set_locationLng('');
    set_loadingCurrentLocation(false);

    // console.log('Resetting the GoogleLocationRadius');

  }, [resetTheComponent]);

  const ___LoadCurrentLocation = async ()=>{


    const { status } = await Location.requestForegroundPermissionsAsync();
    if(status!=='granted'){}

    set_loadingCurrentLocation(true)

    try{
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Balanced,
        timeInterval: 60*1000
      });
      // currentLocation.coords.latitude
      // // // console.log('currentLocation:', currentLocation);
      set_locationLat( currentLocation.coords.latitude.toString() );
      set_locationLng( currentLocation.coords.longitude.toString() );
      set_locationName( 'Current' );
      set_loadingCurrentLocation(false);
    }
    catch(error){
      // // // console.log('currentLocation error:', error);
      set_loadingCurrentLocation(false);
      return;
    } 
  }

  /*useEffect(()=>{
    if(onChange!==undefined){
      onChange( locationName, locationLat, locationLng, milesRadius );
    }
  }, [
    locationName,
    locationLat,
    locationLng,
    milesRadius,
  ])*/

  return <View style={[
    {
      marginBottom: BasePaddingsMargins.formInputMarginLess,
      position: 'relative'
    }
  ]}>
    
    {/*<Text style={{color: 'white'}}>Miles radius: {milesRadius}, reset boolean value: {resetTheComponent===true?'true':'false'}</Text>*/}

    <View style={[
      {
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative'
      }
    ]}>
      <TouchableOpacity 
        onPress={()=>{
          set_boxIsVisible(!boxIsVisible)
        }}
        style={[
        {
          width: 250,
          borderRadius: BasePaddingsMargins.m10,
          borderColor: BaseColors.othertexts,
          borderWidth: 1,
          borderStyle: 'solid',
          display: 'flex',
          // flex: 1,
          alignItems:  'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          paddingInline: BasePaddingsMargins.m15,
          paddingBlock: BasePaddingsMargins.m10,
          position: 'relative',
          // backgroundColor: 'yellow'
        }
      ]}>
        <Ionicons name="location" style={[
          {
            fontSize: TextsSizes.h4,
            color: BaseColors.light,
            marginRight: BasePaddingsMargins.m10
          }
        ]} />
        <View style={{
          width: '80%'
        }}>
          <Text style={[
            {
              fontSize: TextsSizes.small,
              color: BaseColors.othertexts
            }
          ]}>{locationName!==''?locationName:'Location'}</Text>
          <Text style={[
            {
              fontSize: TextsSizes.p,
              color: BaseColors.light
            }
          ]}>
            {
              milesRadius>0?
              <>{milesRadius} miles radius</>:
              <>Any radius</>
            }
          </Text>
        </View>

        <View style={{
          width: 30,
          // height: '100%',
          flex: 1,
          // position: 'absolute',
          // top: 0,
          // right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'red'
        }}>
          <Ionicons
          style={[
            {
              color: BaseColors.othertexts,
              fontSize: TextsSizes.small
            }
          ]} 
          name={boxIsVisible===true?'chevron-up':'chevron-down'} />
        </View>

      </TouchableOpacity>
    </View>

    <TouchableOpacity style={[
      {
        position: 'absolute',
        backgroundColor: 'transparent',
        left: -100,
        top: -1000,
        width: '200%',
        height: 3000,
        display: boxIsVisible===true?'flex':'none',
        zIndex: 100000
        
      }
    ]} onPress={()=>{
      set_boxIsVisible(false);
    }} />

    <View style={[
      {
        width: '100%',
        top: '100%',
        // bottom: '100%',
        position: 'absolute',
        zIndex: 100001,
        // position: 'static', // can't be absolute, because if there below the absolute 
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        display: boxIsVisible===true?'flex':'none',
        // backgroundColor: 'yellow'
      }
    ]}>
      <View style={[
        {
          padding: BasePaddingsMargins.m15,
          borderColor: BaseColors.othertexts,
          borderWidth: 1,
          borderStyle: 'solid',
          width: '90%',
          // height: 100,
          borderRadius: BasePaddingsMargins.m10,
          zIndex: 1000,
          backgroundColor: BaseColors.secondary,
          // boxShadow: 
        }
      ]}>


        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: BasePaddingsMargins.m10
        }}>

          <View style={{width: '57%'}}>
            <Text style={StyleZ.h4}>Search Location</Text>
          </View>
          <View style={{
            width: '42%'
          }}>
            <LFButton icon="locate" label="Use Current" size="small" type="secondary" onPress={()=>{

              ___LoadCurrentLocation();

            }} loading={loadingCurrentLocation} />
          </View>

        </View>


        {/*<ZSlider 
          type="single"
          label="Search Radius"
          min={0}
          max={100}
          initialValue={milesRadius}

          valueTemplate="{v} miles"
          measurementTemplates={['{v} mile', '{v} miles']}
          
          onValueChange={(v:number)=>{
            set_milesRadius(v)
            // // console.log('Search raidus:', v);

          }}

          />*/}

        <DirectPlaceSearch 
          placeholder="Enter city, state"
          setVenueOut={set_locationName}
          searchTextOut={locationName}
          // setAddressOut={locationName}
          marginBottom={BasePaddingsMargins.m10}
          setLatOut={(v:string)=>{
            set_locationLat(v);
          }}
          setLngOut={(v:string)=>{
            set_locationLng(v)
          }}
          />


          {/*<LFButton label="Append The Radius Location" type="primary" onPress={()=>{
            // set_milesRadius(v)

            Alert.alert('12');

            if(locationLat==='' || locationLng===''){
              Alert.alert('Please set current location or add City, state');
              return;
            }
            if(onChange!==undefined){
              onChange( locationName, locationLat, locationLng, milesRadius );
              set_boxIsVisible(false);
            }
            else{
              // // console.log('On change is undefined');
            }

          }} />*/}


        <ZSlider 
          type="single"
          label="Search Radius"
          min={0}
          max={100}
          initialValue={milesRadius}

          valueTemplate="{v} miles"
          measurementTemplates={['{v} mile', '{v} miles']}
          marginBottom={BasePaddingsMargins.m10}
          
          onValueChange={(v:number)=>{
            set_milesRadius(v)
            // // console.log('Search raidus:', v);

          }}

          />


        <LFButton label="Append The Radius Location" type="primary" onPress={()=>{
            // set_milesRadius(v)

            // Alert.alert('12');

            if(locationLat==='' || locationLng===''){
              Alert.alert('Please set current location or add City, state');
              return;
            }
            if(onChange!==undefined){
              onChange( locationName, locationLat, locationLng, milesRadius );
              set_boxIsVisible(false);
            }
            else{
              // // console.log('On change is undefined');
            }

          }} />






      </View>
    </View>

  </View>
}