import { Alert, Text, View } from "react-native";
import ScreenScrollView from "../ScreenScrollView";
import LoginFormHeading from "../../components/LoginForms/LoginFormHeading";
import { StyleZ } from "../../assets/css/styles";
import LFInput from "../../components/LoginForms/LFInput";
import LFButton from "../../components/LoginForms/Button/LFButton";
import LFForgotPasswordLink from "../../components/LoginForms/LFForgotPasswordLink";
import { demoCreate } from "../../ApiSupabase/CrudDemo";
import { SignUp } from "../../ApiSupabase/CrudUser";
import { useState } from "react";
import { EInputValidation } from "../../components/LoginForms/Interface";
import { TheFormIsValid } from "../../hooks/Validations";
import { 
  // ICAUserData, 
  useContextAuth 
} from "../../context/ContextAuth";
import { BasePaddingsMargins } from "../../hooks/Template";
import { ICAUserData } from "../../hooks/InterfacesGlobal";
import FormCreateNewUser from "./FormCreateNewUser";



export default function ScreenProfileRegister(){


  const {
    login
  } = useContextAuth();

  return <ScreenScrollView>
    <View style={[
      StyleZ.loginFromContainer
    ]}>
      
      
      

      

        
        <FormCreateNewUser
          AfterRegisteringNewUser={(createdUser: ICAUserData)=>{
            login( createdUser )
          }}
        />



    </View>
  </ScreenScrollView>
}