import React, { useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  View,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import { hp, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';

const CustomButton = ({
  title,
  onPress,
  backgroundColor = '#FF4D00',
  borderWidth = 0,
}) => {
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

 const tapGesture = Gesture.Tap()
  .onStart(e => {
    const x = e.x;
    const y = e.y;

    runOnJS(setRipplePos)({ x, y });

    rippleScale.value = 0;
    rippleOpacity.value = 1;
    rippleScale.value = withTiming(2, { duration: 300 }, () => {
      rippleOpacity.value = withTiming(0, { duration: 200 });
    });
  })
  .onEnd(() => {
    runOnJS(onPress)(); 
  });


  const animatedRippleStyle = useAnimatedStyle(() => {
    const rippleSize = Math.max(size.width, size.height);
    return {
      position: 'absolute',
      width: rippleSize,
      height: rippleSize,
      borderRadius: rippleSize / 2,
      top: ripplePos.y - rippleSize / 2,
      left: ripplePos.x - rippleSize / 2,
      backgroundColor: 'rgba(255,255,255,0.4)',
      transform: [{ scale: rippleScale.value }],
      opacity: rippleOpacity.value,
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <View
        style={[
          styles.button,
          { backgroundColor, borderWidth },
        ]}
        onLayout={onLayout}
      >
        <Animated.View style={animatedRippleStyle} />
        <Text style={styles.text}>{title}</Text>
      </View>
    </GestureDetector>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: wp(2),
    paddingVertical: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
    marginTop: 10,
    width: '100%',
    alignSelf: 'center',
    borderColor: '#FF4D00',
    overflow: 'hidden',
  },
  text: {
    color: '#fff',
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Regular',
    zIndex: 1,
  },
});
