import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BaseColors, BasePaddingsMargins, TextsSizes } from '../../hooks/Template';
import { StyleZ } from '../../assets/css/styles';

interface LFDaysOfTheWeekProps {
  /**
   * Optional: Style for the main container View.
   */
  containerStyle?: object;
  /**
   * Optional: Style for each individual day Text component.
   */
  dayTextStyle?: object;
  /**
   * Optional: Style for the active/current day Text component.
   */
  activeDayTextStyle?: object;
  /**
   * Optional: The index of the active day (0 for Monday, 1 for Tuesday, etc.).
   * If provided, that day will have activeDayTextStyle applied.
   */
  activeDayIndex?: number;
  /**
   * Optional: Callback function when a day is pressed.
   * Receives the day's letter (e.g., 'M') and its index (0-6).
   */
  onDayPress?: (dayLetter: string, index: number) => void;


  set_selectedDaysOut?: (daysIndexes:number[])=>void;
  selectedDaysOut?: number[]
}

const LFDaysOfTheWeek: React.FC<LFDaysOfTheWeekProps> = ({
  containerStyle,
  dayTextStyle,
  activeDayTextStyle,
  activeDayIndex,
  onDayPress,
  set_selectedDaysOut,
  selectedDaysOut
}) => {
  // Array of single letters for days of the week, starting from Monday
  const days = ['M', 'T', 'W', 'T', 'F', 'Sa', 'Su']; // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

  const [selectedDays, set_selectedDays] = useState<number[]>(selectedDaysOut!==undefined?selectedDaysOut:[]);

  // // // // // console.log('selectedDaysOut 2 inside LFDaysOfTheWeek:', selectedDaysOut);

  const __selectedDays = ():number[]=>{
    return (selectedDaysOut!==undefined?selectedDaysOut:selectedDays);
  }

  useEffect(()=>{
    // // // // // console.log('selectedDaysOut inside LFDaysOfTheWeek:', selectedDaysOut);
  }, [])

  return (
    <View style={[
      {
        marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
      }
    ]}>
      <Text style={StyleZ.loginFormInputLabel}>Days of Week</Text>
      <View style={[stylesLocalDaysOfWeek.container, containerStyle]}>
      {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              stylesLocalDaysOfWeek.touchableDay,
              __selectedDays().indexOf(index+1)!==-1 && stylesLocalDaysOfWeek.activeDayText
            ]} // Apply a base style for touchable area
            onPress={() => {
              if(onDayPress!==undefined){
                onDayPress(day, index);
              }
              if(__selectedDays().indexOf(index+1)!==-1){
                __selectedDays().splice(selectedDays.indexOf(index+1), 1);
              }
              else{
                __selectedDays().push(index+1);
              }
              set_selectedDays([...__selectedDays()]);
              if(set_selectedDaysOut!==undefined)
              set_selectedDaysOut([...__selectedDays()]);
            }}
            activeOpacity={0.7} // Opacity effect when pressed
          >
            <Text
              style={[
                stylesLocalDaysOfWeek.dayText,
                dayTextStyle,
                // activeDayIndex === index && stylesLocalDaysOfWeek.activeDayText, // Apply active style if index matches
                // activeDayIndex === index && activeDayTextStyle, // Apply custom active style
                __selectedDays().indexOf(index+1)!==-1 && stylesLocalDaysOfWeek.activeDayText,
                {
                  backgroundColor: 'transparent'
                }
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const stylesLocalDaysOfWeek = StyleSheet.create({
  container: {
    flexDirection: 'row', // Arrange days horizontally
    justifyContent: 'space-between', // Distribute space evenly
    alignItems: 'center',
    width: '100%', // Take full width of parent
    // paddingVertical: 10,
    backgroundColor: BaseColors.dark,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  touchableDay: {
    // This style ensures the touchable area is consistent
    width: 30, // Fixed width for each day to ensure even spacing
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderColor: BaseColors.othertexts,
    borderWidth: 1,
    borderRadius: 5,
    paddingBlock: BasePaddingsMargins.m5
  },
  dayText: {
    fontSize: TextsSizes.small,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  activeDayText: {
    color: BaseColors.light, // Default active color (blue)
    backgroundColor: BaseColors.primary,
    fontWeight: '900',
    // You can add more styles here for active day, e.g., underline, background
  },
});

export default LFDaysOfTheWeek;
