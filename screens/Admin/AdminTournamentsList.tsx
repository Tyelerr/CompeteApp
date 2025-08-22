import { View } from "react-native";
import TournamentThumbnailAdmin from "./TournamentThumbnailAdmin";
import { ITournament } from "../../hooks/InterfacesGlobal";
import { useEffect, useRef, useState } from "react";
import { FetchTournaments2 } from "../../ApiSupabase/CrudTournament";
import { IAdminTournamentsFilters } from "./AdminTournamentsFIlters";
import { TIMEOUT_DELAY_WHEN_SEARCH } from "../../hooks/constants";

export default function AdminTournamentsList(
  {
    // tournamets,
    // _LoadTournaments,
    filters
  }
  :
  {
    // tournamets: ITournament[],
    // _LoadTournaments: ()=>void,
    filters: IAdminTournamentsFilters | null
  }
){

  
  const [tournamets, set_tournamets] = useState<ITournament[]>([]);

  const _LoadTournaments = async ()=>{

    if(filters===null)return;

    // // // // // // console.log('_LoadTournaments:', _LoadTournaments);

    const {
      searchingTerm,
      filterType,
      filterVenue,
      filterId,
      filter_status,
      sortBy,
      sortTypeIsAsc
    } = filters;

    const {
      data,
      error
    } = await FetchTournaments2( 
      searchingTerm, 
      filterType, 
      filterVenue,
      filterId,
      // ETournamentStatuses.Pending, // this is for the status, here should be pending
      filter_status,
      {
        sortBy: sortBy,
        sortTypeIsAsc: sortTypeIsAsc
      } 
    );


    // // // // // // // // // console.log('error:', error);
    // // // // // // // // // console.log('data:', data);

    const _tournamets_: ITournament[] = [];
    if(data){
      for(let i=0;i<data.length;i++){
        _tournamets_.push(data[i] as ITournament);
      }
    }
    set_tournamets(_tournamets_);

    // // // // // // // // // // console.log('data:', data);



  }


  const debounceTimeout = useRef(null);

  
  useEffect(()=>{
    // // // // // console.log('New Filters: ', filters);
      if(debounceTimeout.current){
        clearTimeout( debounceTimeout.current );
      }

    
      debounceTimeout.current = setTimeout(()=>{
        _LoadTournaments();
      }, TIMEOUT_DELAY_WHEN_SEARCH);

      return ()=>{
        clearTimeout( debounceTimeout.current )
      }
    }, 
    //[searchingTerm, filterType, filterVenue, filterId, sortBy, sortTypeIsAsc]
    [filters]
  );
  

  if(filters===null)return null;

  return <View>
    {
      tournamets.map((tournament: ITournament, key:number)=>{
        
        return <TournamentThumbnailAdmin 
          key={`tournament-thumb-${key}-${(new Date()).valueOf()}`} 
          tournament={tournament}
          reloadTheTournaments={_LoadTournaments}
          />

      })
    }  
  </View>
}