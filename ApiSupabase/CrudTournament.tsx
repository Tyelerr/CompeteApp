import { COUNT_TOURNAMENTS_IN_PAGE } from "../hooks/constants";
import { ETournamentTimeDeleted, ICAUserData, ILikedTournament, ITournament, ITournamentFilters } from "../hooks/InterfacesGlobal";
import { supabase } from "./supabase";

const TournamentObjectToDataForSupabase = (tournament:ITournament)=>{
  return {
    tournament_name: tournament.tournament_name,
    /**/
    game_type: tournament.game_type,
    format: tournament.format,
    director_name: tournament.director_name,
    equipment: tournament.equipment,
    custom_equipment: tournament.custom_equipment,

    is_recurring: tournament.is_recurring,
    reports_to_fargo: tournament.reports_to_fargo,
    is_open_tournament: tournament.is_open_tournament,

    description: tournament.description,
    game_spot: tournament.game_spot,
    venue: tournament.venue,
    venue_lat: tournament.venue_lat,
    venue_lng: tournament.venue_lng,
    address: tournament.address,
    phone: tournament.phone,
    thumbnail_type: tournament.thumbnail_type,
    thumbnail_url: tournament.thumbnail_url,
    
    start_date: `${tournament.start_date!==null?tournament.start_date:'2025-01-01'} ${tournament.strart_time!==undefined?tournament.strart_time:'00:00'}:00+00`,
    
    race_details: tournament.race_details,
    table_size: tournament.table_size,
    number_of_tables: tournament.number_of_tables,
    max_fargo: tournament.max_fargo,
    tournament_fee: tournament.tournament_fee,
    // created_at: tournament.game_type,
    // updated_at: tournament.game_type,
    uuid: tournament.uuid,
    side_pots: tournament.side_pots,

    point_location: `POINT(${tournament.venue_lng!==''?tournament.venue_lng:'4'} ${tournament.venue_lat!==''?tournament.venue_lat:'4'})`,

    venue_id: tournament.venue_id
  };
}

export const CreateTournament = async (newTournament: ITournament)=>{
  const dataNewTournament = TournamentObjectToDataForSupabase(newTournament);
  
  // // // // // // console.log('dataNewTournament:', dataNewTournament);

  const { data, error } = await supabase
    .from('tournaments')
    .upsert(dataNewTournament);

  // // // // // // console.log('creating tournament data:', data);
  // // // // // // console.log('creating tournament error:', error);
  return { data, error };
}

export const UpdateTournament = async (tournament:ITournament, newData)=>{
  /*const newDataAll = {
    ...TournamentObjectToDataForSupabase(tournament),
    ...newData
  };*/

  try{
    const {data, error} = await supabase
      .from('tournaments')
      .update(newData)
      .eq('id', tournament.id)
      .select();
    // // // // // console.log('Tournament data after update: ', data);
    // // // // // console.log('Tournament error after update: ', error);
    return {data, error};
  }
  catch(error){
    // // // // // console.log('There is error after updating tournament:', error);
  }
  finally{
    // do something when finally
  }
}


export const FetchTournaments = async ( 
  search:string, 
  game_type:string,
  venue: string,
  filterId?:string,
  status?:string,
  sort?:{
    sortBy:string,
    sortTypeIsAsc:boolean
  },
  lastTimeDeleted?:string,
)=>{
  try{
    /*const { data, error } = await supabase
      .from('tournaments')
      .*/
    // const selectString:string = '*, start_date_date_only:start_date::date'; //this is working but no need for now
    const query = supabase
      .from('tournaments')
      .select(`
        *,
        profiles(*),
        venues(*)
        `);
    if(search!==''){
      query.or(`tournament_name.ilike.%${search}%,game_type.ilike.%${search}%,format.ilike.%${search}%,director_name.ilike.%${search}%,description.ilike.%${search}%,equipment.ilike.%${search}%,game_spot.ilike.%${search}%,venue.ilike.%${search}%,address.ilike.%${search}%,phone.ilike.%${search}%,race_details.ilike.%${search}%`);
    }
    if(venue!==''){
      query.eq('venue', venue);
    }
    if(game_type!==''){
      query.eq('game_type', game_type);
    }
    if(status!==undefined && status!==''){
      query.eq('status', status);
    }
    // // // // console.log('filterId:', filterId);
    if(filterId!==undefined && filterId!=='' && !isNaN(Number(filterId))){
      // query.eq('id_unique_number', Number(filterId));
      // // // // console.log(`Search by filter Id: ${filterId}`);
      query.ilike('id_unique_number_as_text', `%${filterId.toString()}%`);
    }
    // query.order('created_at', {ascending: false});
    if(sort!==undefined && sort.sortBy!=='' && sort.sortBy!==undefined){
      query.order(sort.sortBy, {ascending: sort.sortTypeIsAsc});
    }
    else{
      query.order('created_at', {ascending: false});
    }
    if(lastTimeDeleted!==undefined){
      const TheDateForBefore = new Date();
      if(lastTimeDeleted===ETournamentTimeDeleted.AllTime){}
      else if(lastTimeDeleted===ETournamentTimeDeleted.Last7Days){
        TheDateForBefore.setDate(TheDateForBefore.getDate()-7);
        query.gte('deleted_at', TheDateForBefore.toISOString());
      }
      else if(lastTimeDeleted===ETournamentTimeDeleted.Last30Days){
        TheDateForBefore.setDate(TheDateForBefore.getDate()-30);
        query.gte('deleted_at', TheDateForBefore.toISOString());
      }
    }
    query.limit(20);
    const { data, error } = await query;
    // // // // console.log('error:', error);
    // // // // console.log('data:', data);
    return {
      data, error
    }
  }
  catch($error){}
}



