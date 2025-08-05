// import { Alert, Text, View } from "react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ScreenScrollView from "../ScreenScrollView";
// import UIPanel from "../../components/UI/UIPanel";
// import LFButton from "../../components/LoginForms/Button/LFButton";
// import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
// import { supabase } from "../../ApiSupabase/supabase";
// import ProfileLoggedHeading from "./ProfileLoggedHeading";
// import ModalProfileEditor from "./ModalProfileEditor";
// import { useState } from "react";
// import { useContextAuth } from "../../context/ContextAuth";
import PanelUserDetailsAndEditor from "./PanelUserDetailsAndEditor";
import ProfileLoggedSubNavigation from "./ProfileLoggedSubNavigation";
import UIBadge from "../../components/UI/UIBadge";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import UIPanel from "../../components/UI/UIPanel";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { AddTournamentLike, FetchTournaments_LikedByUser } from "../../ApiSupabase/CrudTournament";
import { useContextAuth } from "../../context/ContextAuth";
import { ICAUserData, ILikedTournament, ITournament } from "../../hooks/InterfacesGlobal";
import { format, parseISO } from "date-fns";
import { getThurnamentStaticThumb, THUMBNAIL_CUSTOM } from "../../hooks/constants";
import LFButton from "../../components/LoginForms/Button/LFButton";
import ScreenBilliardModalTournament from "../Billiard/ScreenBilliardModalTournament";


