import React, { useEffect, useState } from 'react'; // add useState
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './features/auth/userSlice';
import { View, ActivityIndicator } from 'react-native';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');

        if (token && userData) {
          console.log('Restoring user from storage...');
          const user = JSON.parse(userData);
          dispatch(setUser(user));
        } else {
          console.log('No token/user found — user needs to log in.');
        }
      } catch (e) {
        console.error('Failed to restore user from AsyncStorage:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return children; // Let the rest of your app render once ready
};

export default AppInitializer;
