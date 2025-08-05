import { View, Text } from "react-native";
import { StyleZ } from "../../../assets/css/styles";
import { BasePaddingsMargins } from "../../../hooks/Template";
import LFButton from "../../LoginForms/Button/LFButton";

export default function Pagination(

  {
    totalCount,
    offset,
    countPerPage,
    FLoadDataByOffset
  }
  :
  {
    totalCount: number,
    offset: number,
    countPerPage: number,
    FLoadDataByOffset?: (n?:number)=>void
  }

){


  const __totalPages = ():number=>{
    const total_pages:number = Math.floor( totalCount / countPerPage );
    return ( total_pages>=totalCount / countPerPage?total_pages:total_pages+1 );
  }

  return <View style={[
    {
      marginBottom: BasePaddingsMargins.m15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 40
    }
  ]}>

    <Text style={StyleZ.p}>Total Count: {totalCount}</Text>

    {
      __totalPages()>1?
      <View style={[
        {
          flexDirection: 'row',
          alignItems: 'center'
        }
      ]}>
        <View style={[
          {
            width: 40,
          },
          (offset===0?{pointerEvents: 'none'}:null)
        ]}>
          <LFButton type={offset===0?'dark':'primary'} icon="chevron-back" size="small" onPress={()=>{
            if(FLoadDataByOffset!==undefined)
            FLoadDataByOffset( offset - 1 );
          }} />
        </View>
        <Text style={[
          StyleZ.p,
          {
            marginInline: BasePaddingsMargins.m10
          }
        ]}>Page {offset+1} / {__totalPages()}</Text>
        <View style={[
          {width: 40},
          (offset+1===__totalPages()?{pointerEvents: 'none'}:null)
        ]}>
          <LFButton type={offset+1===__totalPages()?'dark':'primary'} icon="chevron-forward" size="small" onPress={()=>{
            if(FLoadDataByOffset!==undefined)
              FLoadDataByOffset( offset + 1 );
          }} />
        </View>
      </View>:
      null
    }

  </View>
}