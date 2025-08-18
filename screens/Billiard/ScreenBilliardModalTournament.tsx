import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleModal, StyleZ } from "../../assets/css/styles";
import UIModalCloseButton from "../../components/UI/UIModal/UIModalCloseButton";
import { ETournamentStatuses, EUserRole, ITournament } from "../../hooks/InterfacesGlobal";
import UIBadge from "../../components/UI/UIBadge";
import { BaseColors, BasePaddingsMargins } from "../../hooks/Template";
import UIPanel from "../../components/UI/UIPanel";
import { format, parseISO } from "date-fns";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { useActionState, useEffect } from "react";
import { ILFInputGridInput } from "../../components/LoginForms/LFInputsGrid";
import { useContextAuth } from "../../context/ContextAuth";

export default function ScreenBilliardModalTournament(
  {
    tournament,
    isOpened,
    F_isOpened,
    ApproveTheTournament,
    DeleteTheTournament,
    DeclineTheTournament
  }
  :
  {
    tournament?: ITournament,
    isOpened: boolean,
    F_isOpened: (v:boolean)=>void,
    ApproveTheTournament?: ()=>void,
    DeleteTheTournament?: ()=>void,
    DeclineTheTournament?: ()=>void
  }
){
  
  const {
    user
  } = useContextAuth();

  useEffect(()=>{
    // // // // // console.log( 'tournament:', tournament );
  }, []);

  const __Item = (title:string, value:string, m?:number)=>{
    return <View style={[
      {
        marginBottom: m!==undefined?m:BasePaddingsMargins.formInputMarginLess
      }
    ]}>
      <Text style={[
        StyleZ.h5
      ]}>{title}</Text>
      <Text style={[
        StyleZ.p
      ]}>{value}</Text>
    </View>
  }
  
  if(tournament===undefined)return null;

  return <Modal
    animationType="fade"
    transparent={true}
    visible={isOpened}
  >
    
      <View style={[
          StyleModal.container
        ]}>


        <TouchableOpacity 
          style={[StyleModal.backgroundTouchableForClosing]} 
          onPress={()=>{
          F_isOpened(false)
        }} />

        <View style={[
          StyleModal.containerForScrollingView,
        ]}>
  
  
          <ScrollView style={[
            StyleModal.scrollView,
          ]}>
  
            <View style={[
              StyleModal.contentView
            ]}>
  
              <UIModalCloseButton F_isOpened={F_isOpened} />


              <View style={{
                marginBottom: BasePaddingsMargins.formInputMarginLess
              }}>
                <Text style={[
                  StyleZ.h2,
                ]}>Tournament Details</Text>
                <View style={{
                  width: 120
                }}>
                  <UIBadge label={`ID: ${tournament.id_unique_number}`} />
                </View>
              </View>

              <UIPanel>

                <Text style={[
                  StyleZ.h3
                ]}>Basic Information</Text>

                <View style={[
                  {
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap'
                  }
                ]}>
                  <Text style={[
                    StyleZ.h2,
                  ]}>{tournament.tournament_name}</Text>
                </View>
                <View style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    marginBottom: BasePaddingsMargins.formInputMarginLess
                  }
                ]}>
                  <View style={[
                    {
                      marginRight: BasePaddingsMargins.m10
                    }
                  ]}>
                    <UIBadge type="secondary" label={tournament.game_type} />
                  </View>
                  <View>
                    <UIBadge label={'Format:'} />
                  </View>
                </View>

                { __Item( 'Tournament Date & Time', format(parseISO(tournament.start_date), 'EEEE MMM dd, yyyy h:mm aa') ) }
                { __Item( 'Entry Fee', `$${tournament.tournament_fee}` ) }
                { __Item( 'Tournament Director', 'not set' ) }
                { __Item( 'Player Count', 'not set' ) }
                { __Item( 'Description', tournament.description ) }

                {
                  tournament.side_pots!==undefined && tournament.side_pots!==null && tournament.side_pots.length>0?
                  <View>
                    <Text style={[StyleZ.h5]}>Side Posts:</Text>
                    {
                      tournament.side_pots!==undefined?
                      tournament.side_pots.map((side_post:ILFInputGridInput[], key_side_post:number)=>{
                        return <View 
                          key={`side-post-${key_side_post}`}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                          }}
                          >
                          {
                            side_post!==undefined?
                              side_post.map((side_post_cell:ILFInputGridInput, side_post_cell_key:number)=>{
                                return <View 
                                  key={`sidepost-cell-${key_side_post}-${side_post_cell_key}`}
                                  style={
                                    {
                                      width: '48%'
                                    }
                                  }
                                  >
                                  <Text style={{
                                    color: BaseColors.othertexts
                                  }}>{side_post_cell_key===1?'$':''}{side_post_cell.value}</Text>
                                </View>
                              })
                              :
                              null
                          }
                        </View>
                      })
                      :
                      null
                    }
                  </View>
                  :
                  null
                }

              </UIPanel>

              <UIPanel>

                <Text style={[
                  StyleZ.h3
                ]}>Venue Information</Text>

                { __Item( 'Venue Name', tournament.venues!==null && tournament.venues!==undefined?tournament.venues.venue : tournament.venue ) }
                { __Item( 'Address', tournament.venues!==null && tournament.venues!==undefined?tournament.address : tournament.address ) }
                { __Item( 'Phone Number', tournament.venues!==null && tournament.venues!==undefined? tournament.venues.phone : tournament.phone ) }
                { __Item( 'Table Size', tournament.table_size ) }
                { __Item( 'Number of Tables', tournament.number_of_tables.toString(), 0 ) }

              </UIPanel>

              <UIPanel>

                <Text style={[
                  StyleZ.h3
                ]}>Tournament Settings</Text>

                <View style={[
                  {
                    marginBottom: BasePaddingsMargins.formInputMarginLess,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap'
                  }
                ]}>
                  {
                    tournament.reports_to_fargo===true
                    ?
                    <View style={{
                      marginRight: BasePaddingsMargins.m5,
                      marginBottom: BasePaddingsMargins.m5
                    }}>
                      <UIBadge label="Reports to Fargo" type="primary" />
                    </View>
                    :
                    null
                  }
                  {
                    tournament.is_recurring===true
                    ?
                    <View style={{
                      marginRight: BasePaddingsMargins.m5,
                      marginBottom: BasePaddingsMargins.m5
                    }}>
                      <UIBadge label="Recurring" type="primary" />
                    </View>
                    :
                    null
                  }
                  {
                    tournament.is_open_tournament===true
                    ?
                    <View style={{
                      marginRight: BasePaddingsMargins.m5,
                      marginBottom: BasePaddingsMargins.m5
                    }}>
                      <UIBadge label="Open Tournament" type="primary" />
                    </View>
                    :
                    null
                  }
                </View>
                
                { __Item( 'Equipment', tournament.equipment ) }
                { __Item( 'Race', tournament.race_details ) }
                { __Item( 'Game Spot', tournament.game_spot, 0 ) }

              </UIPanel>

              {
                user?.role===EUserRole.MasterAdministrator && tournament.status===ETournamentStatuses.Pending?
                <>
                  <LFButton label="Approve" type="success" marginbottom={BasePaddingsMargins.m10} onPress={()=>{
                    F_isOpened(false);
                    if(ApproveTheTournament!==undefined)
                      ApproveTheTournament();
                  }} />
                  <LFButton label="Delete" type="danger" marginbottom={BasePaddingsMargins.m10} onPress={()=>{
                    F_isOpened(false);
                    if(DeleteTheTournament!==undefined)
                      DeleteTheTournament();
                  }} />
                </>
                :
                null
              }
              {
                user?.role===EUserRole.MasterAdministrator && tournament.status===ETournamentStatuses.Approved?
                <>
                  <LFButton label="Decline" type="success" marginbottom={BasePaddingsMargins.m10} onPress={()=>{
                    F_isOpened(false);
                    if(DeclineTheTournament!==undefined)
                      DeclineTheTournament();
                  }} />
                  <LFButton label="Delete" type="danger" marginbottom={BasePaddingsMargins.m10} onPress={()=>{
                    F_isOpened(false);
                    if(DeleteTheTournament!==undefined)
                      DeleteTheTournament();
                  }} />
                </>
                :
                null
              }
              <LFButton label="Close" type="outline-dark" onPress={()=>{
                F_isOpened(false);
              }} />


            </View>
          </ScrollView>
        </View>
      </View>

  </Modal>
}