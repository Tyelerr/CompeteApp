// import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';
import CustomSlider from './SliderCustom';
import { StyleSlider } from '../../../assets/css/styles';
import { useState } from 'react';
import RnRangeSlider from 'rn-range-slider';
import { rangeSlider_renderRail, rangeSlider_renderRailSelected, rangeSlider_renderThumb } from './ZSliderRange';
import { BaseColors } from '../../../hooks/Template';


export default function ZSliderSingle(
  {
    min,
    max,
    initialValue,
    label,
    valueTemplate,
    measurementTemplates,
    onValueChange
  }
  :
  {
    min: number,
    max: number,
    initialValue: number,
    label: string,
    //valueTemplate should be like value {v} where after {v} will change to the value
    valueTemplate: string,
    onValueChange?: (v:number)=>void,

    // it will contain array with 2 values simillar as valueTemplate
    measurementTemplates:string[]
  }
){

  const [localValue, set_localValue] = useState<number>(initialValue);

  return <View>
    <View style={[
      StyleSlider.titleContainer
    ]}>
      <Text style={[
        StyleSlider.title
      ]}>
        {label}
      </Text>
      <Text style={[
        StyleSlider.singleValue
      ]}>
        {
          valueTemplate.replace('{v}', localValue.toString())
        }
      </Text>
    </View>
    {/*<CustomSlider
      min={min}
      max={max}
      initialValue={initialValue}
      onValueChange={(v:number)=>{
        if(onValueChange!==undefined){
          onValueChange(v);
        }
        // set_localValue(v);
      }}
    />*/}
    <View style={{
      position: 'relative'
    }}>


      <View style={{
        position: 'absolute',
        backgroundColor: BaseColors.othertexts,
        height: 4,
        width: '100%',
        left: 0,
        top: 0 - .5*4/*border total width of the thumb*/ + .5*25,
        borderRadius: 2
      }} />

      <RnRangeSlider
        min={min}
        max={max}
        disableRange={true}
        step={1}
        renderThumb={rangeSlider_renderThumb}
        renderRail={rangeSlider_renderRail}
        renderRailSelected={rangeSlider_renderRailSelected}
        onValueChanged={(v:number)=>{
          // // // // // // console.log(`vl: ${vl}, vr: ${vr}`);
          if(onValueChange!==undefined){
            onValueChange(v);
          }
          set_localValue(v);
        }}
      />
    </View>
    <View style={[
      StyleSlider.footer_measures
    ]}>
      <Text style={StyleSlider.footer_measures_text}>
        {
          measurementTemplates[0].replace('{v}', min.toString())
        }
      </Text>
      <Text style={StyleSlider.footer_measures_text}>
        {
          measurementTemplates[1].replace('{v}', max.toString())
        }
      </Text>
    </View>
  </View>
}


/*const stylesSingleSlider = StyleSheet.create({
  trackMarkContainer:{
    backgroundColor: 'red'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    // width: '100%',
    // opacity: .1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  valueText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 30,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  info: {
    marginTop: 40,
    alignItems: 'flex-start',
    width: '90%',
  },
});


// --- And define the styles ---
const stylesSingleSlider2 = StyleSheet.create({
  slider: {
    width: '90%', // Example width
    height: 40,   // Overall height of the slider component
  },
  customThumb: {
    width: 40,     // Example: make the thumb wider
    height: 40,    // Example: make the thumb taller
    borderRadius: 14, // Example: make it a perfect circle if width/height are equal
    backgroundColor: 'red', // Example: custom background color (overrides thumbTintColor if present)
    borderWidth: 2,
    borderColor: 'white',
    // Add shadow if desired (Platform.select for iOS/Android shadows)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  customTrack: {
    height: 6,     // Example: make the track thicker
    borderRadius: 3, // Example: round the ends of the track
    // Note: trackStyle cannot set track colors; use minimumTrackTintColor and maximumTrackTintColor for colors.
  },
  // ... other styles
});*/