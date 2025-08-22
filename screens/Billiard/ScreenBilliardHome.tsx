import { Image, Text, TouchableOpacity, View } from "react-native";
import ScreenScrollView from "../ScreenScrollView";
import ScreenBilliardThumb from "./ScreenBilliardThumb";
import { fargo_rated_tournaments_thumb, tournament_thumb_10_ball, tournament_thumb_8_ball, tournament_thumb_9_ball } from "../../hooks/constants";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import { ITournament, ITournamentFilters } from "../../hooks/InterfacesGlobal";
import UIBadge from "../../components/UI/UIBadge";
import { StyleZ } from "../../assets/css/styles";
import { Ionicons } from "@expo/vector-icons";
import ScreenBilliardThumbDetails from "./ScreenBilliardThumbDetails";
import { useEffect, useState } from "react";
import { FetchTournaments_Filters } from "../../ApiSupabase/CrudTournament";
import ScreenBilliardModalTournament from "./ScreenBilliardModalTournament";
import LFInput from "../../components/LoginForms/LFInput";
import LFButton from "../../components/LoginForms/Button/LFButton";
import GoogleLocationRadis from "../../components/google/GoogleLocationRadius";
import ScreenBilliardModalFilters from "./ScreenBilliardModalFilters";
import ZSlider from "../../components/UI/ZSlider/ZSlider";
import ScreenBilliardListTournaments from "./ScreenBilliardListTournaments";

