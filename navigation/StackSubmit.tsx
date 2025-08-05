import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import StackHeader from "./StackHeader";
import ProfileLoggedFavoriteTournaments from "../screens/ProfileLogged/ProfileLoggedFavoriteTournaments";
import ProfileLoggedSearchAlerts from "../screens/ProfileLogged/ProfileLoggedSearchAlerts";
import ScreenSubmit from "../screens/Submit/ScreenSubmit";
import ScreenSubmitAfter from "../screens/Submit/ScreenSubmitAfter";
// import { useScrollToTop } from "@react-navigation/native";
// import { Component } from "react";

const Stack = createNativeStackNavigator();


const exampleComponent = ()=>{
  return <Text>This will be the example component</Text>
}

export default function StackSubmit({navigation, route}){
  const ArrayProfileLoggedScreens = [
    {
      name:'SubmitTournamentForm', component:ScreenSubmit
    },
    {
      name:'SubmitTournamentAfterSubmitPage', 
      component:ScreenSubmitAfter
    },
  ];

  return <Stack.Navigator
    initialRouteName="SubmitTournamentForm"
    screenOptions={
      // useScrollToTop(),
      {
        animation: "none",
        animationDuration: 0,
        // statusBarAnimation: 'none',
        // headerShown: false, 
        header: ()=> <StackHeader 
          title="SUBMIT TOURNAMENT" 
          subtitle="Submit your tournament for review and approval"
          type="centered-no-icon"
          />
      }
    }
  >
    {
      ArrayProfileLoggedScreens.map((obj, key:number)=>{
        return <Stack.Screen
          key={`profile-logged-screen-${obj.name}`} 
          name={obj.name}
          component={obj.component} />
      })
    }
  </Stack.Navigator>

}