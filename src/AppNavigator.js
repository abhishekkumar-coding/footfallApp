import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import OnboardingScreen from './screens/auth/OnboardingScreen';
import OtpScreen from './screens/auth/OtpScreen';
import NewPasswordScreen from './screens/auth/NewPasswordScreen';
import MainTabNavigator from './navigations/MainTabNavigator';
import ShopDetails from './screens/Home/ShopDetails';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Onboarding">
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown:false}} />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
            <Stack.Screen name="Signup" component={SignupScreen}  options={{headerShown:false}}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown:false}}/>
            <Stack.Screen name="OtpVerification" component={OtpScreen} options={{headerShown:false}}/>
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} options={{headerShown:false}}/>

            <Stack.Screen name="Main" component={MainTabNavigator} options={{headerShown:false}}/>
            <Stack.Screen name="ShopDetails" component={ShopDetails} options={{headerShadowVisible:false}}/>

        </Stack.Navigator>
    )
}

export default AppNavigator

const styles = StyleSheet.create({})