import { supabase } from "./supabase"

export const enterInGift = async(
  content_gift_id: number,
  user_id: number,
  ip_address: string,
  type_of_activity: string
)=>{
  const { data, error } = await supabase
    .from('enter_activities')
    .upsert({
      object_id: content_gift_id,
      user_id: user_id,
      ip_address: ip_address,
      type_of_activity: type_of_activity
    });

  return {data, error}

}