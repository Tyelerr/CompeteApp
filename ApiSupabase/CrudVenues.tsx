import { EPermissionType, IPermissions, IVenue } from "../hooks/InterfacesGlobal";
import { supabase } from "./supabase";

export const AddNewVenue = async (newVenue: IVenue)=>{
  const newVenueDetails = {
    venue: newVenue.venue,
    address: newVenue.address,
    venue_lat: newVenue.venue_lat,
    venue_lng: newVenue.venue_lng,
    point_location: `POINT(${newVenue.venue_lng!==''?newVenue.venue_lng:'4'} ${newVenue.venue_lat!==''?newVenue.venue_lat:'4'})`,
    profile_id: newVenue.profile_id,
    phone: newVenue.phone
  };

  const {
    data, error
  } = await supabase
    .from('venues')
    .upsert(newVenueDetails);


  

  return {data, error}

}


export const FetchVenues = async (userId: number)=>{
  try{
    const {data, error} = await supabase
      .from('venues')
      .select("*")
      .eq('profile_id', userId)
      // .select()
      ;
    return {data, error};
  } 
  catch(error){
    return {error, data: null}
  }
}

export const FetchVenuesFromBarOwnersThatICanUse = async (
  MyId: number
)=>{
  try{


    const {
        data: dataPermissions, error: errorPermissions
      } = await supabase
        .from('permissions')
        .select('*')
        .eq('id_user_need_permission', MyId)
        .eq('permission_type', EPermissionType.AccessToBarVenues)
        ;

    let profilesIdsThatGivedMePermission:number[] = [];
    const dataPermissions_:IPermissions[] = dataPermissions as IPermissions[];
    for(let i=0;i<dataPermissions_.length;i++){
      profilesIdsThatGivedMePermission.push(
        dataPermissions_[i].id_user_give_permission
      );
    }


    const {data, error} = await supabase
      .from('venues')
      .select("*")
      // .eq('profile_id', userId)
      .in('profile_id', profilesIdsThatGivedMePermission)
      // .select()
      
      ;
    return {data, error};
  } 
  catch(error){
    return {error, data: null}
  }
}