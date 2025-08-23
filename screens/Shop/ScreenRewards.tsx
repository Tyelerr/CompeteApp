import { Image, Text, View } from "react-native";
import UIPanel from "../../components/UI/UIPanel";
import ScreenScrollView from "../ScreenScrollView";
import { Ionicons } from "@expo/vector-icons";
import UIBadge from "../../components/UI/UIBadge";
import {
  BaseColors,
  BasePaddingsMargins,
  TextsSizes,
} from "../../hooks/Template";
import { StyleZ } from "../../assets/css/styles";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { useContextAuth } from "../../context/ContextAuth";
import {
  EActivityType,
  ECustomContentType,
  EUserRole,
  ICAUserData,
  ICustomContent,
} from "../../hooks/InterfacesGlobal";
import { useEffect, useState } from "react";
import {
  ILFInputGridInput,
  ILFInputsGrid,
} from "../../components/LoginForms/LFInputsGrid";
import {
  GetContentItems,
  GetRewards,
  GetTheGifts,
  GetTheLatestContent,
} from "../../ApiSupabase/CrudCustomContent";
import ModalEditorContent from "../Home/ModalEditorContent";
import ShopSubNavigation, { ShopTab } from "./ShopSubNavigation";
import ScreenRewardsModalView from "./ScreenRewardModalView";
import ModalInfoMessage from "../../components/UI/UIModal/ModalInfoMessage";
import ModalEditorContentRewards from "./ModalEditorContentRewards";
import GiftPanelItem from "./GiftPnaelIItem";
import { enterInGift } from "../../ApiSupabase/CrudActivities";
import { useNavigation } from "@react-navigation/native";

const gift_example_image = require("./../../assets/images/example-gift.jpg");

