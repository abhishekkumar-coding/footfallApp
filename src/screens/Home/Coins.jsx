import React, { useImperativeHandle, forwardRef } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { hp, SCREEN_HEIGHT } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useGetWalletSummaryQuery } from '../../features/shops/shopApi';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Fonts } from '../../utils/typography';
import LinearGradient from 'react-native-linear-gradient';
import Octicons from 'react-native-vector-icons/Octicons';

const Coins = forwardRef((props, ref) => {
  const { data, refetch, isLoading } = useGetWalletSummaryQuery();
  const totalPoints = data?.data?.wallet?.totalPoints ?? 0;
  const redeemedPoints = data?.data?.wallet?.redeemed ?? 0;
  const navigation = useNavigation();
  const { t } = useTranslation();

  useImperativeHandle(
    ref,
    () => {
      return {
        refetch: () => refetch(),
        loading: isLoading,
      };
    },
    [refetch, isLoading],
  );
  console.log(totalPoints)
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#770479', '#9108dad1',]}
        angle={45}
        useAngle={true}
        style={{ borderRadius: 16,   }}
      >
        <View
          style={styles.gradientContainer} >          
          <View style={styles.upperContainer}>
            <View style={styles.pointsContainer}>
              <Text style={styles.upperText}>My Points</Text>
              <Text style={[styles.upperText, { fontSize: RFValue(20, SCREEN_HEIGHT) }]}>{totalPoints}</Text>
            </View>
            <TouchableOpacity style={styles.arrowContainer}>
              <Octicons name="gift" size={RFValue(20, SCREEN_HEIGHT)} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.lowerContainer}>
            <Text style={styles.lowerText}>See your claimed rewards</Text>
            <TouchableOpacity style={[styles.arrowContainer, { width: 20, height: 20, borderRadius: 20 }]}>
              <MaterialIcons name="arrow-forward" size={RFValue(14, SCREEN_HEIGHT)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
});

export default Coins;

const styles = StyleSheet.create({
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    width: '100%',
    borderRadius: 13,
  },
  lowerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
    paddingTop: 8
  },
  pointsContainer: {
    paddingHorizontal: 7,
    paddingVertical: 12
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  upperText: {
    fontSize: RFValue(12, SCREEN_HEIGHT),
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  lowerText: {
    fontSize: RFValue(12, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_Medium,
    color: '#fff',
  },
  container: {
    width: '100%',
    padding: 10,
    // backgroundColor: "#fff"
  },
  gradientContainer: {
    margin: 10,
  }
});