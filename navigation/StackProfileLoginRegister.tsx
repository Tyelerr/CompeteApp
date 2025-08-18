import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import StackHeader from "./StackHeader";
import ScreenProfileLogin from "../screens/ProfileLoginRegister/ScreenProfileLogin";
import ScreenProfileRegister from "../screens/ProfileLoginRegister/ScreenProfileRegister";
import ScreenProfileRegisterTest from "../screens/ProfileLoginRegister/ScreenProfileRegisterTest";

const Stack = createNativeStackNavigator();


/*const ScreenProfileLogin = ()=>{
  return <View>
    <Text>Profile Login</Text>
  </View>
}*/
/*const ScreenProfileRegister = ()=>{
  return <View>
    <Text>Profile Register</Text>
  </View>
}*/


export default function StackProfileLoginRegister({navigation, route}){
  
  const ProfileLoginRegisterScreens = [
    {name:'ProfileLogin', component:ScreenProfileLogin},
    {name:'ProfileRegister', component: ScreenProfileRegister},
    {name:'ProfileRegisterTest', component: ScreenProfileRegisterTest},
    //{name:'BarOfTheMonth', component: ScreenHomeBarOfTheMonth},
  ];
  /*const { 
    setIsLoggedIn,
    userId,
    anotherVariable
  } = route.params;
  // // // // // // // // // console.log('setIsLoggedIn:', setIsLoggedIn);
  // // // // // // // // // console.log('userId:', userId);
  // // // // // // // // // console.log('anotherVariable:', anotherVariable);*/
  

  return <Stack.Navigator 
    
    initialRouteName="ProfileLogin"
    screenOptions={
      {
        animation: "none",
        animationDuration: 0,
        // statusBarAnimation: 'none',
        // headerShown: false, 
        header: ()=> <StackHeader title="Billiards Hub" type="centered-no-icon" />,
      }
    }
    >
    {
      ProfileLoginRegisterScreens.map((obj, key:number)=>{
        return <Stack.Screen 
          key={`Profile-not-logged-key-${key}`}
          name={obj.name}
          component={obj.component}
          />
      })
    }
  </Stack.Navigator>
}