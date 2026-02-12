import {
  Alert,
  LogBox, Modal, Platform, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, UIManager, View
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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { linking } from './linking';
import { withStallion } from 'react-native-stallion';
import { HotUpdater } from "@hot-updater/react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import AppButton from './src/components/AppButton';
import { Fonts } from './src/utils/typography';

const UpdateFeatureComponent = ({ onUpdate, isVisible }) => {
  return (
    <Modal transparent visible={isVisible} animationType="slide" statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <View style={{ backgroundColor: '#Ffffff', padding: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
          <Text style={{textAlign:'center', fontSize:16, fontFamily:Fonts.primary_Regular}}>New Features is available</Text>
          <Text style={{ textAlign: 'center', fontSize: 20, fontFamily: Fonts.primary_Bold }}>Update Now</Text>
          <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: Fonts.primary_Regular }}>lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</Text>
          <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center',  }}>
            <AppButton title="Update Now" onPress={() => onUpdate()} />
          </View>
        </View>
      </View>
    </Modal>
  )
}



GoogleSignin.configure({
  webClientId: '697884599919-nsi2smlk6h11lfap8jr9lcdp82gndumb.apps.googleusercontent.com',
  offlineAccess: true,
});
const HotUpdateApp = HotUpdater.wrap({
  baseURL: "https://kmdwwgkzyzbtlsduxxew.supabase.co/functions/v1/update-server",
  updateStrategy: "appVersion", // or "fingerprint"
  updateMode: "manual",
  reloadOnForceUpdate: true, // Automatically reload the app when a force update is detected
  requestHeaders: {
    // if you want to use the request headers, you can add them here
  },
  fallbackComponent: ({ progress, status }) => (
    <View
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* You can put a splash image here. */}
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        {status === "UPDATING" ? "Updating..." : "Checking for Update..."}
      </Text>
      {progress > 0 ? (
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          {Math.round(progress * 100)}%
        </Text>
      ) : null}
    </View>
  ),
})(App);


function App() {
  const [updateApp, setUpdateApp] = React.useState(false);
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
  useEffect(() => {
    const checkUpdate = async () => {
      const updateInfo = await HotUpdater.checkForUpdate({
        updateStrategy: "appVersion", // Required: specify update strategy
        requestHeaders: {
          // Authorization: "Bearer <your-access-token>",
        },
      });
      if (!updateInfo) {
        console.log("No update found");
        return;
      }
      await updateInfo.updateBundle();      
      if (updateInfo.shouldForceUpdate) {
        setUpdateApp(true);
      }
    };
    checkUpdate();
  }, []);
  const updateAppHandler = async () => {
    setUpdateApp(false);    
    await HotUpdater.reload();
  }
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
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
                  <DynamicLinkHandler />
                  <AppNavigator />
                  <Toast config={toastConfig} />
                  <UpdateFeatureComponent isVisible={updateApp} onUpdate={updateAppHandler} />
                </NavigationContainer>
              </I18nextProvider>
            </AppInitializer>
          </Provider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
};

export default HotUpdateApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});