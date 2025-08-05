import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert, Platform, StatusBar, Text, View } from "react-native";
import { TRootStackParamList, TRootTabParamList } from "./Interface";
import StackHome from "./StackHome";
import { BaseColors, BottomBarTab } from "../hooks/Template";
import { useEffect, useState } from "react";
import * as NavigationBar from 'expo-navigation-bar'; // This is the correct import after installation
import { Ionicons } from "@expo/vector-icons";
import { StyleZ } from "../assets/css/styles";
import StackProfileLoginRegister from "./StackProfileLoginRegister";
import { useContextAuth } from "../context/ContextAuth";
import StackAdmin from "./StackAdmin";
import ProfileLogged from "../screens/ProfileLogged/ProfileLoggedFavoriteTournaments";
import StackHeader from "./StackHeader";
import StackProfileAdmin from "./StackProfileAdmin";
import ScreenSubmit from "../screens/Submit/ScreenSubmit";
import StackSubmit from "./StackSubmit";
import ScreenFAQs from "../screens/FAQs/ScreenFAQs";
import StackBilliards from "./StackBilliards";
import { EUserRole, ICAUserData } from "../hooks/InterfacesGlobal";
import TabBarIconElement from "./TabBarIcon";
import CustomTabNavigator from "./CustomTabNavigator";
// import * as NavigationBar from 'https://cdn.jsdelivr.net/npm/expo-navigation-bar@3.0.0/build/NavigationBar.js';

// --- Type Definitions (for better TypeScript support) ---
// Define types for parameters that can be passed to stack screens




const CompTemp = function(){
  return <View><Text>Temporary Component  {Math.random()}</Text></View>
}




/*const StackTabContent = ()=>{
  return <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={CompTemp} options={{
      headerTitle: ()=>{
        return <View>
          <Text style={{}} accessibilityRole="header">Text 1 header</Text>
          <Text>Text 2 header</Text>
        </View>
      }
    }} />
  </Stack.Navigator>;
}*/


// const Stack = createNativeStackNavigator<TRootStackParamList>();
const Tab = createBottomTabNavigator<TRootTabParamList>();
const Stack = createNativeStackNavigator();


const NavigatorBarSettings = ()=>{
  if(Platform.OS === 'android'){
    // StatusBar.setBackgroundColor('red');
    // NavigationBar.setBackgroundColorAsync(BaseColors.backgroundColor); // Dark background for the system bar
    // NavigationBar.setButtonStyleAsync('light');
    // NavigationBar.

    // Set the style of the system navigation bar buttons (icons) to light
    // NavigationBar.setButtonStyleAsync('light');
  }
}

/*const StatusBarSettings = ()=>{
  return <StatusBar 
    barStyle={'light-content'} 
    backgroundColor={BaseColors.backgroundColor}
    translucent={true}
    />;
}*/

