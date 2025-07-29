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
import { navigationRef } from './src/navigations/NavigationUtil';
import { toastConfig } from './src/components/toastConfig';
import SplashScreen from 'react-native-splash-screen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import i18n from './src/i18n';
import { I18nextProvider } from 'react-i18next';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { createNotificationChannel, setupNotificationListeners, } from './src/features/notificationHelper';
import DynamicLinkHandler from './src/utils/DynamicLinkHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { linking } from './linking';





GoogleSignin.configure({
  webClientId: '697884599919-nsi2smlk6h11lfap8jr9lcdp82gndumb.apps.googleusercontent.com',
  // webClientId: '697884599919-nsi2smlk6h11lfap8jr9lcdp82gndumb.apps.googleusercontent.com',
  offlineAccess: true,
});



const App = () => {


  useEffect(() => {
    const initializeApp = async () => {
      try {
        setTimeout(() => {
          SplashScreen.hide();
        }, 2000)
        await createNotificationChannel();
        setupNotificationListeners()
      } catch (error) {
        console.warn('Initialization error:', error);
      }
    };

    initializeApp();
    // AppVersion()

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
          <I18nextProvider i18n={i18n}>
            <NavigationContainer linking={linking} ref={navigationRef}>
              <StatusBar
                animated={true}
                backgroundColor="#000337"
                barStyle="light-content"
              />
              <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: "#000337" }}>
                <DynamicLinkHandler />
                <AppNavigator />
                <Toast config={toastConfig} />
              </SafeAreaView>
            </NavigationContainer>
          </I18nextProvider>
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