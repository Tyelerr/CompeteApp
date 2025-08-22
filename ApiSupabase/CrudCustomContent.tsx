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
    type: content.type,

    reward_picture: content.reward_picture!==null && content.reward_picture!=='' && content.reward_picture!==undefined?content.reward_picture:'',
    reward_link: content.reward_link!==null && content.reward_link!=='' && content.reward_link!==undefined?content.reward_link:'',
    features: content.features!==null && content.features!=='' && content.features!==undefined?content.features:'',
    giveawy_rules: content.giveawy_rules!==null && content.giveawy_rules!=='' && content.giveawy_rules!==undefined?content.giveawy_rules:'',
    subtitle: content.subtitle!==null && content.subtitle!==''?content.subtitle:'',
    date_ends: content.date_ends!==null && content.date_ends!=='' && content.date_ends!==undefined?content.date_ends:'',
    value: !isNaN(Number(content.value))?Number(content.value) : 0,

    entries: !isNaN(content.entries)?content.entries:0

  };
}
export const InsertContent = async (content: ICustomContent)=>{


  const dataFor = dataCustomContentForDatabase(content);
  // // // console.log('dataFor:', dataFor);

  try{
    const { data, error } = await supabase
      .from('custom_content')
      .insert( dataFor );
      // .select();
      return { data, error };
  }
  catch(error){
    return { data:null, error };
  }
}
export const UpdateContent = async (content: ICustomContent, content_id: number)=>{

  const contentForUpdating = dataCustomContentForDatabase(content);
  // // console.log('contentForUpdating:', contentForUpdating);

  try{
    /*const { data, error } = await supabase
      .from('custom_content')
      .insert( dataCustomContentForDatabase(content) );
      // .select();*/

    const {data, error} = await supabase
      .from('custom_content')
      .update( contentForUpdating )
      .eq('id', content_id)
      .select();

      // // console.log('content_id:', content_id);
    // // console.log(data, error);

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

export const GetContentItems = async (type: ECustomContentType)=>{
  const { data, error } = await supabase
      .from('custom_content')
      .select("*")
      .eq('type', type)
      .order('id', {ascending: false})
      .limit(10)
      ;
      return { data, error };
}


export const GetTheGifts = async (user_id: number)=>{
  /*const { data, error } = await supabase
      .from('custom_content')
      .select("*")
      .eq('type', ECustomContentType.ContentReward)
      .order('id', {ascending: false})
      .limit(10)
      ;*/
  const {
      data, error
    } = await supabase
      .rpc('fetchthegiftsv4', {
        mine_id: user_id
      });
  
      // // console.log('getting the gifts');
      // // console.log( data, error );

  return { data, error };
}


export const DeleteContent = async (contentId: number)=>{

  // // // console.log('Deleting custom content with ID: ', contentId);

  const {
    error, data
  } = await supabase
    .from('custom_content')
    .delete()
    .eq('id', contentId);
  return {
    isDeleted: true,
    error,
    data
  };
}