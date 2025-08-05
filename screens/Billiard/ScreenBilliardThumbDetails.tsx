import { Image, Text, TouchableOpacity, View } from "react-native";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import { getThurnamentStaticThumb, THUMBNAIL_CUSTOM, tournament_thumb_8_ball } from "../../hooks/constants";
import { ICAUserData, ITournament } from "../../hooks/InterfacesGlobal";
import { StyleZ } from "../../assets/css/styles";
import UIBadge from "../../components/UI/UIBadge";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from "react";
import { useContextAuth } from "../../context/ContextAuth";
import { AddTournamentLike, SeeIfTheTournamentHaveLike } from "../../ApiSupabase/CrudTournament";

export default function ScreenBilliardThumbDetails(
  {
    tournament,
    selectTournament
  }
  :
  {
    tournament:ITournament,
    selectTournament?:(t:ITournament)=>void
  }
){

  const {
    user
  } = useContextAuth();

  const [isLiked, set_isLiked] = useState<boolean>(false);

  const __CheckIfIsLiked = async ()=>{
    const {
      data, error
    } = await SeeIfTheTournamentHaveLike(
      user as ICAUserData,
      tournament
    );
    // // // // console.log('data:', data);
    if(data!==null && data.length===1){
      set_isLiked( true );
    }
  }

  useEffect(()=>{
    if(user!==null){
      __CheckIfIsLiked(  );
    }
  }, []);

  return <View style={[
              {
                width: '48%',
                marginBottom: BasePaddingsMargins.m15,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: BaseColors.othertexts,
                backgroundColor: BaseColors.secondary,
                borderRadius: BasePaddingsMargins.m10,
                display: "flex",
                position: 'relative'
              }
            ]}>
              
              <TouchableOpacity onPress={()=>{
                if(selectTournament!==undefined)
                  selectTournament(tournament)  
              }}>
                <Image  source={
                  (
                    tournament.thumbnail_type === THUMBNAIL_CUSTOM?
                    tournament.thumbnail_url
                    :
                    getThurnamentStaticThumb(tournament.thumbnail_type)
                  )
                  
                } style={[
                {
                  width: '100%',
                  height: 120,
                  borderTopLeftRadius: BasePaddingsMargins.m10,
                  borderTopRightRadius: BasePaddingsMargins.m10
                }
              ]} />
              <View style={[
                {
                  padding: BasePaddingsMargins.m10
                }
              ]}>
                <View style={[
                  {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    marginBottom: BasePaddingsMargins.m10
                  }
                ]}>
                  <Text style={[
                    StyleZ.p,
                    {
                      color: BaseColors.light,
                      fontWeight: 'bold'
                    }
                  ]}>{tournament.tournament_name}</Text>
                  <View><UIBadge label={tournament.game_type} type="default" /></View>
                </View>
                <Text style={[
                  StyleZ.p,
                  {
                    marginBottom: BasePaddingsMargins.m10,
                  }
                ]}>
                  {
                    format(parseISO(tournament.start_date), 'EEEE MMM dd, yyyy h:mm aa')
                  }
                </Text>

                <View>
                  <View style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start'
                    }
                  ]}>
                    <Ionicons name="location" style={[
                      StyleZ.p,
                      {
                        marginRight: BasePaddingsMargins.m10
                      }
                    ]} />
                    <Text style={[
                      StyleZ.p,
                      {
                        width: '90%'
                      }
                    ]}>{tournament.venue}</Text>
                  </View>
                  <Text style={[
                    StyleZ.p
                  ]}>
                    {tournament.address}
                  </Text>
                </View>
                <View style={[
                  StyleZ.hr,
                  {
                    marginBlock: BasePaddingsMargins.m15,
                    marginBottom: BasePaddingsMargins.m15,
                    backgroundColor: BaseColors.othertexts,
                  }
                ]} />

                <View style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: "space-between"
                  }
                ]}>
                  <Text style={[
                    StyleZ.p,
                    {
                      margin: 0,
                      fontSize: TextsSizes.small
                    }
                  ]}>Tournament Fee</Text>
                  <Text style={[
                    StyleZ.h4,
                    {
                      margin: 0
                    }
                  ]}>${tournament.tournament_fee}</Text>
                </View>

              </View>
              </TouchableOpacity>

              <View style={[
                {
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  paddingInline: BasePaddingsMargins.m5,
                  top: BasePaddingsMargins.m5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }
              ]}>
                <UIBadge label={`ID:${tournament.id_unique_number}`} />
                {
                  user!==null
                  ?
                  <TouchableOpacity style={[
                    {
                      borderRadius: BasePaddingsMargins.m15,
                      borderStyle: 'solid',
                      borderColor: BaseColors.secondary,
                      borderWidth: 1,
                      backgroundColor: BaseColors.dark,
                      marginLeft: BasePaddingsMargins.m10,
                      paddingInline: BasePaddingsMargins.m10,
                      paddingBlock: BasePaddingsMargins.m5
                    }
                  ]}
                    onPress={()=>{
                      set_isLiked( !isLiked );
                      AddTournamentLike( user as ICAUserData, tournament, !isLiked );
                    }}
                  >
                    <Ionicons name={isLiked?'heart':'heart-outline'} style={[
                      {
                        fontSize: TextsSizes.p,
                        color: BaseColors.light,
                      }
                    ]} />
                  </TouchableOpacity>
                  :
                  null
                }
              </View>

            </View>;
}