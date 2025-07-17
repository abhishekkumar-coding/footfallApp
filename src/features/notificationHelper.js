import { Alert, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { setFcmToken } from '../features/auth/userSlice';

export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log(' Notification permission denied');
      }
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('iOS Notification permission:', enabled ? 'Granted' : 'Denied');
    }
  } catch (error) {
    console.warn('Notification permission error:', error);
  }
};

export const getAndStoreFcmToken = async (dispatch) => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      dispatch(setFcmToken(fcmToken));
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const setupNotificationListeners = () => {
  // Foreground notifications
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    const { title, body } = remoteMessage.notification || {};
    Alert.alert(title || 'New Notification', body || 'You have a new message.');
  });

  // Background message handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received:', remoteMessage);
  });

  return unsubscribe;
};
