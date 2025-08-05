/**
 * Don't use this
 */
import { View } from "react-native";
import ZSliderRange from "./ZSliderRange";

function SliderCustomRange({
  label,
  step,
  min,
  max
}
:
{
  label: string,
  step: number,
  min: number,
  max: number
}){
 
  

  return <View>
    <ZSliderRange
        min={min}
        max={max}
        step={step}
        label={label}
      />
  </View>
}