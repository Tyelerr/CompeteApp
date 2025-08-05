import { Text, View } from "react-native";
import { ITournament } from "../../hooks/InterfacesGlobal";
import ScreenBilliardThumbDetails from "./ScreenBilliardThumbDetails";
import { StyleZ } from "../../assets/css/styles";
import Pagination from "../../components/UI/Pagination/Pagiination";
import { COUNT_TOURNAMENTS_IN_PAGE } from "../../hooks/constants";

export default function ScreenBilliardListTournaments(

  {
    tournaments,
    set_selectedTournament,
    set_ScreenBilliardModalTournament_opened,
    offsetTournaments,
    totalCount,
    __LoadTheTournaments
  }
  :
  {
    tournaments: ITournament[],
    set_selectedTournament: (t: ITournament)=>void,
    set_ScreenBilliardModalTournament_opened: (v: boolean)=>void,
    offsetTournaments: number,
    totalCount: number,
    __LoadTheTournaments: (n?:number)=>void
  }

){
  return <>

  <Pagination
    countPerPage={COUNT_TOURNAMENTS_IN_PAGE}
    offset={offsetTournaments}
    totalCount={totalCount}
    FLoadDataByOffset={__LoadTheTournaments}
      />

{
        tournaments.length===0?
        <View style={{
          minHeight: 300
        }}>
          <Text style={[
            StyleZ.h3,
            {
              textAlign: 'center'
            }
          ]}>No tournaments found. Try adjusting your filters or search terms.</Text>
        </View>
        :
        <View style={[
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            minHeight: 300
          }
        ]}>
          {
            tournaments.map((tournament:ITournament, key:number)=>{
              return <ScreenBilliardThumbDetails
                key={`tournament-key-${key}`}
                tournament={tournament}
                selectTournament={(t:ITournament)=>{
                  set_selectedTournament(t);
                  set_ScreenBilliardModalTournament_opened(true);
                }}
                />
            })
          }
        </View>
      }

      <Pagination
        countPerPage={COUNT_TOURNAMENTS_IN_PAGE}
        offset={offsetTournaments}
        totalCount={totalCount}
        FLoadDataByOffset={__LoadTheTournaments}
      />

  </>
}