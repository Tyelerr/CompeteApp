import { Text, View } from "react-native";
import LFButton from "../../LoginForms/Button/LFButton";
import UIPanel from "../UIPanel";
import { BasePaddingsMargins } from "../../../hooks/Template";
import { useEffect, useState } from "react";

export default function UICalendar(
  {
    currentDate,
    set_currentDate
  }
  :
  {
    // currentDate should be this format: 2025-01-25
    currentDate?:string,
    set_currentDate?:(d:string)=>void // d should be this format: 2025-01-25
  }
){

  const [dateForMonth, set_dateForMonth] = useState<Date>(new Date());
  const [dateSelected, set_dateSelected] = useState<Date>(new Date());

  // baseDate is the date for getting all the week days
  const getDayNames = (locale = 'en-US') => {
    const dayNames = [];
    // JavaScript's Date.getDay() returns 0 for Sunday, 1 for Monday, etc.
    // We'll create Date objects for a fixed week (e.g., first week of Jan 2023)
    // to reliably get all day names.
    // Jan 1, 2023 was a Sunday.
    const baseDate = new Date('2023-01-01T00:00:00'); // Start with a Sunday

    for (let i = 0; i < 7; i++) {
      // Create a new date for each day of the week
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);

      // Use toLocaleDateString to get the full weekday name
      dayNames.push(currentDate.toLocaleDateString(locale, { weekday: 'short' }));
    }
    return dayNames;
  };


  const setDateToFirstDayOfMonth = (date: Date): Date => {
    const newDate = new Date(date); // Create a new Date object to avoid modifying the original
    newDate.setDate(1); // Set the day of the month to 1
    newDate.setHours(0, 0, 0, 0); // Set time to the beginning of the day for consistency
    return newDate;
  }

  const setDateToPreviousSunday = (date: Date): Date => {
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const daysToSubtract = dayOfWeek; // Number of days to subtract to get to the previous Sunday.

    const newDate = new Date(date); // Create a new Date object
    newDate.setDate(date.getDate() - daysToSubtract);
    newDate.setHours(0, 0, 0, 0); // Set time to the beginning of the day
    return newDate;
  }

  // --- Combined Function ---
  const setDateToFirstDayOfMonthThenPreviousSunday = (date: Date): Date => {
    // Step 1: Set to the first day of the month
    const firstDayOfMonth = setDateToFirstDayOfMonth(date);

    // Step 2: Set that date back to the previous Sunday
    const previousSunday = setDateToPreviousSunday(firstDayOfMonth);

    return previousSunday;
  }

  /**
   * This function will get the date that start from sunday.
   * For example, if January start on Tuesday, this date should be December Sunday :)
   */
  const dateSetBackToFirstSunday = ():Date=>{
    return setDateToFirstDayOfMonthThenPreviousSunday(dateForMonth);
  }
  const dateSetBackToFirstSunday_DateNext = (dayNext:number):Date=>{
    const dateFirstSunday: Date = dateSetBackToFirstSunday();
    dateFirstSunday.setDate( dateFirstSunday.getDate()+dayNext );
    return dateFirstSunday;
  }

  const __SetNextMonth = (indexPlusMonth:number)=>{
    const newDate:Date = new Date(dateForMonth);
    newDate.setMonth(newDate.getMonth() + indexPlusMonth);
    set_dateForMonth(newDate);
  }


  useEffect(()=>{

  }, []);

  return <UIPanel size="for-calendar">
    
    
    
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: BasePaddingsMargins.m10
    }}>
      <View style={{
        width: 40
      }}>
        <LFButton icon="chevron-back" type="outline-dark" size="small" onPress={()=>{
          __SetNextMonth( -1 );
        }} />
      </View>
      <Text style={{
        color: 'white'
      }}>{dateForMonth.toLocaleDateString('en-US', {month:'long'})} {dateForMonth.getFullYear()}</Text>
      <View style={{
        width: 40
      }}>
        <LFButton icon="chevron-forward" type="outline-dark" size="small" onPress={()=>{
          __SetNextMonth(1)
        }} />
      </View>
    </View>

    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: BasePaddingsMargins.m5
    }}>
      {
        getDayNames().map((day, key:number)=>{
          return <View key={`short-day-of-the-week-${key}`} style={{
            width: `${100/7}%`,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              color: 'white'
            }}>{
              day.substring(0, 2)
            }</Text>
          </View>
        })
      }
    </View>

    {/*The days*/}
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }}>
      {
        Array.from({length: 35}).map((n, key)=>{

          const dateCurrent: Date = dateSetBackToFirstSunday_DateNext(key);
          // if(dateSelected.getFullYear())
          const iAmTheSelectedDate: boolean = (
            1 === 1
            && dateCurrent.getFullYear() === dateSelected.getFullYear()
            && dateCurrent.getMonth() === dateSelected.getMonth()
            && dateCurrent.getDate() === dateSelected.getDate()
          );
          const iAmInDifferentMonth: boolean = dateCurrent.getMonth() !== dateForMonth.getMonth();


          return <View key={`the-date-${key}`} style={{
            width: `${100/7}%`,
            /*borderColor: (dateCurrent.getMonth()===dateForMonth.getMonth()?'red':'green'),
            borderWidth: 1,
            borderStyle: 'solid',*/
            alignItems: 'center',
            justifyContent: 'center',
            marginBlock: BasePaddingsMargins.m5,
            paddingInline: 2,
            opacity: (iAmInDifferentMonth?.3:1)

          }}>
            <LFButton 
                size="small"
                type={(()=>{

                // if(iAmInDifferentMonth) return 'secondary';
                if(iAmTheSelectedDate) return 'primary';
                return 'dark';

              })()} 
              
              label={dateCurrent.getDate().toString()} 
              
              onPress={()=>{
                // // // // // // // // // // // console.log('dateCurrent:', dateCurrent);
                if(set_currentDate!==undefined){
                  const DateForMySQL:string = convertLocalJsDateToMysql(dateCurrent);
                  set_currentDate(DateForMySQL);
                  // // // // // // // // // // // console.log("DateForMySQL:", DateForMySQL);
                }
                set_dateSelected(dateCurrent);
              }} />
          </View>
        })
      }
    </View>


  </UIPanel>
}


export function convertLocalJsDateToMysql(jsDate:Date) {
  // Ensure it's a Date object
  if (!(jsDate instanceof Date)) {
    jsDate = new Date(jsDate);
  }

  // Get the timezone offset in minutes (e.g., -120 for UTC+2) and convert to milliseconds
  const timezoneOffsetMs = jsDate.getTimezoneOffset() * 60 * 1000;

  // Create a new Date object by adding the timezone offset back to the current date's UTC value.
  // This effectively sets the date to what it *would be* if it were UTC.
  const adjustedDate = new Date(jsDate.getTime() - timezoneOffsetMs);

  // Now, toISOString() on this adjustedDate will give the YYYY-MM-DD that matches your local day.
  // For DATETIME:
  return adjustedDate.toISOString().slice(0, 10);
}