import { useNavigation, useRoute } from "@react-navigation/native";
import LFInput from "../../components/LoginForms/LFInput";
import { useEffect } from "react";
import { Alert, View } from "react-native";
import ContentSwitcher from "../../components/ContentSwitcher";
import { BasePaddingsMargins } from "../../hooks/Template";

export default function ScreenAdminDropdownNavigation(){

  /*const AdminSubRoutes = [
    {label: '\uf425 Users 2',value: 'AdminUsers'},
    {label: 'Pending',value: 'AdminPending'},
    {label: 'Approved',value: 'AdminApproved'},
    {label: 'Deleted',value: 'AdminDeleted'},
    {label: 'My Bar',value: 'AdminAnalytics'},
  ];*/

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(()=>{
    // // // // // // console.log('route.name:', route.name);
  }, []);

  return <View style={[
    {
      marginBottom: BasePaddingsMargins.m20
    }
  ]}>
    {/*<LFInput 
      typeInput="dropdown"
      items={AdminSubRoutes}
      defaultValue={route.name}
      placeholder={""}
      value={route.name}
      onChangeText={(v)=>{
        // Alert.alert('123')
        navigation.navigate(v, {});
      }}
    />*/}
    <ContentSwitcher
      buttonsDetails={[
        {title:'Users', route:"AdminUsers", icon:'person'},
        {title:'Pending', route:"AdminPending", icon:'trophy'},
        {title:'Approved', route:"AdminApproved", icon:'checkmark'},
        /*{title:'Deleted', route:"AdminDeleted", icon:'remove'},
        {title:'My Bar', route:"AdminAnalytics", icon:'bar-chart'},*/
      ]}
    />
    <ContentSwitcher
      buttonsDetails={[
        /*{title:'Users', route:"AdminUsers", icon:'person'},
        {title:'Pending', route:"AdminPending", icon:'trophy'},
        {title:'Approved', route:"AdminApproved", icon:'checkmark'},*/
        {title:'Deleted', route:"AdminDeleted", icon:'trash'},
        {title:'My Tournaments', route:"AdminAnalytics", icon:'bar-chart'},
        {title:'Messages', route:"AdminMessages", icon:'mail'},
      ]}
    />
  </View>
}