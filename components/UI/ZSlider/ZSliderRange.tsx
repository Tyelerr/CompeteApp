import { Text, View } from "react-native"
import RnRangeSlider from "crn-range-slider"
import { StyleSlider } from "../../../assets/css/styles"
import { BaseColors } from "../../../hooks/Template"
import { useEffect, useState } from "react"
import LFButton from "../../LoginForms/Button/LFButton"

export default function ZSliderRange(
  {
    min,
    max,
    step,
    label,
    measurementTemplates,
    templateValuesMinMax,
    onValueChange,

    valueLeft,
    valueRight,
  }
  :
  {
    min: number,
    max: number,
    step: number,
    label: string,
    measurementTemplates: string[],
    templateValuesMinMax: string,
    onValueChange?: (vl:number, vr:number)=>void,

    valueLeft?: number,
    valueRight?: number,
  }
){
  
  const [valueLocalL, set_valueLocalL] = useState<number>(valueLeft!==undefined?valueLeft:min);
  const [valueLocalR, set_valueLocalR] = useState<number>(valueRight!==undefined?valueRight:max);

  const [iCanUpdateValues, set_iCanUpdateValues] = useState(false);

  let ICanUpdate: boolean = false;

  useEffect(()=>{
    // // // // // // // console.log('ZSliderRange redndering');
    /*setTimeout(()=>{
      set_iCanUpdateValues(true);
    }, 50)*/
    // ICanUpdate = true;

    return ()=>{
      ICanUpdate = false
    }
  }, [])

  return <View>
      {/*<LFButton label="test 2" type="primary" onPress={()=>{
        set_iCanUpdateValues(!true)
        // // // // // // // console.log('Is working');
      }} />*/}
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
          // `$225 — $625`
          (()=>{
            if(valueLeft!==undefined && valueRight!==undefined)
              return templateValuesMinMax.replace('{vl}', valueLeft.toString()).replace('{vr}', valueRight.toString());
            else
              return templateValuesMinMax.replace('{vl}', valueLocalL.toString()).replace('{vr}', valueLocalR.toString());
          })()
        }
      </Text>

    </View>
    <View style={{
      width: '100%',
      // padding: 20
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
        low={valueLeft}
        high={valueRight}
        step={step}
        style={{
          // backgroundColor: "red",
          position: 'relative'
        }}
        onValueChanged={(vL,vR)=>{
          // if(!iCanUpdateValues)return;
          // // // // // // // // console.log('values range:', `${vL} - ${vR}`);
          // // // // // // // // console.log(`valueLeft:${valueLeft} - valueRight:${valueRight}`);
          // if(vL===min && vR===max && )

          // if(!ICanUpdate)return;

          if(onValueChange!==undefined){
            onValueChange( vL, vR );
          }
          else{
            set_valueLocalL(vL);
            set_valueLocalR(vR);
          }
        }}
      
        renderThumb={rangeSlider_renderThumb}
        renderRail={rangeSlider_renderRail}
        renderRailSelected={rangeSlider_renderRailSelected}
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


export const rangeSlider_renderThumb = ()=>{
  return <View style={[
    {
      width: 25,
        height: 25,
        borderRadius: 15,
        backgroundColor: BaseColors.primary, // Blue thumb
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Android shadow
        justifyContent: 'center', // If you add content to thumb
        alignItems: 'center',     // If you add content to thumb
    }
  ]}></View>
}
export const rangeSlider_renderRail = ()=>{
  return <View style={[
    {
      backgroundColor: 'red', // Gray track for unselected part
      height: 4,
      borderRadius: 2,
    }
  ]}></View>
};
export const rangeSlider_renderRailSelected = ()=>{
  return <View style={[
    {
      backgroundColor: BaseColors.primary, // Blue track for selected part
      height: 8,
      borderRadius: 2,
      marginLeft: 0,
      width: '100%',
      left: ( 0 - .5*25),
      // paddingLeft: 0,
      // position: "relative"
    }
  ]}></View>
}