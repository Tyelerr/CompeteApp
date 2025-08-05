import { Alert, KeyboardTypeOptions, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import { StyleZ } from "../../assets/css/styles";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { EInputValidation, IPickerOption } from "./Interface";
import { EmailIsValid, NumberIsGreatThenZero, NumberIsGreatThenZero_ErrorMessage, PasswordIsValid, PasswordIsValid_ErrorMessage, UsernameIsValid } from "../../hooks/Validations";
import RNPickerSelect from 'react-native-picker-select';
import UICalendar from "../UI/UIDateTime/UICalendar";
import { SignIn } from "../../ApiSupabase/CrudUser";
import { CapitalizeWords } from "../../hooks/hooks";



 


export default function LFInput(
  {
    keyboardType,
    typeInput='default',
    label,
    isPassword,
    onChangeText,
    placeholder,
    validations=[],
    items=[],
    description="",
    defaultValue="",
    value,
    iconFront,
    textIconFront,
    marginBottomInit,
    onlyRead,
    capitalizeTheWords,
    pingValidation,
    // set_pingValidation
  }
  :
  {
    typeInput?:'default' | 'dropdown' | 'textarea' | 'calendar',
    keyboardType?:KeyboardTypeOptions,
    isPassword?:boolean,
    label?: string,
    onChangeText?: (v:string)=>void,
    placeholder?:string,
    validations?:EInputValidation[],
    items?:IPickerOption[]
    description?:string
    defaultValue?:string,
    value?:string,
    iconFront?:keyof typeof Ionicons.glyphMap,
    textIconFront?:string,
    marginBottomInit?:number,
    onlyRead?:boolean,
    capitalizeTheWords?:boolean,
    pingValidation?: boolean
  }
){

  const [passwordEyeOff, set_passwordEyeOff] = useState<boolean>(false);
  const [errorMessage, set_errorMessage] = useState<string>('');
  const [RNPickerSelectDefaultValue, set_RNPickerSelectDefaultValue] = useState<string>('');
  const [dropdownIndexSelected, set_dropdownIndexSelected] = useState<number>(-1);

  const [localValue, set_localValue] = useState<string>('');
  const [iCanCheckValidation, setICanCheckValidation] = useState<boolean>(false);

  useEffect(()=>{
    if(iCanCheckValidation)
    __CheckTheValidations(value!==undefined?value:localValue)
  }, [pingValidation]);
  useEffect(()=>{
    setICanCheckValidation(true);
  }, []);

  const _keyboardType = ()=>{
    // if(passwordEyeOff===true)return '';
    return (keyboardType!==undefined?keyboardType:'default');
  }

  
  const pickerRef = useRef(null);
  const handleArrowClick = () => {
    // This function will be called when the arrow is clicked
    if (pickerRef.current) {
      pickerRef.current.togglePicker(); // Programmatically open the picker
    }
  };

  /**
   * functions for validation
   */
  const __CheckTheValidations = (text:string)=>{
    for(let i=0;i<validations.length;i++){
      if(validations[i]===EInputValidation.Required && text===''){
        set_errorMessage(`This field is required. Local value: ${localValue}`);
        return;
      }
      else if(validations[i]===EInputValidation.Email && !EmailIsValid(text)){
        set_errorMessage('Please enter a valid email address.');
        return;
      }
      if(validations[i]===EInputValidation.Password && !PasswordIsValid(text)){
        set_errorMessage(PasswordIsValid_ErrorMessage(text));
        return;
      }
      if(validations[i]===EInputValidation.GreatThenZero && !NumberIsGreatThenZero(text)){
        set_errorMessage(NumberIsGreatThenZero_ErrorMessage());
        return;
      }
      if(validations[i]===EInputValidation.Username && !UsernameIsValid(text).valid){
        set_errorMessage(UsernameIsValid(text).message);
        return;
      }
    }
    set_errorMessage('');
  }

  const _input = ()=>{
    if(typeInput==='calendar'){
      return <UICalendar set_currentDate={onChangeText} />
    }
    else if(typeInput==='dropdown'){

      
      /*const languageOptions: IPickerOption[] = [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Python', value: 'python' },
        { label: 'Java', value: 'java' },
        { label: 'Swift', value: 'swift' },
      ];*/

      return <View style={{
      }}>
        <RNPickerSelect
        ref={pickerRef}
        // fixAndroidTouchableBug={true}
        value={defaultValue!==undefined && RNPickerSelectDefaultValue===''?defaultValue:RNPickerSelectDefaultValue}
        onValueChange={(value, index:number)=>{
          // console.log('index:', index);
          set_RNPickerSelectDefaultValue(value);
          if(onChangeText!==undefined)
            onChangeText(value);
          // Alert.alert(text);
          __CheckTheValidations(value);
          set_dropdownIndexSelected(index - 1)
        }}
        items={items}
        placeholder={placeholder!==''?{label:placeholder, value: ''}:{}}
        useNativeAndroidPickerStyle={false}
        style={{
          done:{
            color: BaseColors.light
          },
          modalViewTop:{
            // backgroundColor: 'red'
          },
          headlessAndroidContainer:{
            // backgroundColor: 'green'
          },
          modalViewMiddle:{
            // backgroundColor: 'green'
            backgroundColor: BaseColors.dark,
            borderTopColor: BaseColors.secondary
          },
          viewContainer:{
            backgroundColor: BaseColors.dark,
            // backgroundColor: 'red',
            paddingVertical: 0
          }
        }}
        dropdownItemStyle={{
          backgroundColor: BaseColors.dark,
          // backgroundColor: 'red',
          color: BaseColors.light
        }}
        
        activeItemStyle={{
          backgroundColor: BaseColors.secondary,
          color: BaseColors.light,
        }}
        
        Icon={()=>{
          return <Ionicons name="chevron-down" size={15} color={BaseColors.light} />
        }}

        pickerProps={{
          mode: 'dropdown',
          itemStyle:{
            color: BaseColors.light,
            backgroundColor: BaseColors.dark,
            // color: 'red',
            fontSize: TextsSizes.p,
          },
          
        }}
      >

        <TouchableOpacity onPress={handleArrowClick}
        style={[
          StyleZ.loginFormInput, ( _frontIconWidth()>0?{paddingLeft: _frontIconWidth()+5}:null ),
          {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            // backgroundColor: 'green',
            // paddingLeft: _frontIcon()!==null?BasePaddingsMargins.m35:0
          },
          (errorMessage!==''?{borderColor: BaseColors.danger}:null)
        ]}>
          {/* Main "input" area - can be a TouchableOpacity or View.
              If it's a TouchableOpacity with an onPress, it will take precedence
              over RNPickerSelect's default touchable behavior, effectively
              making the main area not open the picker UNLESS we specifically call togglePicker().
              Here, we don't call it, making it non-opening.
          */}
          <View style={{
            // backgroundColor: 'red',
          }}>
            <Text style={{
              color: BaseColors.othertexts,
              // backgroundColor: 'red',
              fontSize: TextsSizes.p
            }}>
              {/*value
                ? items.find((item) => item.value === (defaultValue!==undefined && RNPickerSelectDefaultValue===''?defaultValue:RNPickerSelectDefaultValue))?.label
                : placeholder*/}
              {
                (():string=>{
                  const text:string = defaultValue!==undefined && RNPickerSelectDefaultValue===''?defaultValue:RNPickerSelectDefaultValue;

                  // console.log('picker select items:', items);

                  if(items[dropdownIndexSelected]===undefined && placeholder!=='' && placeholder!==undefined){
                    return placeholder;
                  }
                  if(items.length>0 && items[dropdownIndexSelected]!==undefined && items[dropdownIndexSelected].label!==''){
                    return items[dropdownIndexSelected].label;
                  }
                  if(text!=='')return text;
                  if(text==='' && placeholder!==undefined)return placeholder;
                  return '';
                })()
              }
            </Text>
          </View>

          {/* The Arrow Icon - ONLY THIS WILL OPEN THE PICKER */}
          <View  >
            <Ionicons name="chevron-down" size={TextsSizes.p} color={BaseColors.othertexts} />
          </View>

        </TouchableOpacity>

      </RNPickerSelect>
      </View>
    }
    if(typeInput==='textarea'){
      
      return <TextInput 
        returnKeyType="done"
        keyboardAppearance="dark"
        multiline={true}
        numberOfLines={6}
        textAlignVertical="top"
        keyboardType={
          // "numeric"
          _keyboardType()
          
        }
        // (_keyboardType()==='phone-pad'?textContentType="")
        // textContentType=""
        secureTextEntry={isPassword===true && !passwordEyeOff}
        value={value}
        defaultValue={defaultValue}
        onBlur={(text)=>{
        
        }}
        onChangeText={(text)=>{
          if(onChangeText!==undefined)
            onChangeText(text);
          // Alert.alert(text);
          __CheckTheValidations(text);
        }}
        placeholder={placeholder!==undefined?placeholder:''}
        placeholderTextColor={BaseColors.othertexts}
        style={[
          StyleZ.loginFormInput,
          StyleZ.loginFormInput_Textarea,
          (errorMessage!==''?{borderColor: BaseColors.danger}:null)
        ]} />;
    }
    if(_keyboardType()==='phone-pad'){
      return <TextInput 
        returnKeyType="done"
        keyboardAppearance="dark"
        multiline={false}
        readOnly={onlyRead===true}
        keyboardType={
          // "numeric"
          _keyboardType()
        }

        textContentType="telephoneNumber" // iOS autofill hint
        autoComplete="tel" // Android autofill hint
        dataDetectorTypes="phoneNumber" // Detects phone numbers for tap-to-call
        returnKeyType="done" // Changes the return key to 'Done'

        secureTextEntry={isPassword===true && !passwordEyeOff}
        value={value}
        defaultValue={defaultValue}
        onBlur={(text)=>{
        
        }}
        onChangeText={(text)=>{
          if(onChangeText!==undefined)
            onChangeText(text);
          // Alert.alert(text);
          __CheckTheValidations(text);
        }}
        placeholder={placeholder!==undefined?placeholder:''}
        placeholderTextColor={BaseColors.othertexts}
        style={[
          StyleZ.loginFormInput,
          ( _frontIconWidth()>0?{paddingLeft: _frontIconWidth()+5}:null ),
          (errorMessage!==''?{borderColor: BaseColors.danger}:null)
        ]} />;
    }
    return <TextInput 
      returnKeyType="done"
      keyboardAppearance="dark"
      multiline={false}
      readOnly={onlyRead===true}
      keyboardType={
        // "numeric"
        _keyboardType()
      }
      
      secureTextEntry={isPassword===true && !passwordEyeOff}
      value={value}
      defaultValue={defaultValue}
      onBlur={(text)=>{
        if(value!==undefined && value !=='' && onChangeText!==undefined && capitalizeTheWords===true){
          onChangeText( CapitalizeWords(value) );
        }
      }}
      onChangeText={(text)=>{
        
        if(onChangeText!==undefined){
          onChangeText(text);
        }
        set_localValue(localValue)
        // Alert.alert(text);
        __CheckTheValidations(text);
      }}
      placeholder={placeholder!==undefined?placeholder:''}
      placeholderTextColor={BaseColors.othertexts}
      style={[
        StyleZ.loginFormInput,
        ( _frontIconWidth()>0?{paddingLeft: _frontIconWidth()+5}:null ),
        ( onlyRead===true?StyleZ.loginFormInput_onlyRead:null ),
        (errorMessage!==''?{borderColor: BaseColors.danger}:null)
      ]} />;
  }

  const _TheEyeButton = ()=>{
    
    return <TouchableOpacity onPress={()=>{
      set_passwordEyeOff(!passwordEyeOff);
    }} style={{
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingInline: 15,
      backgroundColor: 'transparent'
    }}>
      <Ionicons style={{
        color: BaseColors.othertexts,
        fontSize: 15
      }} name={passwordEyeOff===true?'eye-off':'eye'} />
    </TouchableOpacity>
  }

  const _frontIconWidth = ()=>{
    if(iconFront!==undefined || textIconFront!==undefined){
      return BasePaddingsMargins.m35;
    }
    return 0;
  }
  const _frontIcon = ()=>{
    if(iconFront!==undefined || textIconFront!==undefined){
      return <View style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'flex-end',
        paddingRight: BasePaddingsMargins.m5,
        pointerEvents: 'none',
        left: 0,
        top:0,
        width: _frontIconWidth(),
        height: '100%',
        // backgroundColor: 'red',
        zIndex: 100,
        // backgroundColor: 'red'
      }}>
        {
          textIconFront!==undefined?
          <Text style={{
            fontSize: TextsSizes.p,
            fontWeight: 'bold',
            color: BaseColors.othertexts,
            paddingRight: 3
          }}>{textIconFront}</Text>
          :
          <Ionicons name={iconFront} size={TextsSizes.p} color={BaseColors.othertexts} />
        }
        
      </View>
    }
    return null;
  }

  return <View style={[
    StyleZ.loginFormInputHolder,
    (marginBottomInit!==undefined?{marginBottom: marginBottomInit}:null),
    (onlyRead===true?StyleZ.loginFormInputHolder_onlyRead:null)
  ]}>
    {
      label!==undefined?
       <Text style={StyleZ.loginFormInputLabel}>{label}</Text>
       :
       null
    }
   
    <View style={{
      position: 'relative'
    }}>

      {
        _frontIcon()
      }

      {
        _input()
      }

      
      {
        isPassword===true?
        _TheEyeButton()
        :
        null
      }
    </View>
    {
      description!==undefined && description!==""
      ?
      <Text style={[
        StyleZ.loginFormInputLabel,
        {
          fontWeight: 'regular',
          fontSize: TextsSizes.p,
          paddingTop: BasePaddingsMargins.m5,
          width: '100%'
        }
      ]}>{description}</Text>
      :
      null
    }
    {
      errorMessage!==''
      ?
      <Text style={StyleZ.LFErrorMessage}>{errorMessage}</Text>
      :
      null
    }

    {
      /*onlyRead===true?
      <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        // backgroundColor: 'red'
      }}></View>
      :
      null*/
    }

  </View>
}