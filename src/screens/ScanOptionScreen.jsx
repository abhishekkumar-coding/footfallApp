import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp, SCREEN_HEIGHT } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import PageHeader from '../components/PageHeader';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppLayout from '../layout/AppLayout';
import { Fonts } from '../utils/typography';

const ScanOptionScreen = ({ navigation }) => {
  const parentNav = useNavigation();
  const { t } = useTranslation();

  //   useLayoutEffect(() => {
  //     // 👇 hide tab bar when screen is focused
  //     parentNav.getParent()?.setOptions({
  //       tabBarStyle: { display: 'none' },
  //     });

  //     return () => {
  //       // 👇 show it back when leaving
  //       parentNav.getParent()?.setOptions({
  //         tabBarStyle: { display: 'flex' },
  //       });
  //     };
  //   }, [parentNav]);
  return (
    <AppLayout showCircle={false}>
      <PageHeader lable={t('scanOption')} back />
      
        <View style={styles.container}>
          <Text style={styles.title}>{t('chooseOption')}</Text>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('RewardScanner')}
          >
            <Text style={styles.optionText}>{t('scanQRReward')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('RedeemScanner')}
          >
            <Text style={styles.optionText}>{t('redeem')}</Text>
          </TouchableOpacity>
        </View>
       
    </AppLayout>
  );
};

export default ScanOptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    // backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: 'orange',
    fontSize: RFValue(20),
    marginBottom: 40,
    fontFamily: 'Poppins-Bold',
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: RFValue(16, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
  },
});
