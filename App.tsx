import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/store';
import Toast from 'react-native-toast-message';
import AppInitializer from './src/AppInitializer'; // ✅ import AppInitializer

const App = () => {
  return (
    <Provider store={store}>
      <AppInitializer>  {/* ✅ wrap everything inside AppInitializer */}
        <NavigationContainer>
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      </AppInitializer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
