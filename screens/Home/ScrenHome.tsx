import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenScrollView from "../ScreenScrollView";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";
import ContentSwitcher from "../../components/ContentSwitcher";
import ScreenHomeSubNavigation from "./ScreenHomeSubNavigation";
import UIPanel from "../../components/UI/UIPanel";
import { Ionicons } from "@expo/vector-icons";
import { StyleZ } from "../../assets/css/styles";
import { useEffect, useState } from "react";
import { XMLParser } from 'fast-xml-parser'; 

interface INewsFeed{
  category:{
    __cdata: string
  }[],
  "dc:creator":{
    __cdata: string
  },
  description:{
    __cdata: string
  },
  link: string,
  pubDate: string,
  title: string
}

export default function ScreenHome(){

  const [itemsNews, set_itemsNews] = useState<INewsFeed[]>([]);


  const __FetchTheFeed = async ()=>{
    // https://www.azbilliards.com/feed/

    try {
    const response = await fetch('https://www.azbilliards.com/feed/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const xmlText = await response.text(); // Get the response as plain text
      // // // // console.log( xmlText );

      const options = {
        ignoreAttributes: false, // Keep attributes
        attributeNameProcessors: [
          (name) => name.replace(':', '_') // Optional: transform attribute names (e.g., media:thumbnail to media_thumbnail)
        ],
        allowBooleanAttributes: true,
        parseNodeValue: true,
        parseAttributeValue: true,
        cdataPropName: "__cdata", // If you want to keep CDATA as a distinct property
        // Other options you might find useful:
        // stopNodes: ["item.description"] // To prevent parsing content inside specific tags
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlText);
      // // // // console.log('result:', result);
      // // // console.log('result.rss.channel.item:', result.rss.channel.item);
      // for(let i in result.rss)// // // console.log(`result.rss${i}:`, result.rss[i]);
      for(let i =0;i<result.rss.channel.item.length;i++){
        // // // console.log(result.rss.channel.item[i]);
      }
      set_itemsNews(result.rss.channel.item as INewsFeed[])

      // return xmlText;
    } catch (error) {
      console.error("Failed to fetch XML feed:", error);
      throw error; // Re-throw to handle it further up
    }

  }

  const __OpenTheExternalLink = async (url:string)=>{
    // const url = 'https://www.example.com'; // Your external URL
    
    try {
      const supported = await Linking.canOpenURL(url); // Check if the URL can be opened
      // // // console.log('supported:', supported);

        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
      } catch (error) {
        console.error('An error occurred', error);
        Alert.alert('Failed to open link.');
    }
  }

  useEffect(()=>{
    __FetchTheFeed();
  }, []);


  return <ScreenScrollView>

    {/*<ContentSwitcher buttonsDetails={[
      {
        title: 'Latest News'
      },
      {
        title: 'Player Spotlight'
      },
      {
        title: 'Bar of the Month'
      },
    ]} />*/}

    <ScreenHomeSubNavigation />

    <View style={{
    }}>
      {
      itemsNews.map((news:INewsFeed, key:number)=>{
        return <UIPanel key={`panel-news-${key}`}>
          <View style={[
            {
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }
          ]}>
            <View style={{
              width: '10%'
            }}>
              <Ionicons name="star-outline" style={{
                fontSize: TextsSizes.h1,
                color: BaseColors.warning
              }} />
            </View>
            <View style={{
              width: '88%'
            }}>
              <Text style={[
                StyleZ.h2
              ]}>{news.title}</Text>
              <Text style={[
                StyleZ.p,
                {
                  marginBottom: BasePaddingsMargins.m20
                }
              ]}>{news.description.__cdata.substring(0, 200)}{news.description.__cdata.length>200?'...':''}</Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start'
                }}>
                  <Text style={[
                    StyleZ.p,
                    {
                      marginRight: BasePaddingsMargins.m10
                    }
                  ]}>{news["dc:creator"].__cdata}</Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                  }}>
                    <Ionicons name="time" style={[
                      StyleZ.p,
                      {
                        marginRight: BasePaddingsMargins.m5,
                        marginBottom: 0
                      }
                    ]} />
                    <Text style={[
                      StyleZ.p,
                      {
                        marginBottom: 0
                      }
                    ]}>{news.pubDate.split(' 20')[0]}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={()=>{
                  __OpenTheExternalLink( news.link )
                }}>
                  <Ionicons name="open" style={[
                    {
                      color: BaseColors.success,
                      fontSize: TextsSizes.h1
                    }
                  ]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </UIPanel>
      })
      }
    </View>

  </ScreenScrollView>


}