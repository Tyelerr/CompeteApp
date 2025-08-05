import { supabase } from "./supabase";
import { decode } from 'base64-arraybuffer';

export const UploadImage = async (
  // imageName:string,
  fileExtension:string,
  mimeType:string,
  base64:string
)=>{
  // // // // // // // console.log('base64:', base64);
  const imageName:string = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
  const { data, error } = await supabase.storage
    .from('images')
    .upload(imageName, decode(base64), {
      contentType: mimeType,
      // when upsert is true it will overwrite the existing files
      upsert: true
    });

  return { data, error, imageName }
}