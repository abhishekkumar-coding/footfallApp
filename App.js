import {
  Alert,
  LogBox, Platform, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, UIManager
} from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/store';
import Toast from 'react-native-toast-message';
import AppInitializer from './src/AppInitializer';
import linking from './linking';
import { navigationRef } from './src/navigations/NavigationUtil';
import { toastConfig } from './src/components/toastConfig';
import SplashScreen from 'react-native-splash-screen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


GoogleSignin.configure({
  webClientId: '629732782679-ug45qaukimq75elomr99d3ibn1b9fnmn.apps.googleusercontent.com',
  offlineAccess: true,
});

const App = () => {


  useEffect(() => {
    const initializeApp = async () => {
      SplashScreen.hide();
    };

    initializeApp()

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    if (TextInput.defaultProps == null) TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;

    if (TouchableOpacity.defaultProps == null) TouchableOpacity.defaultProps = {};
    TouchableOpacity.defaultProps.activeOpacity = 0.8;

    if (ScrollView.defaultProps == null) ScrollView.defaultProps = {};
    ScrollView.defaultProps.showsVerticalScrollIndicator = false;
    ScrollView.defaultProps.showsHorizontalScrollIndicator = false;

    LogBox.ignoreAllLogs();

    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');

      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppInitializer>
          <NavigationContainer linking={linking} ref={navigationRef}>
            <AppNavigator />
            <Toast config={toastConfig} />
          </NavigationContainer>
        </AppInitializer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});