export default function ScreenRewards() {
  const { user } = useContextAuth();
  const navigation = useNavigation<any>();

  const roleStr = String(user?.role ?? "").toLowerCase();
  const isMaster =
    user?.role === EUserRole.MasterAdministrator || roleStr.includes("master");

  const [modalEditorIsOpened, set_modalEditorIsOpened] =
    useState<boolean>(false);
  const [modalNewGiftCreatorIsOpened, set_modalNewGiftCreatorIsOpened] =
    useState<boolean>(false);
  const [selectedRewardsData, set_selectedRewardsData] =
    useState<ICustomContent | null>(null);

  const [modalViewRewardIsVisible, set_modalViewRewardIsVisible] =
    useState<boolean>(false);
  const [infoMessageAskForRewardVisible, set_infoMessageAskForRewardVisible] =
    useState<boolean>(false);

  const [gifts, set_gifts] = useState<ICustomContent[]>([]);

  const theData = (): ICustomContent => {
    return selectedRewardsData as ICustomContent;
  };

  const ___LoadTheGifts = async () => {
    if (user === null) return;
    const { data } = await GetTheGifts(user?.id_auto);
    const _itemsRewards: ICustomContent[] = (data || []) as ICustomContent[];
    set_gifts(_itemsRewards);
  };

  const ____EnterIntoTheGift = async () => {
    if (selectedRewardsData === null || user === null) return;
    await enterInGift(
      selectedRewardsData?.id,
      user.id_auto,
      "ip address no need in this case, we have user id",
      EActivityType.EnterInGift
    );
    set_infoMessageAskForRewardVisible(false);
    ___LoadTheGifts();
  };

  useEffect(() => {
    ___LoadTheGifts();
  }, []);

  const onTabChange = (t: ShopTab) => {
    if (t === "home") navigation.navigate("ShopHome");
    else if (t === "rewards") navigation.navigate("ShopRewards");
    else if (t === "manage")
      navigation.navigate("ShopHome", { initialTab: "manage" });
  };

  return (
    <>
      <ScreenScrollView>
        {/* Top tabs, wired to navigate between Shop screens */}
        <ShopSubNavigation
          active="rewards"
          onChange={onTabChange}
          isMaster={isMaster}
        />

        {/* Master-only quick access to Manage */}
        {isMaster && (
          <UIPanel>
            <LFButton
              type="primary"
              icon="construct"
              label="Manage Giveaways"
              onPress={() =>
                navigation.navigate("ShopHome", { initialTab: "manage" })
              }
            />
          </UIPanel>
        )}

        {/* List of giveaways */}
        {gifts.map((gift: ICustomContent, key: number) => {
          return (
            <GiftPanelItem
              key={`gift-item-${key}`}
              rewardsData={gift}
              afterClickingEditButton={(reward: ICustomContent) => {
                set_selectedRewardsData(reward);
                set_modalEditorIsOpened(true);
              }}
              AfterClickingViewDetails={(reward: ICustomContent) => {
                set_selectedRewardsData(reward);
                set_modalViewRewardIsVisible(true);
              }}
              afterDeletingTheGift={() => {
                ___LoadTheGifts();
              }}
            />
          );
        })}

        <View
          style={{
            paddingBottom: BasePaddingsMargins.m45,
          }}
        >
          <Text
            style={[
              StyleZ.h2,
              {
                color: "#3663d5",
                textAlign: "center",
                fontSize: 40,
              },
            ]}
          >
            More giveaways coming soon
          </Text>
          <Text
            style={[
              StyleZ.p,
              {
                textAlign: "center",
              },
            ]}
          >
            Stay tuned for exciting new prizes and opportunities!
          </Text>
        </View>
      </ScreenScrollView>

      <ModalEditorContentRewards
        F_isOpened={set_modalEditorIsOpened}
        isOpened={modalEditorIsOpened}
        type={ECustomContentType.ContentReward}
        data_row={selectedRewardsData}
        set_data_row={set_selectedRewardsData}
        afterUpdatingTheGift={() => {
          ___LoadTheGifts();
        }}
      />

      {/* creator modal still available if you trigger it from elsewhere */}
      <ModalEditorContentRewards
        F_isOpened={set_modalNewGiftCreatorIsOpened}
        isOpened={modalNewGiftCreatorIsOpened}
        type={ECustomContentType.ContentReward}
        data_row={null}
        set_data_row={set_selectedRewardsData}
        editOrCreate="create-new"
        afterCreatingNewGift={() => {
          ___LoadTheGifts();
        }}
      />

      {modalViewRewardIsVisible === true && selectedRewardsData !== null ? (
        <ScreenRewardsModalView
          F_isOpened={set_modalViewRewardIsVisible}
          isOpened={modalViewRewardIsVisible}
          rewardsData={selectedRewardsData}
          F_AfterPressingEnter={() => {
            set_infoMessageAskForRewardVisible(true);
          }}
        />
      ) : null}

      {infoMessageAskForRewardVisible === true &&
      selectedRewardsData !== null ? (
        <ModalInfoMessage
          set_visible={set_infoMessageAskForRewardVisible}
          visible={infoMessageAskForRewardVisible}
          title="Giveaway Rules"
          messageNodes={
            <>
              {[
                "Must be 18 years or older",
                "One entry per person",
                "Winner will be contacted via email",
                "Must be available for pickup or pay shipping",
              ].map((obj, key: number) => {
                return (
                  <View
                    key={`item-${key}`}
                    style={{
                      marginBottom: BasePaddingsMargins.m10,
                      alignItems: "center",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 0.5 * 6,
                        backgroundColor: BaseColors.primary,
                        marginRight: BasePaddingsMargins.m10,
                      }}
                    />
                    <Text
                      style={[
                        StyleZ.h5,
                        {
                          marginBottom: 0,
                          width: "95%",
                        },
                      ]}
                    >
                      {obj}
                    </Text>
                  </View>
                );
              })}
            </>
          }
          id={100}
          buttons={[
            <LFButton
              type="outline-dark"
              label="Cancel"
              onPress={() => {
                set_infoMessageAskForRewardVisible(false);
              }}
            />,
            <LFButton
              type="primary"
              label="I Agree - Enter Me!"
              onPress={() => {
                ____EnterIntoTheGift();
              }}
            />,
          ]}
        />
      ) : null}
    </>
  );
}
