import { Image, Text, View } from "react-native";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import UIBadge from "../../components/UI/UIBadge";
import { useContextAuth } from "../../context/ContextAuth";

const default_picture_source = require('./../../assets/images/default-profile-image.jpg');

export default function ProfileHeading({
  
}){

  const {
    user
  } = useContextAuth();

  return <View style={{
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginBottom: BasePaddingsMargins.m30
  }}>
    {
      user?.profile_image_url!==undefined && user?.profile_image_url!==""
      // && 1===2
      ?
      <Image source={{
        uri:user?.profile_image_url,
      }}
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: BasePaddingsMargins.m15
      }}
      />
      :
      <Image source={default_picture_source}
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: BasePaddingsMargins.m15
      }}
      />
    }
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      // flex: 1,
      // justifyContent: 'center'
    }}>
      <Text style={{
        fontSize: TextsSizes.h2,
        color: BaseColors.title,
        marginBottom: BasePaddingsMargins.m5,
        width: '100%'
      }}>{user?.user_name}</Text>
      {/*<Text style={{
        fontSize: TextsSizes.h3,
        color: BaseColors.title
      }}>Tyelerr Hill</Text>*/}
      
      <UIBadge label="PL-000007" marginBottom={BasePaddingsMargins.m5} />

      <Text style={{
        fontSize: TextsSizes.p,
        color: BaseColors.othertexts,
        width: '100%'
      }}>
        Member since {(new Date(user?.created_at as string).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', // e.g., "July"
        day: '2-digit', // e.g., "02"
      }))}
      </Text>
    </View>
  </View>
}