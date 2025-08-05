import { View } from "react-native";
import LFInput from "./LFInput";
import { EInputValidation } from "./Interface";
import { useEffect, useState } from "react";

export default function LFInputEquipment(

  {
    equipment,
    set_equipment,
    custom_equipment,
    set_custom_equipment,
    validations,
  }
  :
  {
    equipment: string,
    set_equipment: (s:string)=>void,
    custom_equipment: string,
    set_custom_equipment: (s:string)=>void,
    validations: EInputValidation[]
  }

){
  

  const [localEQ, set_localEQ] = useState<string>('');

  useEffect(()=>{
    set_localEQ(equipment)
  }, [])

  return <View>

  <LFInput 
    keyboardType="default" label={`${validations.length>0?'*':''}Equipment`}
    placeholder="Select Equipment"
    typeInput="dropdown"
    defaultValue={
      equipment
    }
    value={equipment}
    onChangeText={(text:string)=>{
      set_equipment(text);
      set_localEQ( text );
      // setErrorForm('')
    }}
    validations={validations}
    items={[
      {label:'Diamond Tables', value:'diamond-tables'},
      {label:'Rasson Tables', value:'rasson-tables'},
      {label:'Predator Tables', value:'predator-tables'},
      {label:'Brunswick Gold Crowns', value:'brunswick-gold-crowns'},
      {label:'Valley Tables', value:'valley-tables'},
      {label:'Custom', value:'custom'},
    ]}
    />

    <View style={{
      display: localEQ==='custom'?'flex':'none'
    }}>
      <LFInput 
        label="Custom Equipemnt"
        placeholder="Enter Custom Equipemnt"
        value={custom_equipment}
        onChangeText={(t:string)=>{
          set_custom_equipment(t)
        }}
      />
    </View>

  </View>
}