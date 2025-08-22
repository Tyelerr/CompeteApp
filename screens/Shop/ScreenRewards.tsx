import { Image, Text, View } from "react-native";
import UIPanel from "../../components/UI/UIPanel";
import ScreenScrollView from "../ScreenScrollView";
import ScreenHomeSubNavigation from "./ScreenHomeSubNavigation";
import { Ionicons } from "@expo/vector-icons";
import UIBadge from "../../components/UI/UIBadge";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import { StyleZ } from "../../assets/css/styles";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { useContextAuth } from "../../context/ContextAuth";
import { EActivityType, ECustomContentType, EUserRole, ICAUserData, ICustomContent } from "../../hooks/InterfacesGlobal";
// import ModalEditorContent from "./ModalEditorContent";
import { useEffect, useState } from "react";
import { ILFInputGridInput, ILFInputsGrid } from "../../components/LoginForms/LFInputsGrid";
import { GetContentItems, GetRewards, GetTheGifts, GetTheLatestContent } from "../../ApiSupabase/CrudCustomContent";
import ModalEditorContent from "../Home/ModalEditorContent";
import ShopSubNavigation from "./ShopSubNavigation";
import ScreenRewardsModalView from "./ScreenRewardModalView";
import ModalInfoMessage from "../../components/UI/UIModal/ModalInfoMessage";
import ModalEditorContentRewards from "./ModalEditorContentRewards";
import GiftPanelItem from "./GiftPnaelIItem";
import { enterInGift } from "../../ApiSupabase/CrudActivities";


const gift_example_image = require('./../../assets/images/example-gift.jpg');


