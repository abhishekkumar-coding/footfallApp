import { Alert, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { setFcmToken } from '../features/auth/userSlice';
import notifee, { AndroidImportance } from '@notifee/react-native';


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
  // Foreground message listener
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    const { title, body } = remoteMessage.notification || {};

    await notifee.displayNotification({
      title: title || 'New Notification',
      body: body || 'You have a new message',
      android: {
        channelId: 'default',
        smallIcon: 'screen',
        importance: AndroidImportance.HIGH,
      },
    });
  });

  // Background & quit-state messages should be handled in index.js or App.js:
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message received:', remoteMessage);

    const { title, body } = remoteMessage.notification || {};

    await notifee.displayNotification({
      title: title || 'New Notification',
      body: body || 'You have a new message',
      android: {
        channelId: 'default',
        smallIcon: 'screen',
        importance: AndroidImportance.HIGH,
      },
    });
  });

  return unsubscribe;
};

export const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default'
  });
};

