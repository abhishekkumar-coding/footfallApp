import React from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { hp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useGetWalletSummaryQuery } from '../../features/shops/shopApi';
import { useNavigation } from '@react-navigation/native';

const Coins = () => {
  const { data, isLoading } = useGetWalletSummaryQuery();
  const totalPoints = data?.data?.wallet?.totalPoints ?? 0;
  const redeemedPoints = data?.data?.wallet?.redeemed ?? 0;

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/icons_bg.png')}
        style={styles.background}
        resizeMode="stretch"
      >
        <View style={styles.details}>
          <View style={styles.row}>
            <View style={styles.pointsContainer}>
              <Text style={styles.coinsText}>Points</Text>
              <Text style={styles.coinsCount}>{isLoading ? '...' : totalPoints}</Text>
            </View>

            <TouchableOpacity style={styles.redeemContainer} onPress={()=>navigation.navigate("RedeemHistoryScreen")}>
              <Text style={styles.redeemText}>Redeemed</Text>
              <Text style={styles.coinsCount}>{isLoading ? '...' : redeemedPoints}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Coins;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: hp(12),
    overflow: 'hidden',
  },
  background: {
    flex: 1,
    width: '100%',
  },
  details: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: hp(1),
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',       
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    flex: 1,
  },
  redeemContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  coinsText: {
    fontSize: RFValue(20),
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  redeemText: {
    fontSize: RFValue(18),
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  coinsCount: {
    fontSize: RFValue(18),
    fontFamily: 'Poppins-SemiBold',
    color: '#390099',
  },
});