export const FetchTournaments2 = async ( 
  search:string, 
  game_type:string,
  venue: string,
  filterId?:string,
  status?:string,
  sort?:{
    sortBy:string,
    sortTypeIsAsc:boolean
  },
  lastTimeDeleted?:string,
)=>{

  
  let lastTimeDeletedValue: string = '';
  if(lastTimeDeleted!==undefined){
    const TheDateForBefore = new Date();
    if(lastTimeDeleted===ETournamentTimeDeleted.AllTime){}
    else if(lastTimeDeleted===ETournamentTimeDeleted.Last7Days){
      TheDateForBefore.setDate(TheDateForBefore.getDate()-7);
      // query.gte('deleted_at', TheDateForBefore.toISOString());
      lastTimeDeletedValue = TheDateForBefore.toISOString();
    }
    else if(lastTimeDeleted===ETournamentTimeDeleted.Last30Days){
      TheDateForBefore.setDate(TheDateForBefore.getDate()-30);
      // query.gte('deleted_at', TheDateForBefore.toISOString());
      lastTimeDeletedValue = TheDateForBefore.toISOString();
    }
  }

  
  /*
  Here need to be done the sorting */
  let order_by_column = 'id_unique_number', order_type = 'DESC';
  // // // // console.log('sort details:', sort);
  if(sort!==undefined && sort.sortBy!=='' && sort.sortBy!==undefined){
    // query.order(sort.sortBy, {ascending: sort.sortTypeIsAsc});
    order_by_column = sort.sortBy;
    order_type = ( sort.sortTypeIsAsc===true? 'ASC' : 'DESC' );
  }
  else{
    // query.order('created_at', {ascending: false});
  }

  const argumentsFor = {
    filter_search:search!==undefined && search!==''?search:null,
    filter_game_type:game_type!==undefined && game_type!==""?game_type:null,
    filter_venue:venue!==undefined && venue!==''?venue:null,
    filter_id:filterId!==undefined && !isNaN(Number(filterId))?filterId.toString():null,
    filter_status:status!==undefined && status!==''?status:null,
    filter_last_time_deleted:lastTimeDeletedValue!==undefined && lastTimeDeletedValue!==''?lastTimeDeletedValue:null,
    offsetrows: 0,
    totalcount: 20,
    order_by_column: order_by_column, //still need working here
    order_type: order_type
  }

  // // // // console.log('argumentsFor:', argumentsFor);

  try {
    const {
      data: dataIds, error: errorIds
    } = await supabase
      .rpc('get_tournaments_for_administrator_v4', argumentsFor);

    // // // // console.log('errorIds after loading the tournaments:', errorIds);
    // // // // console.log('dataIds after loading the tournaments:', dataIds);
    // // // // // // // // console.log('data tournament venues: ', data);
    // // // // // // // // console.log('data tournament venues error: ', error);

    const TournamentsIDs:string[] = [];
    if(dataIds!==null)
      for(let i=0;i<dataIds.length;i++){
        TournamentsIDs.push(dataIds[i].id);
      }

    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        profiles(*),
        venues(*)
        `)
      .in('id', TournamentsIDs)
      // here order should be set too
      .order(order_by_column, {ascending: order_type==='ASC'})
      ;

    return { data, error };
  }
  catch(error){
    return {data:null, error}
  }
}




export const FetchTournamentsVenues = async ()=>{
  try {
    const {
      data, error
    } = await supabase
      .rpc('get_tournament_venues');

    // // // // // // // // console.log('data tournament venues: ', data);
    // // // // // // // // console.log('data tournament venues error: ', error);

    return { data, error };
  }
  catch(error){}
}


export const FetchTournamentsAnalytics = async ( user:ICAUserData, venueid?:number )=>{
  try{
    const {
      data, error
    } = await supabase
      // .rpc('get_analytics_counts', { userid: user.id });
      .rpc( 'get_analytics_counts_v4', { userid: user.id, venueid: venueid!==undefined?venueid:null } )
      ;

    return { data, error };
  } 
  catch(error){
    return { data:null, error }
  }
}

export const FetchTournamentsEventsAnalytics = async ( user:ICAUserData )=>{
  try{
    const {
      data, error
    } = await supabase
      .rpc('get_the_tournaments_grouped_by_tournament_type', { userid: user.id });

    return { eventsData:data, eventsError:error };
  } 
  catch(error){
    return { eventsData:null, eventsError:error }
  }
}


/**
 * this function will be for using the filters
 * 
 * -- for the distance search: 
  target_latitude FLOAT DEFAULT NULL,
  target_longitude FLOAT DEFAULT NULL,
  radius_meters FLOAT DEFAULT NULL,

  -- gloabal search
  search TEXT DEFAULT NULL,   

  -- game type
  filter_game_type TEXT DEFAULT NULL,

  -- equipment
  filter_equipment TEXT DEFAULT NULL,
  filter_equipment_custom TEXT DEFAULT NULL,

  -- days of the week
  filter_daysofweek INTEGER[] DEFAULT NULL,

  -- filters entry fee 
  filter_entry_fee_from INTEGER DEFAULT NULL,
  filter_entry_fee_to INTEGER DEFAULT NULL,

  -- frago rating from to
  filter_fargo_rating_from FLOAT DEFAULT NULL,
  filter_fargo_rating_to FLOAT DEFAULT NULL,

  filter_minimun_required_fargo_games_10plus BOOLEAN DEFAULT NULL,
  filter_handicapped BOOLEAN DEFAULT NULL,
  filter_reports_to_fargo BOOLEAN DEFAULT NULL,
  filter_is_open_tournament BOOLEAN DEFAULT NULL
 * 
 */
export const FetchTournaments_Filters = async ( 
  filters: ITournamentFilters,
  offset?: number
)=>{
  try{

    const filters_params = {
      target_latitude: !isNaN(Number(filters.lat))?Number(filters.lat):null,
      target_longitude: !isNaN(Number(filters.lng))?Number(filters.lng):null,
      // we send values that are miles, but the postgress sql calculate in metters, we need to mulitplied by 1.60934
      //also the radius should be in metters :)
      radius_meters: !isNaN(filters.radius as number) && filters.radius as number>0?1000*(filters.radius as number)*1.60934  : null,
      
      
      search: filters.search!==''?filters.search:null,
      filter_game_type: filters.game_type!==undefined && filters.game_type!==''?filters.game_type:null,
      filter_equipment: filters.equipment!==undefined && filters.equipment!==''?filters.equipment:null,
      filter_equipment_custom: filters.equipment_custom!==undefined && filters.equipment_custom!=='' && filters.equipment==='custom'?filters.equipment_custom:null,

      filter_daysofweek: filters.daysOfWeek!==undefined?filters.daysOfWeek:null,

      filter_entry_fee_from: filters.entryFeeFrom!==undefined?filters.entryFeeFrom:null,
      filter_entry_fee_to: filters.entryFeeTo!==undefined?filters.entryFeeTo:null,

      filter_fargo_rating_from: filters.fargoRatingFrom!==undefined?filters.fargoRatingFrom:null,
      filter_fargo_rating_to: filters.fargoRatingTo!==undefined?filters.fargoRatingTo:null ,

      // if the values are true then we send true if not we send null, very very smart :)
      filter_minimun_required_fargo_games_10plus: filters.minimun_required_fargo_games_10plus===true?true : null,
      filter_handicapped: filters.handicapped===true?true : null,
      filter_reports_to_fargo: filters.reports_to_fargo===true?true : null,
      filter_is_open_tournament: filters.is_open_tournament===true?true : null,
      
      filter_table_size: filters.table_size!==undefined && filters.table_size!==''?filters.table_size:null,
      filter_format: filters.format!==undefined && filters.format!==''?filters.format:null

      // offset must be the part of the supabase function, in another case will not working
      // offsetRows: offset===undefined?0:offset

    };

    // // // // console.log('filters_params:', filters_params);

    // // // // // // console.log('filters_params:', filters_params);

    // it select 20 tournaments max
    const FiltersForTheRowsData = {
      ...filters_params,
      ...{
        offsetrows: offset===undefined?0:offset,
        totalcount: COUNT_TOURNAMENTS_IN_PAGE
      }
    };
    // // // console.log('FiltersForTheRowsData:', FiltersForTheRowsData);
    const { data: dataFilter, error: errorFilter } = await supabase.rpc('get_tournametns_by_filters3', FiltersForTheRowsData);

    // // // // console.log('dataFilter:', dataFilter);
    // // // // console.log('errorFilter:', errorFilter);

    const { data: dataTotalCOunt, error: errorTotalCount } = await supabase.rpc('get_tournametns_by_filters_total_count_v2', filters_params);
    // const likedtournaments:ILikedTournament[] = data as ILikedTournament[];
    // // // // // // // console.log('likedtournaments before:', likedtournaments);
    // // // // // // // console.log('filtered tournaments error: ', error);
    // // // // // // // console.log('filtered tournaments data: ', data);

    // // // // // // console.log('dataFilter:', dataFilter);
    // // // // // // console.log('errorFilter:', errorFilter);

    const TournamentsIDs:string[] = [];
    if(dataFilter!==null)
      for(let i=0;i<dataFilter.length;i++){
        TournamentsIDs.push(dataFilter[i].id);
      }

    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        profiles(*),
        venues(*)
        `)
      .in('id', TournamentsIDs)
      .order('start_date', {ascending: true});

      // // // // // // console.log('final errors after fetching filtered tournament:', error);

    return {
      // likedtournaments, 
      error, data, dataTotalCOunt
    }
  }
  catch(error){
    return { likedtournaments:null, error, dataTotalCOunt:null }
  }
}

