import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { BaseColors, BasePaddingsMargins, BottomBarTab } from "../hooks/Template";
import Ionicons from '@expo/vector-icons/Ionicons'; // Ensure you have this installed
import { useEffect, useRef, useState } from "react";

// Assuming these are your custom styles and constants
// You'll need to define these or adjust paths to your actual files
const StyleZ = StyleSheet.create({
  tabBarIcon: {
    // Base styles for the icon container
    justifyContent: 'center',
    alignItems: 'center',
    width: 50, // Example fixed width
    height: 50, // Example fixed height
    borderRadius: 25, // For circular background if needed
  },
});

/*const BaseColors = {
  primary: '#007AFF', // Blue
  othertexts: '#8E8E93', // Gray
  contentSwitcherBackgroundCOlor: '#E0F2F7', // Light Blue
};*/

/*const BottomBarTab = {
  iconSize: 24, // Base size for the icon
  iconSizeBigger: 32, // Target size for focused icon
};*/

// --- Your TabBarIconElement component (from previous conversation) ---
// This component handles the animation of the individual icon
export function TabBarIconElement(
  {
    focused,
    icon
  }
  :
  {
    focused: boolean,
    icon?: keyof typeof Ionicons.glyphMap,
  }
) {


  // Log the focused prop every time the component renders
  // // // // // // console.log(`[TabBarIconElement Render] Icon: ${icon}, Focused Prop: ${focused}`);

  // Animated.Value to control the icon's scale factor
  const animatedScale = useRef(new Animated.Value(1)).current;
  
  // Animate the icon scale based on the 'focused' prop
  useEffect(() => {
    // This log should fire every time 'focused' or 'icon' changes
    // // // // // // console.log(`[TabBarIconElement useEffect] Firing for Icon: ${icon}, Focused Dependency: ${focused}`);

    Animated.spring(animatedScale, {
      toValue: focused ? 1.3 : 1, // Scale up to 1.3 when focused, back to 1 when unfocused
      friction: 5,
      tension: 100,
      useNativeDriver: true, // Scale animation can use native driver for better performance
    }).start(() => {
      // // // // // // console.log(`[TabBarIconElement Animation End] Icon: ${icon}, Final Focused: ${focused}`);
    });

    // Add a listener to observe the animation values (for debugging/logging)
    const listenerId = animatedScale.addListener(({ value }) => {
      // // // // // // console.log(`[TabBarIconElement Listener] Icon: ${icon} animating scale:`, value);
    });

    // Clean up the listener when the component unmounts or its dependencies change
    return () => {
      // // // // // // console.log(`[TabBarIconElement Cleanup] Removing listener for Icon: ${icon}`);
      animatedScale.removeListener(listenerId);
    };
  }, [focused, icon]); // Dependencies: 'focused' and 'icon'

  return (
    <View style={[
      // StyleZ.tabBarIcon, // Apply your base styles for the tab icon container
      {
        padding: BasePaddingsMargins.m10,
        paddingBottom: BasePaddingsMargins.m10
      }
    ]}>
      {/* Apply the animated scale transform to an Animated.View wrapping the Ionicons */}
      <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
        <Ionicons
          name={icon}
          size={BottomBarTab.iconSizeBigger} // Use a static base size for the Ionicons component
          color={focused ? BaseColors.primary : BaseColors.othertexts} // Dynamic color based on focus
        />
      </Animated.View>
    </View>
  );
}
// --- End TabBarIconElement component ---



// --- Custom Tab Bar Component ---
export default function CustomTabNavigator({ state, descriptors, navigation }) {
  // Log the state of the tab bar to observe focus changes
  React.useEffect(() => {
    // // // // // // console.log(`[MyCustomTabBar] Current State Index: ${state.index}, Route Name: ${state.routes[state.index].name}`);
  }, [state.index]);

  return (
    <View style={tabBarStyles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        // Log the focused state for each tab button
        // // // // // // console.log(`[MyCustomTabBar] Tab Button: ${route.name}, Is Focused: ${isFocused}`);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Get the icon name from options (you'll need to pass it from Tab.Screen options)
        const iconName = options.iconName; // Custom prop to pass icon name

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={tabBarStyles.tabButton}
          >
            {/* Pass focused prop to your TabBarIconElement */}
            <TabBarIconElement icon={iconName} focused={isFocused} />
            <Text style={[tabBarStyles.tabLabel, isFocused && tabBarStyles.tabLabelFocused, {
              marginTop: 0
            }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
// --- End Custom Tab Bar Component ---


/*const screenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});*/

const tabBarStyles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 100, // Adjust as needed
    backgroundColor: BaseColors.dark,
    borderTopWidth: 1,
    borderTopColor: BaseColors.secondary,
    paddingTop: 0,
    paddingBottom: 30, // For safe area
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#8E8E93',
    fontFamily: 'Inter',
  },
  tabLabelFocused: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
