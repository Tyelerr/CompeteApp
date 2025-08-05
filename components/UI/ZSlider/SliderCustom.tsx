import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions, Animated, PanResponderGestureState, LayoutChangeEvent } from 'react-native';
import { SliderProps } from '../../../hooks/Template';

const { width: screenWidth } = Dimensions.get('window');

// Define the props interface for CustomSlider
interface CustomSliderProps {
  min?: number;
  max?: number;
  initialValue?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  sliderWidth?: number;
  trackHeight?: number;
  thumbSize?: number;
  minTrackColor?: string;
  maxTrackColor?: string;
  thumbColor?: string;
  thumbBorderColor?: string;
  thumbBorderWidth?: number;
  thumbShadow?: boolean;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  min = 0,
  max = 100,
  initialValue = 50,
  step = 1,
  onValueChange,
  // sliderWidth = screenWidth * 0.8,
  sliderWidth = 100,
  trackHeight = 6,
  thumbSize = SliderProps.thumb.size,
  minTrackColor = '#007bff',
  maxTrackColor = '#ccc',
  thumbColor = '#007bff',
  thumbBorderColor = '#fff',
  thumbBorderWidth = 2,
  thumbShadow = true,
}) => {
  const [currentValue, setCurrentValue] = useState<number>(initialValue);
  // Type sliderRef to hold a View reference
  const sliderRef = useRef<View | null>(null);
  const [sliderContainerWidth, setSliderContainerWidth] = useState<number>(sliderWidth);
  // Type animatedValue to be an Animated.Value
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  // Calculate thumb position based on value and slider width
  const getThumbPosition = useCallback((value: number, containerWidth: number): number => {
    if (containerWidth === 0) return 0;
    const range = max - min;
    const normalizedValue = (value - min) / range;
    // Position within the track, accounting for thumb size so it doesn't go off ends
    return normalizedValue * (containerWidth - thumbSize);
  }, [min, max, thumbSize]);

  // Calculate value based on thumb position
  const getValueFromPosition = useCallback((position: number, containerWidth: number): number => {
    if (containerWidth === 0) return min;
    const clampedPosition = Math.max(0, Math.min(position, containerWidth - thumbSize));
    const normalizedPosition = clampedPosition / (containerWidth - thumbSize);
    const rawValue = min + normalizedPosition * (max - min);
    // Snap to step
    return Math.round(rawValue / step) * step;
  }, [min, max, step, thumbSize]);

  // Update animated value when currentValue changes
  useEffect(() => {
    const newPosition = getThumbPosition(currentValue, sliderContainerWidth);
    animatedValue.setValue(newPosition);
  }, [currentValue, sliderContainerWidth, getThumbPosition, animatedValue]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState: PanResponderGestureState) => {
        // When touch starts, update value based on initial touch position
        const initialTouchX = gestureState.x0; // x-coordinate of the touch
        sliderRef.current?.measure((fx, fy, width, height, px, py) => {
          const newPosition = initialTouchX - px - thumbSize / 2; // Adjust for thumb center
          const newValue = getValueFromPosition(newPosition, width);
          setCurrentValue(newValue);
          onValueChange && onValueChange(newValue);
          animatedValue.setValue(getThumbPosition(newValue, width)); // Set animated value directly
        });
      },
      onPanResponderMove: (evt, gestureState: PanResponderGestureState) => {
        sliderRef.current?.measure((fx, fy, width, height, px, py) => {
          const newPosition = gestureState.moveX - px - thumbSize / 2; // Current touch x relative to slider start
          const newValue = getValueFromPosition(newPosition, width);
          if (newValue !== currentValue) { // Only update if value actually changed
            setCurrentValue(newValue);
            onValueChange && onValueChange(newValue);
          }
        });
      },
      onPanResponderRelease: (evt, gestureState: PanResponderGestureState) => {
        // Value is already updated during move, no need to update on release unless specific logic is needed
      },
    })
  ).current;

  // Measure the actual width of the slider container once it's laid out
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    // // // console.log('event.nativeEvent.layout.width 2:', event.nativeEvent.layout.width);
    setSliderContainerWidth(event.nativeEvent.layout.width);
  }, []);

  // Calculate width of the filled track part
  const filledTrackWidth = getThumbPosition(currentValue, sliderContainerWidth) + thumbSize / 2;

  return (
    <View 
      style={sliderSingleLocalStyle.outerContainer}
      onLayout={onLayout}
      >
      {/*<Text style={sliderSingleLocalStyle.valueText}>Value: {currentValue.toFixed(0)}</Text>*/}
      <View
        ref={sliderRef}
        style={[sliderSingleLocalStyle.sliderContainer, { width: sliderContainerWidth }]}
        {...panResponder.panHandlers}
      >
        {/* Max Track (unfilled part) */}
        <View style={[sliderSingleLocalStyle.track, { height: trackHeight, backgroundColor: maxTrackColor }]} />

        {/* Min Track (filled part) */}
        <View
          style={[
            sliderSingleLocalStyle.track,
            sliderSingleLocalStyle.minTrack,
            { height: trackHeight, backgroundColor: minTrackColor, width: filledTrackWidth }
          ]}
        />

        {/* Thumb */}
        <Animated.View
          style={[
            sliderSingleLocalStyle.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: thumbColor,
              borderColor: thumbBorderColor,
              borderWidth: thumbBorderWidth,
              transform: [{ translateX: animatedValue }],
            },
            thumbShadow && sliderSingleLocalStyle.thumbShadow,
          ]}
        />
      </View>
    </View>
  );
};

const sliderSingleLocalStyle = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f5f5f5',
    padding: 0,
  },
 /*valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },*/
  sliderContainer: {
    height: SliderProps.thumb.size,
    justifyContent: 'center',
    position: 'relative',
    // backgroundColor: 'red',
    // width: '100%'
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 3,
  },
  minTrack: {
    position: 'absolute',
    left: 0,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -15,
  },
  thumbShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CustomSlider;
