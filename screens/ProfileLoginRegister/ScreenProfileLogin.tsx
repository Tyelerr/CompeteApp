import { Alert, Button, Text, View } from "react-native";
import ScreenScrollView from "../ScreenScrollView";
import LoginFormHeading from "../../components/LoginForms/LoginFormHeading";
import { StyleZ } from "../../assets/css/styles";
import LFInput from "../../components/LoginForms/LFInput";
import LFButton from "../../components/LoginForms/Button/LFButton";
import LFForgotPasswordLink from "../../components/LoginForms/LFForgotPasswordLink";
import { demoCreate } from "../../ApiSupabase/CrudDemo";
import { useState } from "react";
import { EInputValidation } from "../../components/LoginForms/Interface";
import { TheFormIsValid } from "../../hooks/Validations";
import { BasePaddingsMargins } from "../../hooks/Template";
import { SignIn } from "../../ApiSupabase/CrudUser";
import { ICrudUserData } from "../../ApiSupabase/CrudUserInterface";
import { ICAUserData, useContextAuth } from "../../context/ContextAuth";
import { EUserRole, EUserStatus } from "../../hooks/InterfacesGlobal";
// import { useNavigation } from "@react-navigation/native";

export default function ScreenProfileLogin(){

  const {
    login
  } = useContextAuth();

  // const navigation = useNavigation();

  const TryToLogin = async ()=>{
    // Alert.alert(process.env.EXPO_PUBLIC_SUPABASE_URL);
    // Alert.alert('before');
    // Alert.alert('after');
    // Alert.alert('data', data)
    // Alert.alert('error')
    // // // // // // // console.log('trying to login 5');
    if(!TheFormIsValid([
      {
        value: email,
        validations: [EInputValidation.Required]
      },
      {
        value: password,
        validations: [EInputValidation.Password]
      },
      // [email, [EInputValidation.Email]],
      // [password, [EInputValidation.Password]]
    ])){
      setErrorForm('Please enter your email address or username and password to log in.');
      // Alert.alert('error')
      return;
    }

    
    // const { data, demo } = await demoCreate();

    set_loading(true);
    const {
      user,
      data,
      error
    } = await SignIn({
      email: email,
      username: email,
      password: password
    } as ICrudUserData);

    // // // // // // // console.log('error while login:', error);

    // // // // // console.log('User after login: ', user);

    if(error!==null){
      // // // // // // // // // // console.log(error);
      if(error===EUserStatus.StatusDeleted){
        setErrorForm('Login failed. Please check your email and password.');
      }
      else{
        setErrorForm('Invalid login credentials');
      }
    }
    else{
      setErrorForm('');
      // // // // // // // // // // console.log('data after login: ', data);
      if(data!==null){
        
        // login( data as ICAUserData );
        login(user);

        // setTimeout(()=>{}, 100)

      }
    }
    set_loading(false);

  }

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorForm, setErrorForm] = useState<string>('');
  const [loading, set_loading] = useState<boolean>(false);

  return <ScreenScrollView>
    <View style={[
      StyleZ.loginFromContainer
    ]}>
      
      <LoginFormHeading title="Welcome back" subtitle="Enter your credentials below" />

      {
        errorForm!==''
        ?
        <View style={{
          justifyContent: 'center',
          marginBottom: BasePaddingsMargins.sectionMarginBottom
        }}>
          <Text style={[
            StyleZ.LFErrorMessage,
            StyleZ.LFErrorMessage_addon_centered
          ]}>{errorForm}</Text>
        </View>
        :
        null
      }
      

      <View style={[
        StyleZ.loginForm,
        {
          // borderColor: 'red',
          // borderWidth: 4,
          // borderStyle: 'solid',

          display: 'flex',
          // backgroundColor: 'green'
        }
      ]}>
        

        

        
        <LFInput 
          // keyboardType="email-address" 
          label="Email Address or Username"
          placeholder="Enter your email or username"
          onChangeText={(text:string)=>{
            setEmail(text);
            setErrorForm('')
          }}
          validations={[
            EInputValidation.Required,
            // EInputValidation.Email,
          ]}
          />
        <LFInput 
          isPassword={true} label="Password"
          placeholder="Enter your password"
          onChangeText={(text:string)=>{
            setPassword(text);
            setErrorForm('')
          }}
          validations={[
            EInputValidation.Required,
            EInputValidation.Password
          ]}
          />

          


        <View style={{
          marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
        }}>
          <LFButton 
          label="Sign in" 
          type="primary"
          loading={false}
          onPress={()=>{
            // Alert.alert('100');
            TryToLogin();
          }}
          />
        </View>

        <LFForgotPasswordLink label="Need an account? Register" route="ProfileRegister" />



      </View>

    </View>
  </ScreenScrollView>
}