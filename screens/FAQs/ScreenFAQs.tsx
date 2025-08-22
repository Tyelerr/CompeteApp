import { Text, View } from "react-native";
import UIPanel from "../../components/UI/UIPanel";
import ScreenScrollView from "../ScreenScrollView";
import { StyleZ } from "../../assets/css/styles";
import ZAccordion from "../../components/UI/Accordion/ZAccordion";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { useEffect, useState } from "react";
import ModalMoreFAQs from "./ModalMoreFAQs";
import ScreenFAQsContact from "./ScreenFAQsContact";

export default function ScreenFAQs(){

  const [modalMoreQuestionsView, set_modalMoreQuestionsView] = useState<boolean>(false);

  useEffect(()=>{
    // // // // // // // // console.log('FAQ page render!');
  }, []);

  return <>
    <ScreenScrollView>
      
      <UIPanel>
        <Text style={StyleZ.h3}>
          Common Questions
        </Text>

        <ZAccordion ACCORDION_ITEMS={[
          {title:'How do I register for a tournament?', content:`To register for a tournament, browse available tournaments on the Billiards page or Home page, click on a tournament card, and then click the 'Register' button. You'll need to be logged in to register.`},
          {title:`What is a Fargo rating?`, content:`Fargo is a rating system used in pool and billiards to measure player skill level. It provides a numerical rating based on your performance against other rated players. Higher numbers indicate better players.`},
          {title:`How do I create an account?`, content:`Click on 'Profile' in the navigation menu, then select 'Sign Up' to create a new account. You'll need to provide a username and password.`},
          {title:`What's the difference between open and restricted tournaments?`, content:`Open tournaments allow players of any skill level to participate. Restricted tournaments have a maximum Fargo rating limit, meaning only players below that rating can enter.`},
        ]} />


        <View>
          <View>
            <LFButton type="outline-dark" label="View More Questions" onPress={()=>{

              set_modalMoreQuestionsView(true)

            }} />
          </View>
        </View>

      </UIPanel>



      <ScreenFAQsContact />


    </ScreenScrollView>

    <ModalMoreFAQs isOpened={modalMoreQuestionsView} F_isOpened={set_modalMoreQuestionsView} />

  </>
}