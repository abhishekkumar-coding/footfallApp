import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import GamesScreen from '../screens/GamesScreen';
import ProfileScreen from '../screens/ProfileScreen';

import EmptyHeart from '../utils/icons/EmptyHeart';
import EmptyHome from '../utils/icons/EmptyHome';
import EmptyGame from '../utils/icons/EmptyGame';
import EmptyProfile from '../utils/icons/EmptyProfile';
import FilledHeart from '../utils/icons/FilledHeart';
import FilledHome from '../utils/icons/FilledHome';
import FilledGame from '../utils/icons/FilledGame';
import FilledProfile from '../utils/icons/FilledProfile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShopDetails from '../screens/Home/ShopDetails';
import AllShops from '../screens/Home/AllShops';
import FilterShops from '../screens/Home/FilterShops';
import EditProfile from '../screens/Profile/EditProfile';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ScannerScreen from '../screens/ScannerScreen';
import ReferralScreen from '../screens/ReferralScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FilledHistoryIcon from '../utils/icons/FilledHistoryIcon';
import History from '../utils/icons/History';
import RedeemScanner from '../screens/RedeemScanner';
import ScanOptionScreen from '../screens/ScanOptionScreen';
import RedeemSummaryScreen from '../screens/RedeemSummaryScreen';
import RedeemHistoryScreen from '../screens/RedeemHistoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen/FavoritesScreen';
import OffersScreen from '../screens/offercScreen/OffersScreen';
import OfferDetails from '../screens/offercScreen/OfferDetails';
import CashbackScreen from '../screens/CashbackScreen';
import NotificationScreen from '../screens/notificationscreen/NotificationScreen';
import OfferScanner from '../screens/Home/OfferScanner';
import LanguageSelectionScreen from '../screens/LanguageScreen';
import LanguageScreen from '../screens/LanguageScreen';
import { useTranslation } from 'react-i18next';
import AllFeaturedShops from '../screens/Home/AllFeaturedShops';
import AddressScreen from '../screens/AddressScreen';
import MapLocationPicker from '../screens/MapLocationPicker';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ShopDetails"
      component={ShopDetails}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AllShops"
      component={AllShops}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="FilterShops"
      component={FilterShops}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RewardScanner"
      component={ScannerScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RedeemScanner"
      component={RedeemScanner}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ScanOptions"
      component={ScanOptionScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RedeemSummaryScreen"
      component={RedeemSummaryScreen}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="RedeemHistoryScreen"
      component={RedeemHistoryScreen}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="OffersScreen"
      component={OffersScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="OfferDetails"
      component={OfferDetails}
      options={{ headerShown: false}}
    />
    <Stack.Screen
      name="CashbackScreen"
      component={CashbackScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NotificationScreen"
      component={NotificationScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="OfferScanner"
      component={OfferScanner}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='AllFeaturedShops'
      component={AllFeaturedShops}
      options={{ headerShown: false }}
    />
    
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Referral"
      component={ReferralScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RedeemHistoryScreen"
      component={RedeemHistoryScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Language"
      component={LanguageScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
    name='Address'
    component={AddressScreen}
    options={{headerShown:false}}
    />
    <Stack.Screen
      name='MapLocationPicker'
      component={MapLocationPicker}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#181818',
          position: 'absolute',
          elevation: 0,
          borderTopWidth: 0,
          overflow: 'hidden',
          height: 70,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarLabelStyle: {
          // marginBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 9,
          // marginTop: 5
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#d3d3d3',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeMain';
          const hideOnScreens = [
            'ScanOptions',
            'RewardScanner',
            'RedeemScanner',
            'OffersScreen',
            'OfferDetails',
            'NotificationScreen',
            'ShopDetails',
            'OfferScanner',
            'AllFeaturedShops',
            'EditProfile'
          ];

          const isHidden = hideOnScreens.includes(routeName);

          return {
            headerShown: false,
            tabBarLabel: t('tab_home'),
            tabBarStyle: isHidden
              ? { display: 'none' }
              : {
                backgroundColor: '#181818',
                position: 'absolute',
                elevation: 0,
                borderTopWidth: 0,
                overflow: 'hidden',
                height: 70,
              },
            tabBarIcon: ({ focused }) =>
              focused ? <FilledHome /> : <EmptyHome />,
          };
        }}
      />

      {/* <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return focused ? <FilledHome /> : <EmptyHome />;
          },
        }}/> */}

      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={{
          headerShown: false,
          tabBarLabel: t('tab_favorites'),
          tabBarIcon: ({ focused }) => {
            return focused ? <FilledHeart /> : <EmptyHeart />;
          },
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerShown: false,
          tabBarLabel: t('tab_history'),
          tabBarIcon: ({ focused }) => {
            return focused ? <FilledHistoryIcon /> : <History />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'ProfileMain';
          const hideOnScreens = ['EditProfile', 'Referral', 'Language', 'RedeemHistoryScreen'];
          return {
            headerShown: false,
            tabBarLabel: t('tab_profile'),
            tabBarStyle: hideOnScreens.includes(routeName)
              ? { display: 'none' }
              : {
                backgroundColor: '#181818',
                position: 'absolute',
                elevation: 0,
                borderTopWidth: 0,
                overflow: 'hidden',
                height: 70,
              },
            tabBarIcon: ({ focused }) =>
              focused ? <FilledProfile /> : <EmptyProfile />,
          };
        }}
      />
    </Tab.Navigator>
  );
};
const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FavoritesMain"
      component={FavoritesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ShopDetails"
      component={ShopDetails}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
export default MainTabNavigator;
