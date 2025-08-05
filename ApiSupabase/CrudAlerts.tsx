import { IAlert } from "../hooks/InterfacesGlobal";
import { supabase } from "./supabase";

const AlertIAlertToObjectForData = (alert:IAlert)=>{
  return {
    // updated_at:string,
    creator_id:alert.creator_id,
    name: alert.name,
    preffered_game: alert.preffered_game,
    fargo_range_from: alert.fargo_range_from,
    fargo_range_to: alert.fargo_range_to,
    max_entry_fee: alert.max_entry_fee,
    location: alert.location,
    reports_to_fargo: alert.reports_to_fargo,
    checked_open_tournament: alert.checked_open_tournament,
  };
}

export const CreateAlert = async (newAlert:IAlert)=>{
  try{
    const {data, error} = await supabase
      .from('alerts')
      .upsert(AlertIAlertToObjectForData(newAlert));
  
    return {error, data}
  } 
  catch(error){
    return {data: null, error};
  }
}

export const UpdateAlert = async (alertId:string, newDetailsAlert:IAlert)=>{
  try{
    const { data, error } = await supabase
      .from('alerts')
      .update(AlertIAlertToObjectForData(newDetailsAlert))
      .eq('id', alertId)
      .select();
  }
  catch(error){
  }
}

export const DeleteAlert = async (alertId:string)=>{
  try{
    const { data, error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId)
  }
  catch(error){}
}

export const GetAlerts = async (user_id:string):Promise<IAlert[]>=>{
  try{
    const {data, error} = await supabase
      .from('alerts')
      .select("*")
      .eq('creator_id', user_id)
      .order('updated_at', {ascending: false})
      .limit(10);
    const alerts:IAlert[] = [];
    if(data!==null)
      for(let i=0;i<data.length;i++){
        alerts.push( data[i] as IAlert );
      }
    return alerts;
  } 
  catch(error){
    return [];
  }
}
export const GetAlertById = async (alertId:string):Promise<IAlert | null>=>{
  try{
    const {data, error} = await supabase
      .from('alerts')
      .select("*")
      .eq('id', alertId);
      // .order('updated_at', {ascending: false})
      //.limit(10);
      // // // // // // console.log('error:', error);
      // // // // // // console.log('data:', data);
    const alert:IAlert = data[0] as IAlert;
    // // // // // // console.log('alert:', alert);
    /*if(data!==null)
      for(let i=0;i<data.length;i++){
        alerts.push( data[i] as IAlert );
      }
    return alerts;*/
    return alert;
  } 
  catch(error){
    return null;
  }
}