export default function ScreenBilliardHome(


  {
    hideTheThumbsNavigation
  }
  :
  {
    hideTheThumbsNavigation?: boolean
  }

){

  const [tournaments, set_tournaments] = useState<ITournament[]>([]);
  const [selectedTournament, set_selectedTournament] = useState<ITournament | null>(null);
  const [ScreenBilliardModalTournament_opened, set_ScreenBilliardModalTournament_opened] = useState<boolean>(true);
  const [modalFiltersOpened, set_modalFiltersOpened] = useState(false);
  const [filtersForSearch, set_filtersForSearch] = useState<ITournamentFilters>({} as ITournamentFilters);

  const [iHaveFiltersSelected, set_iHaveFiltersSelected] = useState<boolean>(false);

  const [reset_GoogleLocationRadis, set_reset_GoogleLocationRadis] = useState<boolean>(false);


  // for the radisu dropdown to rest after filters rest i will change the key
  const [GoogleLocationRadis_key, set_GoogleLocationRadis_key] = useState<number>(0);
  const [offsetTournaments, set_offsetTournaments]  = useState<number>(0);
  const [totalCount, set_totalCount]  = useState<number>(0);

  const __LoadTheTournaments = async (offset?:number)=>{
    // // // // // // console.log('Load tournament started');

    // // // // console.log('filtersForSearch for search:', filtersForSearch);

  

    const {
      data, error,
      dataTotalCOunt
    } = await FetchTournaments_Filters(filtersForSearch, offset);

    // console.log('Loading tournaments:');
    // console.log('data', data);
    // console.log('error', error);

    if(error!==null){
    }
    else if(data!==null){
      const __THeTournamets: ITournament[] = [];
      for(let i=0;i<data.length;i++){
        __THeTournamets.push( data[i] as ITournament );
      }
      set_tournaments( __THeTournamets );
    }
    set_offsetTournaments(offset!==undefined ? offset : 0);
    set_totalCount(dataTotalCOunt!==null ? dataTotalCOunt[0].totalcount as number : 0);
    // // // // // // console.log('Load Tournament ended');
    // // // // // // console.log('data total count:', dataTotalCOunt);

    // set_GoogleLocationRadis_key( GoogleLocationRadis_key + 1 )

  }

  useEffect(()=>{
    __LoadTheTournaments();
  }, []);

  useEffect(()=>{
    // // // // // // // console.log('filtersForSearch:', filtersForSearch);

    let timeoutId: NodeJS.Timeout;

    // Simulate fetching data after a fixed delay
    // This will run once when the component mounts
    timeoutId = setTimeout(() => {
      // // // // // // // console.log('Fetching posts after fixed delay...');
      __LoadTheTournaments();
    }, 300);

    // Cleanup function: clear the timeout if the component unmounts
    // or if the dependencies (which are empty here) would change,
    // though for a fixed-delay-on-mount, this is mainly for unmount.
    return () => {
      // // // // // // // console.log('Clearing fixed delay timeout...');
      clearTimeout(timeoutId);
    };

  }, [filtersForSearch]);

  const TheThumbnails = [
    {
      title: 'Daily Tournaments',
      images: [tournament_thumb_8_ball, tournament_thumb_9_ball, tournament_thumb_10_ball],
      route: 'BilliardDailyTournaments'
    },
    {
      title: 'Fargo Rated Tournaments',
      images: [fargo_rated_tournaments_thumb],
      route: 'BilliardFargoRated'
    }
  ];

  return <>
    <ScreenScrollView>
      {
        hideTheThumbsNavigation===true?
        <View style={{
          paddingBlock: BasePaddingsMargins.m10
        }} />
        :
        <View style={[
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: BasePaddingsMargins.m10
          }
        ]}>
          {
            TheThumbnails.map((obj, key:number)=>{
              return <ScreenBilliardThumb 
                title={obj.title}
                images={obj.images}
                routeName={obj.route}
                key={`screen-billiard-${key}`}
                />
            })
          }
        </View>
      }
      


      {/*filters starts*/}
      <View style={[
        {
          marginBottom: BasePaddingsMargins.formInputMarginLess
        }
      ]}>
        <LFInput 
          placeholder="Search tournaments..." 
          iconFront="search" 
          marginBottomInit={BasePaddingsMargins.formInputMarginLess}
          onChangeText={(t:string)=>{
            set_filtersForSearch(
              {
                ...JSON.parse(JSON.stringify(filtersForSearch)),
                ...{
                  search: t
                }
              } as ITournamentFilters
            );
          }}
          />
        
        <GoogleLocationRadis 
          resetTheComponent={reset_GoogleLocationRadis}
          key={`GoogleLocationRadis-${GoogleLocationRadis_key}`}
        onChange={(location:string, lat:string, lng:string, radius:number)=>{
          
          // // // // // // console.log('GoogleLocationRadis on change...');
          
          const filtersAfterRadiusLocationChange:ITournamentFilters = {
              ...JSON.parse(JSON.stringify(filtersForSearch)),
              ...{
                venue: location,
                lat: lat,
                lng: lng,
                radius: radius
              }
            } as ITournamentFilters;
          // // // // // // console.log('filtersAfterRadiusLocationChange:', filtersAfterRadiusLocationChange);
          set_filtersForSearch( filtersAfterRadiusLocationChange );
          
        }} />



        <View style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }
        ]}>
          <View style={{width: '48%'}}>
            <LFButton label="Filters" icon="filter" type={
              iHaveFiltersSelected
              ?
              "success"
              :
              "outline-dark"
            } onPress={()=>{
              set_modalFiltersOpened( !modalFiltersOpened );
            }} />
          </View>
          <View style={{width: '48%'}}>
            <LFButton label="Reset Filters" icon="trash" type="primary" onPress={
              ()=>{
                set_filtersForSearch({} as ITournamentFilters);
                set_iHaveFiltersSelected(false);
                set_GoogleLocationRadis_key( GoogleLocationRadis_key + 1 );
                // on bool true or false will reset :)
                set_reset_GoogleLocationRadis( !reset_GoogleLocationRadis );
              }
            } />
          </View>
        </View>
      </View>
      {/*Filters end*/}


      
      <ScreenBilliardListTournaments 
        tournaments={tournaments}
        set_ScreenBilliardModalTournament_opened={set_ScreenBilliardModalTournament_opened}
        set_selectedTournament={set_selectedTournament}
        offsetTournaments={offsetTournaments}
        totalCount={totalCount}
        __LoadTheTournaments={__LoadTheTournaments}
      />


    </ScreenScrollView>

    {
      selectedTournament!==null
      ?
      <ScreenBilliardModalTournament
        isOpened={ScreenBilliardModalTournament_opened}
        F_isOpened={set_ScreenBilliardModalTournament_opened}
        tournament={selectedTournament as ITournament} />
      :
      null
    }

    {
      /**/
      modalFiltersOpened===true?
      <ScreenBilliardModalFilters 
        isOpened={modalFiltersOpened}
        F_isOpened={set_modalFiltersOpened}
        filtersOut={filtersForSearch}
        set_FiltersOut={(filtersNew:ITournamentFilters)=>{
          set_filtersForSearch(filtersNew);
          set_iHaveFiltersSelected(filtersNew.filtersFromModalAreAplied===true);
          // // // // console.log('filtersNew:', filtersNew);
        }}
      />
      :
      null
    }
    
      {/*<ScreenBilliardModalFilters 
        isOpened={modalFiltersOpened}
        F_isOpened={set_modalFiltersOpened}
        filtersOut={filtersForSearch}
        set_FiltersOut={(filtersNew:ITournamentFilters)=>{
          set_filtersForSearch(filtersNew);
          set_iHaveFiltersSelected(true);
        }}
      />*/}

    
    

  </>
}