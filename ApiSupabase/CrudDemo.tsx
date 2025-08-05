import { supabase } from "./supabase";

// crud demo
export const demoCreate = async ()=>{
  try{
    const { data, error } = await supabase
      .from('demo')
      .insert({text:'Demo Text'});
      // .select();
  }
  catch(error){
    return { data:null, error };
  }
}