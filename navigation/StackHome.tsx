import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TRootStackParamList } from "./Interface";
import { ScrollView, Text, View } from "react-native";
// import { StackHeader } from "./StackHeader";
import { StyleZ } from "../assets/css/styles";
import ScreenHome from "../screens/Home/ScrenHome";
import StackHeader from "./StackHeader";
import ScreenHomePlayerSpotlight from "../screens/Home/ScreenHomePlayerSpotlight";
import ScreenHomeBarOfTheMonth from "../screens/Home/ScreenHomeBarOfTheMonth";
import ScreenHomeFeaturedPlayer from "../screens/Home/ScreenHomeFeaturedPlayer";
import ScreenHomeFeaturedBar from "../screens/Home/ScreenHomeFeaturedBar";
// import { Header } from "react-native/Libraries/NewAppScreen";

// const Stack = createNativeStackNavigator<TRootStackParamList>();
const Stack = createNativeStackNavigator();



/*const homeScreen = ()=>{
  
  return <ScrollView style={{
    marginInline: 16,
    marginBlock: 5,
    // paddingBlockEnd: 40
  }}>
    <View style={{
      // paddingBlock: 20,
      // flexDirection: 'row'
    }}>
      {
      (Array(200).fill(undefined)).map((v, key)=>{
        return <Text key={`item-key-${key}`} style={{display:'flex'}}>This will be the home page {key}</Text>;
      })
      }
    </View>
  </ScrollView>
}*/



const latestNews = ()=>{
  return <View>
    <Text>Those will be the latest news</Text>
  </View>
}
const BarOfTheMonth = ()=>{
  return <View>
    <Text>Those will be the latest bar of the month</Text>
  </View>
}

export default function StackHome(){

  const HomeScreensArr = [
    {name:'LatestNews', component:ScreenHome},
    {name:'PlayerSpotlight', component: ScreenHomePlayerSpotlight},
    {name:'BarOfTheMonth', component: ScreenHomeBarOfTheMonth},
    {name:'HomeFeaturedPlayer', component: ScreenHomeFeaturedPlayer},
    {name:'HomeFeaturedBar', component: ScreenHomeFeaturedBar},

  ];

  return <Stack.Navigator 
    initialRouteName="LatestNews" 
    screenOptions={{
      // animationEnabled: false,
      
      animation: "none",
      animationDuration: 0,
      // statusBarAnimation: 'none',

      headerStyle: {
        // height: 40
      }
    }} 
  >

    {
      HomeScreensArr.map((obj, key:number)=>{
        return <Stack.Screen key={`home-screen-${key}`} 
          name={obj.name} component={obj.component} 

          options={({navigation})=>({
            
            

            headerShown: true,
            // headerTintColor: 'red',
            // header
            
            header: ()=> <StackHeader title="Billiards Hub" subtitle="Your source for the latest pool news and updates" type="centered-no-icon" />,

            headerStyle:{
              
              // backgroundColor: '#09090b',
              backgroundColor: StyleZ.colors.backgroundColor,
              // backgroundColor: 'red',

              // default height is 64px if is not set this good
              // height: 'auto',
              // height: 120,

            
          
            },
            // headerBackButtonMenuEnabled: false,
            headerBackVisible: false, // Ensures no default back button appears on the first screen

            title: 'home home',

          })}
          
          />
      })
    }

    {/*<Stack.Screen 
      name="LatestNews" component={ScreenHome} 
    
      options={({navigation})=>({
        
        headerShown: true,
        // header
        
        headerTitle: ()=> <StackHeader title="Billiards Hub" subtitle="Your source for the latest pool news and updates" />,
        headerStyle:{
          
          // backgroundColor: '#09090b',
          backgroundColor: StyleZ.colors.backgroundColor,
          // backgroundColor: 'red',

          // default height is 64px if is not set this good
          // height: 'auto',
          height: 120,
      
        },
        // headerBackButtonMenuEnabled: false,
        headerBackVisible: false, // Ensures no default back button appears on the first screen

        title: 'home home',

      })}
      
      />
    <Stack.Screen
      name="LatestNews" 
      component={latestNews}
      options={({navigation})=>({
        headerShown: true,
        title: 'Latest News'
      })}
      />*/}

  </Stack.Navigator>
}