export default function ProfileLoggedFavoriteTournaments(){

  const {
    user
  } = useContextAuth();


  const [likedTournaments, set_likedTournaments] = useState<ILikedTournament[]>([]);
  const [countLikesState, set_countLikesState] = useState<number>(0);
  const [selectedTournamentForTheModal, set_selectedTournamentForTheModal] = useState< ITournament | null >( null );
  const [modalForTournamentIsOpened, set_modalForTournamentIsOpened] = useState<boolean>(false);

  const __LoadLikedTournamentsBYMe = async ()=>{
    const {
      likedtournaments, error, data, countLikes
    } = await FetchTournaments_LikedByUser( user as ICAUserData );

    set_countLikesState(countLikes);

    const liked:ILikedTournament[] = likedtournaments;

    // // // // console.log('data liked tournaments:', data);
    // // // // console.log('error liked tournaments:', error);
    // // // // console.log('data liked tournaments:', likedtournaments);

    if(likedtournaments!==null){
      set_likedTournaments( liked );
    }

  }

  const ___ViewTheTournament = (tournament: ITournament)=>{
    set_selectedTournamentForTheModal(tournament);
    set_modalForTournamentIsOpened(true);
  }

  const ___RemoveLike = async (tournament: ITournament)=>{
    const {
      data, error
    } = await AddTournamentLike(user as ICAUserData, tournament, false);
    // // console.log('error:', error);
    // // console.log('data:', data);
    __LoadLikedTournamentsBYMe();
  }

  useEffect(()=>{
    __LoadLikedTournamentsBYMe()
  }, []);

  return <>
    <ScreenScrollView>
      
      <View>

        <PanelUserDetailsAndEditor />
        
        <View style={{
          marginBottom: BasePaddingsMargins.m10
        }}>
          <ProfileLoggedSubNavigation />
        </View>

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: BasePaddingsMargins.m30
        }}>
          <UIBadge label={`${countLikesState} favorites`} marginBottom={BasePaddingsMargins.m5} type="secondary" />
          <Text style={{
            fontSize: TextsSizes.h2,
            fontWeight: 'bold',
            textAlign: 'center',
            color: BaseColors.light,
            width: '100%'
          }}>Favorite Tournaments</Text>
        </View>


        <View>
        {
          likedTournaments.map((likedTournament: ILikedTournament, key:number)=>{

            // // // // console.log('likedTournament:', likedTournament);

            const tournament: ITournament = likedTournament.tournamentobject;

            return <UIPanel key={`favourite-tournament-${key}`}>
              <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'space-between',
                marginBlock: BasePaddingsMargins.m10,
                position: 'relative'
              }} onPress={()=>{
                ___ViewTheTournament(tournament);
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                
                  {/*<TouchableOpacity onPress={()=>{
                    ___ViewTheTournament(tournament);
                  }}>
                    <Image 
                    style={{
                      width: 100,
                      height: 80,
                      borderRadius: 10,
                      marginRight: BasePaddingsMargins.m10
                    }}
                    source={
                      (
                        tournament.thumbnail_type===THUMBNAIL_CUSTOM
                        ?
                        {
                          uri:tournament.thumbnail_url,
                        }
                        :
                        getThurnamentStaticThumb(tournament.thumbnail_type)
                      )
                    } />
                  </TouchableOpacity>*/}
                  <Image 
                    style={{
                      width: 100,
                      height: 80,
                      borderRadius: 10,
                      marginRight: BasePaddingsMargins.m10
                    }}
                    source={
                      (
                        tournament.thumbnail_type===THUMBNAIL_CUSTOM
                        ?
                        {
                          uri:tournament.thumbnail_url,
                        }
                        :
                        getThurnamentStaticThumb(tournament.thumbnail_type)
                      )
                    } />
                  {/*<TouchableOpacity onPress={()=>{
                    ___RemoveLike( tournament );
                  }}>
                    <Ionicons name="heart" color={BaseColors.danger} size={15} />
                  </TouchableOpacity>*/}

                </View>
                <TouchableOpacity style={[
                  {
                    display: 'flex',
                    flexDirection: "column",
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    // backgroundColor: 'red'
                  }
                ]} onPress={()=>{
                  ___ViewTheTournament( tournament );
                }}>
                  <UIBadge label={tournament.game_type} />
                  <Text style={{
                    fontSize: TextsSizes.h3,
                    fontWeight: 'bold',
                    color: BaseColors.light,
                    // marginTop: BasePaddingsMargins.m10
                  }}>{tournament.tournament_name}</Text>
                </TouchableOpacity>


              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                ___ViewTheTournament( tournament )
              }}>
              <Text style={{
                color: BaseColors.othertexts,
                fontSize: TextsSizes.p,
                display: 'flex',
                marginBottom: BasePaddingsMargins.m10
              }}>{
                format(parseISO(tournament.start_date), 'EEEE MMM dd, yyyy h:mm aa')
              }</Text>

              <View style={{
                marginBottom: BasePaddingsMargins.m10,
                flexDirection: 'row',
                alignItems:'center',
                justifyContent:'flex-start'
              }}>
                <Ionicons name="location" color={BaseColors.othertexts} size={TextsSizes.p} style={{marginRight: BasePaddingsMargins.m10}} />
                <Text style={{
                  color: BaseColors.othertexts,
                  fontSize: TextsSizes.p,
                  display: 'flex',
                  
                }}>{tournament.venue}</Text>
              </View>
              <View style={{
                flexDirection:"row",
                alignItems: 'center'
              }}>
                <Text style={{width: '50%', fontSize: TextsSizes.p, color: BaseColors.othertexts}}>
                  Entry Fee
                </Text>
                <Text style={{width: '50%', fontSize: TextsSizes.p, fontWeight: 'bold', color: BaseColors.light}}>
                  ${tournament.tournament_fee}
                </Text>
              </View>
              </TouchableOpacity>


              <TouchableOpacity 
                style={[
                  {
                    position: 'absolute',
                    top: 60,
                    left: 140
                  }
                ]}
                onPress={()=>{
                ___RemoveLike( tournament );
              }}>
                <Ionicons name="heart" color={BaseColors.danger} size={15} />
              </TouchableOpacity>

            </UIPanel>
          })
        }
        </View>

      </View>

        
    </ScreenScrollView>

    {
      selectedTournamentForTheModal!==null?
      <ScreenBilliardModalTournament 
        F_isOpened={set_modalForTournamentIsOpened}
        isOpened={modalForTournamentIsOpened}
        tournament={selectedTournamentForTheModal}
      />
      :
      null
    }
  </>
}