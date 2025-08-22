import { Alert, Image, Platform, Text, TouchableOpacity, View } from "react-native"
import { StyleThumbnailSelector } from "../../../assets/css/styles"
import { Ionicons } from "@expo/vector-icons";
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { UploadImage } from "../../../ApiSupabase/UploadFiles";
import { supabase } from "../../../ApiSupabase/supabase";
import { useState } from "react";
import { THUMBNAIL_CUSTOM } from "../../../hooks/constants";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../../hooks/Template";

export default function AttachImage(
  {
    set_thumbnail_url,
    set_thumbnailType,
    defaultUrl,
    onStartAttaching,
    onEndAttaching
  }
  :
  {
    set_thumbnail_url:(s:string)=>void,
    set_thumbnailType:(s:string)=>void,
    defaultUrl?: string,
    onStartAttaching?: ()=>void,
    onEndAttaching?: ()=>void
  }
){
  
  const [customImageURI, set_customImageURI] = useState<string>('');
  const [loading, set_loading] = useState<boolean>(false);
  
  const AttachTheImage = async ()=>{

    if(onStartAttaching!==undefined){

      onStartAttaching()

    }
    set_loading(true)

    // Alert.alert('12');
    // // // // // // // // // // console.log('Started attaching image');
    if(Platform.OS !== 'web'){
    
      const { granted } = await requestMediaLibraryPermissionsAsync();
      // // // // // // // // // // console.log('granted:', granted);
      if(granted!==true){
        Alert.alert('Permission denied', 'Sorry, we need camera permissions to make this work!');
      }
    }
    // // // // // // // // // // console.log('Ended attaching image');

    // // // // // // // // // // console.log("Calling ImagePicker.launchImageLibraryAsync...");
    let result = await launchImageLibraryAsync({
      // mediaTypes: MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });
    // // // // // // // // // // // console.log("Calling ImagePicker.launchImageLibraryAsync... end");
    // // // // // // // // // // // console.log('result:', result);
    if(result.assets!==null){
      set_customImageURI(result.assets[0].uri);
    }

    if(result.assets!==null && result.assets[0].base64!==null){
      const resultAfterUploading = await UploadImage( 
        result.assets[0].uri.split('.').pop() || 'jpeg',
        result.assets[0].mimeType as string,
        result.assets[0].base64 as string
      );
      // // // // // // // // // // console.log('resultAfterUploading 2:', resultAfterUploading);
      // // // // // // // // // // // console.log('result.assets[0]:', result.assets[0]);
      const { data } = await supabase.storage
        .from('images')
        .getPublicUrl( `${resultAfterUploading.data?.path as string}`);

      // finally we are adding the url for the thumbnail:
      set_customImageURI( data.publicUrl );
      set_thumbnail_url( data.publicUrl );
      // set_selectedThumb( null )
      set_thumbnailType( THUMBNAIL_CUSTOM ); 
      // // // // // // // // // // console.log('data.publicUrl:', data.publicUrl);
    }

    if(onEndAttaching!==undefined){
     onEndAttaching() 
    }
    set_loading(false)

  }
  
  return <>
  
    <TouchableOpacity style={[
      StyleThumbnailSelector.thumb,
      StyleThumbnailSelector.thumb_file,
      {
        alignItems: 'center',
        justifyContent: 'center'
      },
      (
        loading===true?
        {
          pointerEvents: 'none',
          opacity: .5
        }
        :
        {}
      )
    ]} onPress={()=>{
      AttachTheImage()
    }}>
      <View style={[
        {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }
      ]}>
        <Ionicons name="add" size={TextsSizes.p} color={BaseColors.light} />
        <Text style={[
          {
            fontSize: TextsSizes.p,
            color: BaseColors.light,
            marginTop: BasePaddingsMargins.m5
          }
        ]}>Upload custom</Text>
      </View>
      {
        customImageURI!=='' 
        ?
        <Image style={[
          StyleThumbnailSelector.image
        ]} source={{uri:customImageURI}} />
        :
        null
      }
      {
        customImageURI==='' && defaultUrl!==undefined && defaultUrl!== ''?
        <Image style={[
          StyleThumbnailSelector.image
        ]} source={{uri:defaultUrl}} />
        :
        null
      }
    </TouchableOpacity>
    

  </>
}