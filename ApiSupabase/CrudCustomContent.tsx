import { ECustomContentType, ICustomContent } from "../hooks/InterfacesGlobal";
import { supabase } from "./supabase";


const dataCustomContentForDatabase = (content: ICustomContent)=>{
  return {
    name: content.name,
    label_about_the_person: content.label_about_the_person,
    address: content.address,
    description: content.description,
    list: content.list,
    labels: content.labels,
    phone_number: content.phone_number,
    type: content.type
  };
}
export const InsertContent = async (content: ICustomContent)=>{
  try{
    const { data, error } = await supabase
      .from('custom_content')
      .insert( dataCustomContentForDatabase(content) );
      // .select();
      return { data, error };
  }
  catch(error){
    return { data:null, error };
  }
}

export const GetTheLatestContent = async (type:ECustomContentType)=>{
  try{
    const { data, error } = await supabase
      .from('custom_content')
      .select("*")
      .eq('type', type)
      .order('id', {ascending: false})
      .limit(1)
      ;
      return { data, error };
  }
  catch(error){
    return { data:null, error };
  }
}