export const FetchTournaments_LikedByUser = async (user:ICAUserData)=>{
  try{
    const {
      data, error
    } = await supabase
      .rpc('get_likes_for_tournament', { userid: user.id });

    const likedtournaments:ILikedTournament[] = data as ILikedTournament[];
    // // // // // console.log('likedtournaments:', likedtournaments);
    
    
    
    const count_details = await supabase
      .rpc('get_likes_for_tournament_count', { userid: user.id });
    
    // // // // // // console.log('count_details:', count_details);


    return { data, error, likedtournaments, countLikes: count_details.data as number };
  }
  catch(error){
    return { data: null, error, likedtournaments:null, countLikes:0 };
  }
}
/*export const FetchTournaments_LikedByUser_COUNT = async (user:ICAUserData)=>{
  try{
    const {
      data, error
    } = await supabase
      .rpc('get_likes_for_tournament_count', { userid: user.id });

    // const likedtournaments:ILikedTournament[] = data as ILikedTournament[];
    return { data, error };
  }
  catch(error){
    return { data: null, error, likedtournaments:null };
  }
}*/


export const AddTournamentLike = async (user:ICAUserData, tournament: ITournament, isLiked:boolean)=>{

  // // // // // console.log(user);
  // // // // // console.log(tournament);
  // // // // // console.log(isLiked);

  try{
    if(isLiked){
      const { data, error } = await supabase
        .from('likes')
        .upsert({
          turnament_id: tournament.id,
          user_id: user.id,
          is_liked: true,
        });
    }
    else{
      const { data, error } = await supabase
        .from('likes')
        .delete()
        .eq('turnament_id', tournament.id)
        .eq('user_id', user.id);
      return { data, error };
    }
  } 
  catch(error){
    return {data, error}
  }
}

export const SeeIfTheTournamentHaveLike = async (user:ICAUserData, tournament: ITournament)=>{
  try{
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('turnament_id', tournament.id)
      .eq('user_id', user.id);
    return { data, error };
  } 
  catch(error){
    return { data: null, error }
  }
};

export const GetPhoneNumbersFromTournamentsByVenue = async(venue:string)=>{
  try{
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .like('venue', `%${venue}%`)
      .neq('phone', '')
      .limit(1)
      ;
    return { data, error };
  } 
  catch(error){
    return { data: null, error }
  }
}


export const FetchTheTournamentsForLoggedUser = async ( user: ICAUserData )=>{
  try{
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      // .like('venue', `%${venue}%`)
      .eq('uuid', user.id)
      .limit(20)
      .order('created_at', {ascending: false})
      ;
    return { data, error };
  } 
  catch(error){
    return { data: null, error }
  }
}