import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming, } from 'react-native-reanimated'
const AppButton = ({ title, onPress, isLoading, hideRightIcon = false, isOutline = false, disabled = false }) => {    
    const iconTranslateX = useSharedValue(0);
    const textOpacity = useSharedValue(1);
    const iconOpacity = useSharedValue(1);
    const loaderOpacity = useSharedValue(0);

    const handlePress = () => {
        if(disabled || isLoading) return;
        onPress && onPress();
    }

  const textStyle = useAnimatedStyle(() => ({
      opacity: textOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `-${iconTranslateX.value}%` }],
    opacity: iconOpacity.value,
  }));
    const loaderStyle = useAnimatedStyle(() => ({
        opacity: loaderOpacity.value,
    }));

    useEffect(() => {
        if(!isLoading){
            textOpacity.value = withTiming(1, { duration: 200 });
            iconTranslateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.exp) });
            iconOpacity.value = withTiming(1, { duration: 150 });
            loaderOpacity.value = withTiming(0, { duration: 0 });
        } else {
            textOpacity.value = withTiming(0, { duration: 200 });
            iconTranslateX.value = withTiming(380, { duration: 300, easing: Easing.inOut(Easing.linear) });
            iconOpacity.value = withDelay(300, withTiming(0, { duration: 50, }));
            loaderOpacity.value = withTiming(1, { duration: 1000 });
        }
    }, [ isLoading]);

    useEffect(() => {
        return () => {
            textOpacity.value = withTiming(1, { duration: 200 });
            iconTranslateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.exp) });
            iconOpacity.value = withTiming(1, { duration: 150 });
            loaderOpacity.value = withTiming(0, { duration: 1000 });
        }
    }, []);

    const buttonColor = isOutline ? ['transparent', 'transparent'] : disabled ? ['#b2b2b2', '#b2b2b2'] : ['#ef057a', '#ff0084'];
const buttonStyle = useMemo(() => {
    return {
        ...styles.button,
        borderWidth: isOutline ? 1 : 0,
        borderColor: isOutline ? '#ef057a' : disabled ? '#b2b2b2' : 'transparent',
        shadowColor: disabled ? '#b2b2b2':!isOutline?'#ff2696' :  'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: !isOutline ? 0.4 : 0,
        shadowRadius: !isOutline ? 10 : 0,
        elevation: !isOutline ? 5 : 0,
    }
}, [isOutline, disabled]);
  return (
      <TouchableOpacity disabled={disabled || isLoading} style={styles.button} onPress={handlePress} activeOpacity={0.8}>
          <LinearGradient colors={buttonColor} style={[buttonStyle]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Animated.Text style={[styles.buttonText, textStyle]}>{title}</Animated.Text>
                  <Animated.View style={[styles.loaderContainer, loaderStyle]} >
                      <ActivityIndicator size="small" color="#fff" />
              </Animated.View>
              {!hideRightIcon && <Animated.View style={[styles.iconContainer, iconStyle]}>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
              </Animated.View>}
                  
          </LinearGradient>
    </TouchableOpacity>
  )
}

export default AppButton

const styles = StyleSheet.create({
    button: {
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 45,
       
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    iconContainer: {
        position: 'absolute',
        right: 8,
        top: 5,
        backgroundColor: '#00000039',
        width: 35,
        height: 35,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderContainer: {
        position: 'absolute',
        
        backgroundColor: '#00000039',
        width: 35,
        height: 35,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    }
})