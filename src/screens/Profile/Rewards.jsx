import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';

const Rewards = ({ rewardPoints = 0, onPress }) => {
  const [points, setPoints] = useState(0);
  const level = Math.floor(points / 50);
  const maxPoints = 100;
  const progress = Math.min(points / maxPoints, 1);

  useEffect(() => {
    setPoints(rewardPoints ?? 0);
  }, [rewardPoints]);

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#1C1247', '#2B195D']} // similar dark purple gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Badge Icon */}
        <View style={styles.badgeContainer}>
          <Image
            source={require('../../../assets/badge.png')} // Use your actual badge icon here
            style={styles.badge}
            resizeMode="contain"
          />
        </View>

        {/* Title and Level */}
        <Text style={styles.title}>Scan & Earn</Text>
        <Text style={styles.level}>You've earned rewards by scanning shops & offers</Text>

        {/* XP Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.xpLabel}>XP</Text>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.xpPoints}>{points}/{maxPoints}</Text>
        </View>
      </LinearGradient>
    </Wrapper>
  );
};

export default Rewards;

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === 'ios' ? wp(95) : wp(92),
    height: hp(20),
    borderRadius: 20,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    marginTop: hp(3),
    marginBottom: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: hp(1),
  },
  badge: {
    width: wp(20),
    height: wp(20),
    position: "absolute",
    top: hp(-3),
    // left:0,
    // right:0
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: RFValue(16),
    color: '#fff',
    marginTop: hp(5),
  },
  level: {
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(10),
    color: '#fff',
    textAlign:"center"
    // marginBottom: hp(2),
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    marginBottom:hp(2)
  },
  xpLabel: {
    color: '#fff',
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Regular',
    marginRight: wp(1),
  },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#4B3F70',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F79D65',
  },
  xpPoints: {
    color: '#fff',
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Bold',
    marginLeft: wp(2),
  },
});