export default function ScreenRewards(){

  const {user} = useContextAuth();

  // // // // // // // console.log('user:', user);
  // // // // // // // console.log('user.role:', user?.role);

  const [modalEditorIsOpened, set_modalEditorIsOpened] = useState<boolean>(false);
  const [modalNewGiftCreatorIsOpened, set_modalNewGiftCreatorIsOpened] = useState<boolean>(false);
  const [selectedRewardsData, set_selectedRewardsData] = useState<ICustomContent | null>(null);

  const [modalViewRewardIsVisible, set_modalViewRewardIsVisible] = useState<boolean>(false);
  const [infoMessageAskForRewardVisible, set_infoMessageAskForRewardVisible] = useState<boolean>(false);

  const [gifts, set_gifts] = useState<ICustomContent[]>([]);

  const theData = ():ICustomContent=>{
    return selectedRewardsData as ICustomContent;
  }

  /* This function not need noe, we have dynamic rewards
  const LoadData = async ()=>{
    const {data, error} = await GetTheLatestContent( ECustomContentType.ContentRewards );

    if(error===null && data!==null && data.length===1){
      set_selectedRewardsData( data[0] as ICustomContent )
    }
  }*/

  const ___LoadTheGifts = async ()=>{
    if(user===null)return;
    // this function will load the gifts
    const {
      data, error
    } = await GetTheGifts( user?.id_auto )
    const _itemsRewards: ICustomContent[] = data as ICustomContent[];

    // // // console.log(data, error);

    set_gifts( _itemsRewards )

  }

  const ____EnterIntoTheGift = async ()=>{
    if(selectedRewardsData===null){
      // // console.log('selectedRewardsData===null');
      return;
    }
    if(user===null){
      // // console.log('user===null');
      return;
    }
    const {} = await enterInGift(
      selectedRewardsData?.id,
      user.id_auto,
      'ip address no need in this case, we have user id',
      EActivityType.EnterInGift
    )

    set_infoMessageAskForRewardVisible(false)
    ___LoadTheGifts()
  }

  useEffect(()=>{
    // LoadData()
    ___LoadTheGifts()
  }, []);

  return <><ScreenScrollView>


    <ShopSubNavigation />

    {
      user!==null && user.role === EUserRole.MasterAdministrator
      ?
      <LFButton 
        type="primary" 
        label="Create gift" 
        icon="gift" 
        marginbottom={BasePaddingsMargins.m15}
        onPress={()=>{
          set_modalNewGiftCreatorIsOpened(true)
        }}
      />
      :
      null
    }

    {
      // here will got the list of the gifts
      gifts.map((gift: ICustomContent, key: number)=>{
        return <GiftPanelItem 
        key={`gift-item-${key}`}
          rewardsData={gift}
          // rewardsData={}
          // set_modalEditorIsOpened={set_modalEditorIsOpened}
          afterClickingEditButton={(reward: ICustomContent)=>{
            set_selectedRewardsData( reward )
            set_modalEditorIsOpened( true )
          }}
          AfterClickingViewDetails={(reward: ICustomContent)=>{
            set_selectedRewardsData( reward )
            set_modalViewRewardIsVisible(true)
          }}
          // set_modalViewRewardIsVisible={set_modalViewRewardIsVisible}
          afterDeletingTheGift={()=>{
            ___LoadTheGifts()
          }}
        />
      })
    }

    <View style={{
      paddingBottom: BasePaddingsMargins.m45
    }}>
      <Text style={[
        StyleZ.h2,
        {
          color: '#3663d5',
          textAlign: 'center',
          fontSize: 40
        }
      ]}>More giveaways coming soon</Text>
      <Text style={[
        StyleZ.p,
        {
          textAlign: 'center'
        }
      ]}>Stay tuned for exciting new prizes and opportunities!</Text>
    </View>

  </ScreenScrollView>



  {/*<ModalEditorContent
    // key={`modal-editor-for-`}
    F_isOpened={set_modalEditorIsOpened}
    isOpened={modalEditorIsOpened}
    type={ECustomContentType.ContentRewards}
    data_row={selectedRewardsData}
    set_data_row={set_selectedRewardsData}
  />*/}

  <ModalEditorContentRewards 
    
    // key={`modal-editor-for-`}
      F_isOpened={set_modalEditorIsOpened}
      isOpened={modalEditorIsOpened}
      type={ECustomContentType.ContentReward}
      data_row={selectedRewardsData}
      set_data_row={set_selectedRewardsData}
      afterUpdatingTheGift={()=>{
        ___LoadTheGifts()
      }}
  
  />

  {
    // this editor is for creating new gift
  }
  <ModalEditorContentRewards 
    
    // key={`modal-editor-for-`}
      F_isOpened={set_modalNewGiftCreatorIsOpened}
      isOpened={modalNewGiftCreatorIsOpened}
      type={ECustomContentType.ContentReward}
      data_row={null}
      set_data_row={set_selectedRewardsData}
      editOrCreate="create-new"
      afterCreatingNewGift={()=>{
        ___LoadTheGifts()
      }}
  />

  {
    modalViewRewardIsVisible===true && selectedRewardsData!==null?
    
    <ScreenRewardsModalView 
    
      F_isOpened={set_modalViewRewardIsVisible}
      isOpened={modalViewRewardIsVisible}    
      rewardsData={selectedRewardsData}
      F_AfterPressingEnter={()=>{
        set_infoMessageAskForRewardVisible(true)
      }}
      // selectedRewardsData={selectedRewardsData as ICustomContent}
    />
    :
    null
  }

  

  {
    infoMessageAskForRewardVisible===true && selectedRewardsData!==null?
    <ModalInfoMessage 
    set_visible={set_infoMessageAskForRewardVisible} 
    visible={infoMessageAskForRewardVisible} 
    title="Giveaway Rules"
    // selectedRewardsData={selectedRewardsData as ICustomContent}
    // message="Must be 18 years or older"
    messageNodes={
      <>
        {
          [
            'Must be 18 years or older',
            'One entry per person',
            'Winner will be contacted via email',
            'Must be available for pickup or pay shipping',

          ].map((obj, key: number)=>{
            return <View 
                key={`item-${key}`}
              style={{
                marginBottom: BasePaddingsMargins.m10,
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row'
              }}>
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: .5*6,
                  backgroundColor: BaseColors.primary,
                  marginRight: BasePaddingsMargins.m10
                }} />
                <Text style={[
                  StyleZ.h5,
                  {
                    marginBottom: 0,
                    width: '95%'
                  }
                ]}>{obj}</Text>
              </View>;
          })
        }
      </>
    }
    id={100}
    buttons={[
      <LFButton type="outline-dark" label="Cancel" onPress={()=>{
        set_infoMessageAskForRewardVisible(false);
      }} />,
      <LFButton type="primary" label="I Agree - Enter Me!" onPress={()=>{
        ____EnterIntoTheGift()
      }} />
    ]}
    />
    :
    null
  }

  </>
}