const TabScreenHome = ()=>{
  return <Tab.Screen 
  key={`tab-screen-HomeTab`}
  name="HomeTab" 
  options={{
    title:'Home',
    headerTitle: 'Home 2',
    // tabBarActiveBackgroundColor: BaseColors.contentSwitcherBackgroundCOlor,
    // tabBarActiveTintColor: BaseColors.title,

    // hidding the header because we have custom header
    headerShown: false,
    
    iconName:"home",

    tabBarIcon: ({ color, size, focused }) => {
      return <TabBarIconElement 
        focused={focused as boolean}
        icon={"home"}
      />}

  }}
  component={StackHome}
  // component={temporaryHomeComponent}
  />;
}
const temporaryHomeComponent = ()=>{
  return <Text style={{color: 'white'}}>This will be demo text</Text>
}
const TabScreenBilliards = ()=>{
  return <Tab.Screen 
  key={`tab-screen-BilliardsTab`}
  name="BilliardsTab" 
  options={{
    title: "Billiards",

    /*headerShown: true,
    header: ()=> <StackHeader 
              title="Billiards Tournaments" 
              subtitle="Browse all billiards tournaments by game type and location" type="centered-no-icon" />,*/
    
    iconName:"trophy",
    tabBarIcon: ({ color, size, focused }) => {
      return <TabBarIconElement 
        focused={focused as boolean}
        icon={"trophy"}
      />
    }
  }}
  component={StackBilliards} 
  />;
}
const TabScreenProfile = ()=>{
  return <Tab.Screen 
  key={`tab-screen-ProfileTab`}
  name="ProfileTab" 
  options={{
    title: "Profile",
    headerShown: false,
    
  
    iconName:"person",
    tabBarIcon: ({ color, size, focused }) => {
      return <TabBarIconElement 
        focused={focused as boolean}
        icon={"person"}
      />
    }
  }}
  component={StackProfileLoginRegister} 
  />
}
const TabScreenProfileLogged = ()=>{
  return <Tab.Screen 
  key={`tab-screen-ProfileLoggedTab`}
  name="ProfileLoggedTab" 
  options={{
    title: "Profile",
    headerShown: false,
    /*header: ()=>  <StackHeader 
      title="Profile" 
      subtitle="View and manage your tournament history" />,*/
    
  
    iconName:"person",
    tabBarIcon: ({ color, size, focused }) => {
      return <TabBarIconElement 
        focused={focused as boolean}
        icon={"person"}
      />
    }
  }}
  component={
    // ProfileLogged
    StackProfileAdmin
  } 
  />
}
const TabScreenAdmin = ()=>{
  return <Tab.Screen 
  key={`tab-screen-AdminTab`}
  name="AdminTab" 
  options={{
    title: "Admin",
    headerShown: false,
    
  
    iconName:"settings",
    tabBarIcon: ({ color, size, focused }) => {
      return <TabBarIconElement 
        focused={focused as boolean}
        icon={"settings"}
      />
    }
  }}
  component={StackAdmin} 
  />;
}
const TabScreenSubmit = ()=>{
  return <Tab.Screen 
  key={`tab-screen-SubmitTab`}
  name="SubmitTab" 
  options={{
    title: "Submit",
    headerShown: false, 
    /*header: ()=> <StackHeader 
      title="Bar Owner Dashboard" 
      subtitle="Manage users, tournaments, and system settings" />,*/
    
  
    iconName:"add-circle",
    tabBarIcon: ({ color, size, focused }) => {
      return <TabBarIconElement 
        focused={focused as boolean}
        icon={"add-circle"}
      />
    }
  }}
  component={StackSubmit} 
  />;
}
const TabScreenFAQTab = ()=>{
  return <Tab.Screen 
  key={`tab-screen-FAQTab`}
  name="FAQTab" 
  options={{
    title: "FAQ",
    
    headerShown: true,
    header: ()=> <StackHeader 
              title="Frequently Asked Questions" 
              subtitle="Find answers to common questions and get in touch with support" type="centered-no-icon" />,

    iconName:"help-circle",
    tabBarIcon: ({ color, size, focused }) => {
      // // console.log('Tab bar icon for: Frequently Asked Questions', focused);
      return <TabBarIconElement 
        focused={focused as boolean}
        icon={"help-circle"}
      />
    }
  }}
  component={ScreenFAQs} 
  />
}

