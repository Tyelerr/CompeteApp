import { Text, View } from "react-native";
import { EInputValidation } from "../../components/LoginForms/Interface";
import LFInput from "../../components/LoginForms/LFInput";
import { BasePaddingsMargins } from "../../hooks/Template";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { useState } from "react";
import { TheFormIsValid } from "../../hooks/Validations";
import { SignUp } from "../../ApiSupabase/CrudUser";
import { ICAUserData } from "../../hooks/InterfacesGlobal";
import LoginFormHeading from "../../components/LoginForms/LoginFormHeading";
import { StyleZ } from "../../assets/css/styles";
import LFForgotPasswordLink from "../../components/LoginForms/LFForgotPasswordLink";
import { ICrudUserData } from "../../ApiSupabase/CrudUserInterface";

export default function FormCreateNewUser(
  {
    AfterRegisteringNewUser,
    type="for-register",
    EventAfterCloseTheForm
  }
  :
  {
    AfterRegisteringNewUser: (newUser:ICAUserData)=>void,
    type?: "for-register" | "for-administrator",
    EventAfterCloseTheForm?: ()=>void
  }
){
  

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, set_username] = useState<string>('');
  const [errorForm, setErrorForm] = useState<string>('');
  const [loading, set_loading] = useState<boolean>(false);

  

  const TryToRegister = async ()=>{
    // Alert.alert(process.env.EXPO_PUBLIC_SUPABASE_URL);
    // Alert.alert('before');
    // const { data, demo } = await demoCreate();
    // Alert.alert('after');
    // Alert.alert('data', data)
    if(!TheFormIsValid([
      {
        value: email,
        validations: [EInputValidation.Email]
      },
      {
        value: username,
        validations: [EInputValidation.Required, EInputValidation.Username]
      },
      {
        value: password,
        validations: [EInputValidation.Password]
      }
      // [email, [EInputValidation.Email]],
      // [password, [EInputValidation.Password]]
    ])){
      setErrorForm('Please enter your email address, username and password to register your account.');
      // Alert.alert('error')
      return;
    }

    set_loading(true);

    const { user, data, error } = await SignUp(
      {
        email: email,
        username: username,
        password: password
      } as ICrudUserData, 
      type==="for-administrator"?"create-user":"sign-up"
    );

    // // // // // // // console.log('error:', error);
    // // // // // console.log('data:', data);
    if(error as string === 'username-exist'){
      setErrorForm(`This username: "${username}" is already taken. Please choose a different one.`);
    }
    else if(error!==null){
      console.log('Error:', error);
      setErrorForm('Invalid registration credentials');
    }
    else{
      setErrorForm('');
      if(data!==null){
        // login(data.user as ICAUserData)
        // login(user as ICAUserData);
        AfterRegisteringNewUser( user as ICAUserData );
      }
    }
    set_loading(false);
  }


  return <>
  
  {
    type==='for-register'?
    <LoginFormHeading title="Welcome back" subtitle="Enter your credentials below" />
    :
    <LoginFormHeading title="New User Form" subtitle="Enter your credentials below and create the new user" />
  }

  
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

  <View style={StyleZ.loginForm}>
  <LFInput 
    keyboardType="email-address" label="Enter Email Address"
    onChangeText={(text)=>{
      setEmail(text);
      setErrorForm('');
    }}
    placeholder="Enter your email"
    validations={[
      EInputValidation.Email,
      EInputValidation.Required
    ]}
    />
  <LFInput 
    label="Username"
    onChangeText={(text)=>{
      set_username(text);
      setErrorForm('');
    }}
    placeholder="Enter your username"
    validations={[
      //EInputValidation.Email,
      EInputValidation.Required,
      EInputValidation.Username
    ]}
    />
  <LFInput 
    isPassword={true} label="Password"
    onChangeText={(text)=>{
      setPassword(text);
      setErrorForm('');
    }}
    placeholder="Enter your password"
    validations={[
      EInputValidation.Required,
      EInputValidation.Password
    ]}
    />
  <View style={{ 
    marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
  }}>
    <LFButton 
      label="Create account" 
      type="primary"
      loading={loading}
      onPress={()=>{
        // Alert.alert('100');
        TryToRegister();
      }}
      />
    {
      type==='for-administrator'?
        <View style={[
          {
            marginTop: BasePaddingsMargins.m10
          }
        ]}>
          <LFButton 
            label="Close the form" 
            type="outline-dark"
            // loading={loading}
            onPress={()=>{
              // Alert.alert('100');
              // TryToRegister();
              if(EventAfterCloseTheForm!==undefined){
                EventAfterCloseTheForm()
              }
            }}
            />
        </View>
      :
      null
    }
  </View>
  
  {
    type==='for-register'?
    <LFForgotPasswordLink label="Already have an account? Login" route="ProfileLogin" />
    :
    null
  }
  
  </View>
  </>
}