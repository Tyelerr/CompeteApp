import { Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import UIModalCloseButton from "../../components/UI/UIModal/UIModalCloseButton";
import { StyleModal, StyleZ } from "../../assets/css/styles";
import LFInput from "../../components/LoginForms/LFInput";
import LFInputsGrid, { ILFInputGridInput } from "../../components/LoginForms/LFInputsGrid";
import { useEffect, useState } from "react";
import LFButton from "../../components/LoginForms/Button/LFButton";
import { InsertContent, UpdateContent } from "../../ApiSupabase/CrudCustomContent";
import { ECustomContentType, ICustomContent } from "../../hooks/InterfacesGlobal";
import AttachImage from "../../components/UI/Attach/AttachImage";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getLocalTimestampWithoutTimezone } from "../../hooks/hooks";
// import AttachImage from "../../components/UI/Attach/AttachImage";
// import AttachImageSingle from "../../components/LoginForms/Attach/AttachImageSingle";

export default function ModalEditorContentRewards(

  {
    isOpened,
    F_isOpened,
    type,
    data_row,
    set_data_row,
    editOrCreate,
    afterCreatingNewGift,
    afterUpdatingTheGift
  }
  :
  {
    isOpened: boolean,
    F_isOpened: (b: boolean)=>void,
    type:ECustomContentType,
    data_row: ICustomContent | null,
    set_data_row: (cc:ICustomContent)=>void
    editOrCreate?: 'edit' | 'create-new',
    afterCreatingNewGift?: ()=>void,
    afterUpdatingTheGift?: ()=>void
  }

){

  const [name, set_name] = useState<string>('');
  const [subtitle, set_subtitle] = useState<string>('');
  const [value, set_value] = useState<number>('');
  const [label_about_the_person, set_label_about_the_person] = useState<string>('');
  const [address, set_address] = useState<string>('');
  const [description, set_description] = useState<string>('');
  const [features, set_features] = useState<string>('');
  const [giveawy_rules, set_giveawy_rules] = useState<string>('');
  const [date_ends, set_date_ends] = useState<Date>( new Date() );

  const [list, set_list] = useState<ILFInputGridInput[][]>([]);
  const [labels, set_labels] = useState<ILFInputGridInput[][]>([]);

  const [phone_number, set_phone_number] = useState<string>('');

  const [reward_picture, set_reward_picture] = useState<string>('');
  const [reward_link, set_reward_link] = useState<string>('');
  const [entries, set_entries] = useState<number>(0);

  const [loading, set_loading] = useState<boolean>(false);


  const __dataForSupabase = ():ICustomContent=>{
    return {
      type: type,
      name: name,
      label_about_the_person: label_about_the_person,
      address: address,
      description: description,
      list: list,
      labels: labels,
      phone_number: phone_number,

      value: value,
      features: features, 
      giveawy_rules: giveawy_rules,
      subtitle: subtitle,
      reward_link: reward_link,
      reward_picture: reward_picture,

      entries: entries,

      date_ends: getLocalTimestampWithoutTimezone(date_ends)

    } as ICustomContent;
  }
  const ___CreateTheReward = async ()=>{

    set_loading(true);
    
    const newContent: ICustomContent =__dataForSupabase();

    const {
      data, error
    } = await InsertContent( newContent );
    set_data_row( newContent );

    set_loading(false);
    F_isOpened(false)

    if(afterCreatingNewGift!==undefined){
      afterCreatingNewGift()
    }
  }
  const ___UpdateTheReward = async ()=>{

    if(data_row===null)return;

    set_loading(true);
    
    const updatedContent: ICustomContent =__dataForSupabase();
    // // console.log('updatedContent:', updatedContent);

    const {
      data, error
    } = await UpdateContent( updatedContent, data_row?.id );
    set_data_row( updatedContent );

    // // console.log('Updating the reward result');
    // // console.log(data, error);

    set_loading(false);

    F_isOpened(false)

    if(afterUpdatingTheGift!==undefined){
      afterUpdatingTheGift()
    }
  }

  
  useEffect(()=>{
    if(data_row!==null){
      const dataFor:ICustomContent = data_row as ICustomContent;
      set_name( dataFor.name );
      set_label_about_the_person( dataFor.label_about_the_person );
      set_address( dataFor.address );
      set_description( dataFor.description );
      set_list( dataFor.list );
      set_labels( dataFor.labels );
      set_phone_number( dataFor.phone_number );

      set_reward_picture( dataFor.reward_picture );
      set_reward_link( dataFor.reward_link );


      set_entries( dataFor.entries!==null?dataFor.entries:0 );


      set_subtitle( dataFor.subtitle!==null?dataFor.subtitle:'' );
      set_value( dataFor.value!==null?dataFor.value:0 );
      set_features( dataFor.features!==null?dataFor.features:'' );
      set_giveawy_rules( dataFor.giveawy_rules!==null?dataFor.giveawy_rules:'' );
      set_date_ends( dataFor.date_ends!==null?new Date( dataFor.date_ends ): new Date() );
    }
  }, [ isOpened ]);

  return <Modal
      animationType="fade"
      transparent={true}
      visible={isOpened}
    >
      <View style={[
          StyleModal.container
        ]}>


        <TouchableOpacity 
          style={[StyleModal.backgroundTouchableForClosing]} 
          onPress={()=>{
          F_isOpened(false)
        }} />

        <View style={[
          StyleModal.containerForScrollingView,
        ]}>
  
  
          <ScrollView style={[
            StyleModal.scrollView,
            /*{
              maxHeight: '100%',
              // height: '50%',
  
              // backgroundColor: 'red'
            }*/
          ]}>

            <View style={[
              StyleModal.contentView
            ]}>
  
              <UIModalCloseButton F_isOpened={F_isOpened} />


              <View style={[
                StyleModal.headingContainer
              ]}>
                <Text style={[
                  StyleModal.heading
                ]}>Reward Editor</Text>
              </View>

              <LFInput label="Title" placeholder="Enter Title" value={name} onChangeText={set_name} />
              <LFInput label="Subtitle" placeholder="Enter Subtitle" value={subtitle} onChangeText={set_subtitle} />
              {
                // <LFInput label="Date ends" placeholder="Ente" value={subtitle} onChangeText={set_subtitle}  />
              }

              <View style={{
                marginBottom: BasePaddingsMargins.formInputMarginLess
              }}>
                <Text style={[
                  StyleZ.p,
                  {
                    marginBottom: BasePaddingsMargins.m5
                  }
                ]}>Date Ends</Text>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date_ends}
                  mode="date" // Can be 'date', 'time', or 'datetime' (iOS only)
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 'spinner' or 'calendar' for iOS; 'default' or 'spinner' for Android
                  onChange={(event, selectedDate)=>{
                    // // console.log("selectedDate:", selectedDate);
                    set_date_ends( selectedDate as Date );
                  }}
                  // minDate={new Date(2000, 0, 1)} // Optional: Set minimum selectable date
                  // maxDate={new Date()} // Optional: Set maximum selectable date (e.g., today)
                />
              </View>

              

              <LFInput label="Value" placeholder="Enter Value" value={value.toString()} onChangeText={(s:string)=>{
                set_value(Number(s))
              }} keyboardType="number-pad" />
              <LFInput label="Entries" placeholder="Enter Entries" value={entries.toString()} onChangeText={(s:string)=>{
                set_entries(Number(s))
              }} keyboardType="number-pad" />


              {/*<LFInput label="Label Hero About" placeholder="Enter Hero Label" value={label_about_the_person} onChangeText={set_label_about_the_person} />
              <LFInput label="Address" placeholder="Enter Address" value={address} onChangeText={set_address} />*/}
              <LFInput label="Description" placeholder="Enter Description" typeInput="textarea" value={description} onChangeText={set_description} />
              <LFInput label="Features" placeholder="Enter Features" typeInput="textarea" value={features} onChangeText={set_features} description="Each new line is another item" />
              <LFInput label="Giveawy Rules" placeholder="Enter Giveawy Rules" typeInput="textarea" value={giveawy_rules} onChangeText={set_giveawy_rules} description="Each new line is another item" />

             <>
              <LFInput label="Reward Photo URL" placeholder="Enter Reward Photo URL" value={reward_picture} onChangeText={set_reward_picture} description="If you don't attach custom photo you can add url here for the reward picture." />
              {
              // <AttachImageSingle />
              }
              <Text style={{
                            color: BaseColors.othertexts,
                            // backgroundColor: 'red',
                            fontSize: TextsSizes.p,
                            marginBottom: BasePaddingsMargins.m5
                          }}>
                Reward Picture    
              </Text>
              <AttachImage 
                // set_thumbnailType={}
                set_thumbnailType={(t:string)=>{}}
                set_thumbnail_url={(url: string)=>{
                  // console.log('url: ', url)
                  set_reward_picture(url)
                }}
                onStartAttaching={()=>{
                  set_loading(true)
                }}
                onEndAttaching={()=>{
                  set_loading(false)
                }}
                defaultUrl={reward_picture}
              />
              <LFInput iconFront="link" label="Reward Link" placeholder="Enter Reward Link" value={reward_link} onChangeText={set_reward_link} />
            </>

              
              {/*<LFInputsGrid 
                label="List Items" 
                labelAdd="Add Item"
                inputs={[
                  {label:"Text Item", placeholder: 'Enter Item Text'},
                ]}
                rows_data={list}
                set_rows_data={set_list}
                />


              <LFInputsGrid 
                label="List Labels" 
                labelAdd="Add Label"
                inputs={[
                  {label:"Text Label", placeholder: 'Enter Label Text'},
                ]}
                rows_data={labels}
                set_rows_data={set_labels}
                />*/}

              {/*<LFInput label="Phone Number" placeholder="Enter Phone Number" keyboardType="phone-pad" value={phone_number} onChangeText={set_phone_number} />*/}


              {
                editOrCreate==='create-new'?
                  <LFButton 
                    loading={loading}
                    label="Create The Reward" icon="add" type="primary" onPress={()=>{
                    ___CreateTheReward()
                  }} />
                  :
                  <LFButton 
                    loading={loading}
                    label="Update The Reward" type="primary" onPress={()=>{
                    ___UpdateTheReward()
                  }} />
              }


            </View>
            </ScrollView>
            </View>
            </View>
            </Modal>
}