const AppTabNavigatorLogged = (user:ICAUserData)=>{

  /*const {
    user
  } = useContextAuth();*/

  useEffect(()=>{
    
    NavigatorBarSettings();
    /*const navigation = useNavigation();
    setTimeout(()=>{
      navigation.navigate('AdminTab', {})
    }, 50)*/

  }, []);

  return (<>

  {
    // StatusBarSettings()
  }

    <Tab.Navigator
    tabBar={props => <CustomTabNavigator {...props} />} 
    key={`tab-navigator-logged`}
    initialRouteName={'HomeTab'}
    // initialRouteName={'BilliardsTab'}
    // initialRouteName={'AdminTab'}
    // initialRouteName={'ProfileLoggedTab'}
    screenOptions={({ route }) => ({

      /*headerBackgroundContainerStyle: {
        backgroundColor: BaseColors.backgroundColor
      },*/

      /*
      it is working but it is only for tab background
      tabBarBackground: () => (
        <View style={{ flex: 1, backgroundColor: 'darkgreen', borderRadius: 10 }} /> // Custom background component
      ),*/

      
      


      headerShown: false,
      // headerTitle: 
      headerStyle: {
        // height: 40,
      },


      // headerTintColor: 'red',

      // tabBarActiveBackgroundColor: BaseColors.contentSwitcherBackgroundCOlor,
      tabBarActiveTintColor: BaseColors.primary,
      tabBarStyle: {
        borderTopWidth: 1,
        // borderTopColor: 'red',
        borderColor: BaseColors.contentSwitcherBackgroundCOlor,
        // paddingBottom: 10,
        // backgroundColor: 'red',
        backgroundColor: BaseColors.backgroundColor,
        // height: 200
        paddingBottom: 0,
        paddingTop: 10,
        height: 110,
        
      },
      tabBarLabelStyle: {
        fontWeight: 'bold',
        fontSize: 12
      }, 
    
      // tabBut

    })}
  >
    {
    TabScreenHome()
    }
    {
    TabScreenBilliards()
    }
    {
    TabScreenSubmit()
    }
    {
      user?.role===EUserRole.MasterAdministrator?
      TabScreenAdmin()
      :
      null
    }
    {
    TabScreenProfileLogged()
    }
    {
    TabScreenFAQTab()
    }
  </Tab.Navigator>

  </>)
}
const AppTabNavigator = ()=>{
  
  /*const TabsDetails = [
    {tabName: 'Home'},
    {tabName: 'Billiards', title:'', component:CompTemp},
    {tabName: 'Profile', title:'', component:CompTemp},
    {tabName: 'FAQ', title:'', component:CompTemp}
  ];*/

  // const [userIsLogged, set_userIsLogged] = useState<boolean>(false);
  /*const {
    isLogged
  } = useContextAuth();*/
  

  useEffect(()=>{
    
    NavigatorBarSettings();

  }, []);

  

  return (<>

  {
    // StatusBarSettings()
  }
  

  <Tab.Navigator 
    key={`tab-navigator-not-logged`}
    tabBar={props => <CustomTabNavigator {...props} />} 
    initialRouteName={'HomeTab'}
    screenOptions={({ route }) => ({

      /*headerBackgroundContainerStyle: {
        backgroundColor: BaseColors.backgroundColor
      },*/

      /*
      it is working but it is only for tab background
      tabBarBackground: () => (
        <View style={{ flex: 1, backgroundColor: 'darkgreen', borderRadius: 10 }} /> // Custom background component
      ),*/

    

      headerShown: false,
      // headerTitle: 
      headerStyle: {
        // height: 40,
      },


      // headerTintColor: 'red',

      // tabBarActiveBackgroundColor: BaseColors.contentSwitcherBackgroundCOlor,
      tabBarActiveTintColor: BaseColors.primary,
      tabBarStyle: {
        borderTopWidth: 1,
        // borderTopColor: 'red',
        borderColor: BaseColors.contentSwitcherBackgroundCOlor,
        // paddingBottom: 10,
        // backgroundColor: 'red',
        backgroundColor: BaseColors.backgroundColor,
        // height: 200
        paddingBottom: 0,
        paddingTop: 10,
        height: 110,
        
      },
      tabBarLabelStyle: {
        fontWeight: 'bold',
        fontSize: 12
      }, 
    
      // tabBut

    })}
  >

    {TabScreenHome()}
    {TabScreenBilliards()}
    {TabScreenProfile()}
    {
      /*!isLogged
      ?
      TabScreenProfile()
      :
      null*/
    }
    {
      /*isLogged
      ?
      TabScreenAdmin()
      :
      null*/
    }
    
    {TabScreenFAQTab()}


    {
      /*TabsDetails.map((item, key:number)=>{
        return <Tab.Screen 
          name={item.tabName} 
          options={{title: "FAQ"}}
          component={CompTemp} 
          />
      })*/
    }
    

  </Tab.Navigator>

  </>);
}

export default function AppNavigator(){

  const {
    isLogged,
    user
  } = useContextAuth();

  useEffect(()=>{
    // // // // // // console.log('Appplication route');
  }, []);

  
  
  if(isLogged)return <NavigationContainer key={'logged-navigation-container'}>
    {
      AppTabNavigatorLogged(user as ICAUserData)
    }
  </NavigationContainer>
  else return <NavigationContainer key={'not-logged-navigation-container'}>
    {
      AppTabNavigator()
    }
  </NavigationContainer>
}