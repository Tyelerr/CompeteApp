import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation, // Used for smooth animations
  Platform,        // To check platform
  UIManager      // To enable LayoutAnimation on Android
} from 'react-native';
import { BaseColors, BasePaddingsMargins, TextsSizes } from '../../../hooks/Template';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Still using this for the arrow icon, as it's a common practice.
                                                      // If you want *truly* no libraries, you'd use plain Text for +/-.

// Enable LayoutAnimation for Android (this is crucial for animations on Android)
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Sample Data for the Accordion ---
/*const ACCORDION_ITEMS = [
  {
    id: 'a1',
    title: 'What is Native Development?',
    content: 'Native development involves building applications specifically for one platform (e.g., iOS using Swift/Objective-C, Android using Java/Kotlin). These apps typically offer the best performance and access to all device features.',
  },
  {
    id: 'a2',
    title: 'What is Cross-Platform Development?',
    content: 'Cross-platform development allows you to write code once and deploy it on multiple platforms (e.g., React Native, Flutter, Xamarin). This saves time and resources but might have limitations in accessing platform-specific features directly.',
  },
  {
    id: 'a3',
    title: 'When to choose which?',
    content: 'Choose native for high-performance, complex animations, or deep hardware integration. Choose cross-platform for faster development, wider audience reach, and shared codebase.',
  },
  {
    id: 'a33',
    title: 'When to choose which?',
    content: 'Choose native for high-performance, complex animations, or deep hardware integration. Choose cross-platform for faster development, wider audience reach, and shared codebase.',
  },
  {
    id: 'a4',
    title: 'When to choose which?',
    content: 'Choose native for high-performance, complex animations, or deep hardware integration. Choose cross-platform for faster development, wider audience reach, and shared codebase.',
  },
  {
    id: 'a5',
    title: 'When to choose which?',
    content: 'Choose native for high-performance, complex animations, or deep hardware integration. Choose cross-platform for faster development, wider audience reach, and shared codebase.',
  },
  {
    id: 'a6',
    title: 'When to choose which?',
    content: 'Choose native for high-performance, complex animations, or deep hardware integration. Choose cross-platform for faster development, wider audience reach, and shared codebase.',
  },
];*/

// --- MyCustomAccordion Component ---
const ZAccordion = (
  {
    ACCORDION_ITEMS
  }
  :
  {
    ACCORDION_ITEMS:{
      title: string,
      content: string
    }[]
  }
) => {
  // State to hold the ID of the currently active (open) section.
  // Using an ID ensures unique identification, especially if titles aren't unique.
  const [activeSectionId, setActiveSectionId] = useState<number | null>(0); // null means no section is open

  // Function to toggle the expanded/collapsed state of a section
  const toggleSection = (key:number) => {
    // This line is the magic for LayoutAnimation:
    // It tells React Native to animate the next layout changes.
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (activeSectionId === key) {
      // If the clicked section is already open, close it
      setActiveSectionId(null);
    } else {
      // If the clicked section is closed, open it
      setActiveSectionId(key);
    }
  };

  useEffect(()=>{
    // // // // // console.log('ACCORDION_ITEMS:', ACCORDION_ITEMS);
  }, []);

  return ( 
    <View  style={[
      styles.container,
      {
        marginBottom: BasePaddingsMargins.formInputMarginLess
      },
      {
        /*borderWidth: 3,
        borderColor: 'white',
        borderStyle: 'solid',*/
        // height: 300
      }
    ]}>
      {ACCORDION_ITEMS.map((section, key:number) => {
        const isActive = activeSectionId === key; // Check if this section is currently active
        return (
          <View key={`accordion-item-${key}`} style={[
            styles.sectionWrapper,
            (
              key===ACCORDION_ITEMS.length-1?
              {
                marginBottom: 0,
                // backgroundColor: 'red',
                // opacity: .4
              }
              :
              null
            )
          ]}>
            {/* Header */}
            <TouchableOpacity onPress={() => toggleSection(key)} style={[
              styles.header,
              key===ACCORDION_ITEMS.length-1
              ||
              isActive === true
              ?
              {
                borderColor: 'transparent'
              }
              :
              null
            ]}>
              <Text style={styles.headerText}>{section.title}</Text>
              <Ionicons
                name={isActive ? 'chevron-up' : 'chevron-down'}
                size={TextsSizes.h4}
                color={BaseColors.othertexts}
              />
            </TouchableOpacity>

            {/* Content - conditionally rendered and animated */}
            {isActive && ( // Only render content if the section is active
              <View style={styles.content}>
                <Text style={styles.contentText}>{section.content}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

// --- Styles for the Accordion Component ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f8f8f8',
    // paddingTop: 20,
  },
  sectionWrapper: {
    marginBottom: BasePaddingsMargins.m10,
    // marginHorizontal: 15,
    // borderRadius: 10,
    // backgroundColor: '#ffffff',
    // bac
    overflow: 'hidden', // Ensures content respects border radius when collapsed/expanded
    // Basic shadow for card-like appearance
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6, // Android shadow
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 18,
    paddingInline: 0,
    paddingBlock: BasePaddingsMargins.m10,
    // backgroundColor: '#eaf2f8', // Light blue background for header
    borderBottomWidth: 1,
    borderBottomColor: BaseColors.secondary,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: BaseColors.light,
    flex: 1, // Allows text to take available space before icon
    marginRight: 10,
  },
  content: {
    paddingInline: 0,
    paddingBlock: BasePaddingsMargins.m10,
    paddingTop: BasePaddingsMargins.m0
    // backgroundColor: '#fdfdfd',
    // borderTopWidth: 1,
    // borderTopColor: '#eee',
  },
  contentText: {
    fontSize: TextsSizes.p,
    color: BaseColors.othertexts,
    lineHeight: TextsSizes.p*1.5,
  },
});

export default ZAccordion;