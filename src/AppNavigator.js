import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import LanguageScreen from './screens/LanguageScreen'; // Import your LanguageScreen
import OnboardingScreen from './screens/auth/OnboardingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import OtpScreen from './screens/auth/OtpScreen';
import NewPasswordScreen from './screens/auth/NewPasswordScreen';
import MainTabNavigator from './navigations/MainTabNavigator';
import ShopDetails from './screens/Home/ShopDetails';
import VendorWebView from './screens/VendorWebView';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const user = useSelector(state => state.user.user);
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLanguage = async () => {
      try {
        const lang = await AsyncStorage.getItem('appLanguage');
        if (lang) {
          // Language already selected
          setInitialRoute(user ? 'Main' : 'Onboarding');
        } else {
          // Language not selected yet
          setInitialRoute('Language');
        }
      } catch (e) {
        // console.log('Error reading appLanguage from storage', e);
        // fallback route
        setInitialRoute(user ? 'Main' : 'Onboarding');
      } finally {
        setLoading(false);
      }
    };
    checkLanguage();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF4D00" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="ShopDetails"
        component={ShopDetails}
        options={{ headerShadowVisible: false }}
      /> */}
      <Stack.Screen
        name="VendorWebView"
        component={VendorWebView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
