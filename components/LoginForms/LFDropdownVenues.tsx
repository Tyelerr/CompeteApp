import { useEffect, useState } from "react";
import { View } from "react-native";
import { FetchVenues, FetchVenuesFromBarOwnersThatICanUse } from "../../ApiSupabase/CrudVenues";
import { useContextAuth } from "../../context/ContextAuth";
import { IVenue } from "../../hooks/InterfacesGlobal";
import LFInput from "./LFInput";

export default function LFDropdownVenues(
  {
    listType,
    onChange
  }
  :
  {
    listType: 'my-venues' | 'venues-i-am-added-on',
    onChange?: (venue: IVenue)=>void 
  }
){

  const [venues, setVenues] = useState<IVenue[]>([]);
  const [venuesItemsDropdown, set_venuesItemsDropdown] = useState<{
    label: string, 
    value: string
  }[]>([]);

  const {
    user
  } = useContextAuth();

  const ___SetDataRaw = (dataRaw)=>{
    if(dataRaw!==null){
      const newData = dataRaw as IVenue[];
      setVenues(newData);
      const _venuesForTheDropdow:{label:string, value:string}[] = [];
      for(let i=0;i<newData.length;i++){
        _venuesForTheDropdow.push({
          label: newData[i].venue,
          value: newData[i].id.toString()
        });
      }
      set_venuesItemsDropdown( _venuesForTheDropdow );
    }
  }

  const _loadVenues = async ()=>{
    if(user===null)return;

    if(listType==='my-venues'){
      
      const {
        data: dataRaw,
        error
      } = await FetchVenues( user?.id_auto );

      ___SetDataRaw(dataRaw)
    }
    else if(listType==='venues-i-am-added-on'){
      const {
        data: dataRaw,
        error
      } = await FetchVenuesFromBarOwnersThatICanUse( user?.id_auto );
      ___SetDataRaw(dataRaw)
    }


  }

  useEffect(()=>{
    _loadVenues()
  }, []);

  if(venues.length===0)return null;

  return <View>
    <LFInput 
      label={listType==='my-venues'?'My venues':'Venues I am added on'}
      typeInput="dropdown"
      placeholder="Select Venue"
      items={venuesItemsDropdown}
      onChangeText={(text)=>{

      }}
      onChangeIndex={(index: number)=>{
        // // // // // console.log('Index: ', index);
        if(onChange!==undefined && index>0){
          // index must be bigger then 0, 0 item is for the placeholder
          onChange(venues[index-1]);
        }
      }}
    />
  </View>
}