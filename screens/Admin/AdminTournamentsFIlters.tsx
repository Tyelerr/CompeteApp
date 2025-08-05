import { View } from "react-native";
import LFInput from "../../components/LoginForms/LFInput";
import { BasePaddingsMargins } from "../../hooks/Template";
import { useEffect, useState } from "react";
import { ETournamentStatuses, GameTypes, ITournament, TournamentStatusesForDropdown } from "../../hooks/InterfacesGlobal";
import { FetchTournamentsVenues } from "../../ApiSupabase/CrudTournament";
import LFButton from "../../components/LoginForms/Button/LFButton";


export interface IAdminTournamentsFilters{
  searchingTerm: string,
  filterType: string,
  filterVenue: string,
  filterId: string,
  filterStatus: string,
  itemsForVenues: {label:string, value:string}[],
  sortBy: string,
  sortTypeIsAsc: boolean,
  filter_status: ETournamentStatuses
}

export default function AdminTournamentsFIlters(
  {
    set_filters,
    tournament_status_static_value
  }
  :
  {
    set_filters: (filters: IAdminTournamentsFilters)=>void,
    tournament_status_static_value: ETournamentStatuses
  }
){

  
  
  // const [tournamets, set_tournamets] = useState<ITournament[]>([]);
  const [searchingTerm, set_searchingTerm]  = useState<string>('');
  const [filterType, set_filterType] = useState<string>('');
  const [filterVenue, set_filterVenue] = useState<string>('');
  const [filterId, set_filterId] = useState<string>('');
  // i think this filter don't need, the reason is this page is only for pending tournaments
  const [filterStatus, set_filterStatus] = useState<string>('');

  const [itemsForVenues, set_itemsForVenues] = useState<{label:string, value:string}[]>([]);

  // const [sortBy, set_sortBy] = useState<string>('start_date');
  const [sortBy, set_sortBy] = useState<string>('id_unique_number');
  const [sortTypeIsAsc, set_sortTypeIsAsc] = useState<boolean>(false);

  
  const _LoadTournamentsVenues = async ()=>{
    
    const {
      data, error
    } = await FetchTournamentsVenues();


    const dataFor: {label:string, value:string}[] = [
      /*{
        label: 'All Venues',
        value: ""
      }*/
    ];
    for(let i=0;i<data.length;i++){
      dataFor.push({
        label: data[i].venue_name,
        value: data[i].venue_name
      });
    }

    // // // // // console.log( 'dataFor: ', dataFor );

    set_itemsForVenues( dataFor )

  }

  const ___SetTheFilters = ()=>{
    set_filters( {
      searchingTerm: searchingTerm,
      filterType: filterType,
      filterVenue: filterVenue,
      filterId: filterId,
      filterStatus: filterStatus,
      // itemsForVenues: itemsForVenues,
      sortBy: sortBy,
      sortTypeIsAsc: sortTypeIsAsc,
      filter_status: tournament_status_static_value
    } as IAdminTournamentsFilters );
  }
  
  useEffect(()=>{
    ___SetTheFilters();
  }, [
    searchingTerm, filterType, filterVenue, filterId, filterStatus,
    itemsForVenues, sortBy, sortTypeIsAsc
  ]);

  useEffect(()=>{
    _LoadTournamentsVenues();
    ___SetTheFilters();
  }, []);

  return <View>
    {
      
    }
    <LFInput 
      keyboardType="default"
      placeholder="Search tournaments..."
      iconFront="search"
      marginBottomInit={BasePaddingsMargins.formInputMarginLess}
      defaultValue={
        ""
      }
      onChangeText={(text:string)=>{
        // set_tournamentName(text);
        // setErrorForm('')
        // set_searchUsersTerm(text)
        set_searchingTerm( text );
      }}
      validations={[
        // EInputValidation.Required,
      ]}
      />

    <View style={[
      {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
          marginBottom: BasePaddingsMargins.formInputMarginLess
      }
    ]}>
      <View style={[
        {
          width: '48%'
        }
      ]}>
        <LFInput 
          typeInput="dropdown"
          placeholder="All Types"
          label="Filter By Type"
          marginBottomInit={0}
          defaultValue={
            ""
          }
          onChangeText={(text:string)=>{
            // set_tournamentName(text);
            // setErrorForm('')
            // set_searchUserRole(text)
            set_filterType(text);
          }}
          validations={[
            // EInputValidation.Required,
          ]}
          // items={[{label:'All Types', value:''}, ...GameTypes]}
          items={GameTypes}
          />
      </View>
      <View style={[
        {
          width: '48%'
        }
      ]}>
        <LFInput 
          label="Filter by ID"
          placeholder="ID Number"
          keyboardType="number-pad"
          marginBottomInit={0}
          onChangeText={(text)=>{
            // set_searchIdNumber(text)
            set_filterId(text)
          }}
          />
      </View>
      
    </View>
    {/*<View style={[
      {
        width: '100%'
      }
    ]}>
      <LFInput 
        typeInput="dropdown"
        placeholder="All Venues"
        label="Venues"
        iconFront="pin"
        marginBottomInit={BasePaddingsMargins.formInputMarginLess}
        defaultValue={
          ""
        }
        onChangeText={(text:string)=>{
          // set_tournamentName(text);
          // setErrorForm('')
          // set_searchUserRole(text)
          // set_filterType(text);
          set_filterVenue(text)
        }}
        validations={[
          // EInputValidation.Required,
        ]}
        items={itemsForVenues}
        />
    </View>*/}
    {/*<View style={[
      {
        width: '70%'
      }
    ]}>
      <LFInput 
        typeInput="dropdown"
        placeholder="Any Status"
        label="Status"
        iconFront="filter"
        marginBottomInit={BasePaddingsMargins.formInputMarginLess}
        defaultValue={
          ""
        }
        onChangeText={(text:string)=>{
          set_filterStatus(text)
        }}
        validations={[
          // EInputValidation.Required,
        ]}
        items={[
          // {label:'Any Status', value: ''}, 
          ...TournamentStatusesForDropdown
        ]}
        />
    </View>*/}

    {/*<View style={{
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
    }}>
      <View style={{
        width: '50%',
        marginRight: BasePaddingsMargins.m10
      }}>
        <LFInput 
          typeInput="dropdown"
          placeholder="Default"
          label="Order By"
          marginBottomInit={1}
          defaultValue={
            ""
          }
          onChangeText={(text:string)=>{
            set_sortBy(text)
          }}
          validations={[
            // EInputValidation.Required,
          ]}
          items={[
            {label:'Date', value:'start_date'},
            {label:'Title', value:'tournament_name'},
            {label:'Venue', value:'venue'},
            {label:'Entry Fee', value:'tournament_fee'},
            {label:'Players', value:'number_of_tables'},
          ]}
          />
      </View>
      <View style={{
        width: 50
      }}>
        <LFButton label="" icon={sortTypeIsAsc===true?'arrow-down':'arrow-up'} type="outline-dark"  marginbottom={0} onPress={()=>{
          set_sortTypeIsAsc( !sortTypeIsAsc );
        }} />
      </View>
    </View>*/}

  </View>
}