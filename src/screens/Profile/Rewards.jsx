// Rewards.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';

const Rewards = ({ rewardPoints = 0, onPress }) => {
  const [points, setPoints] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setPoints(rewardPoints ?? 0);
  }, [rewardPoints]);

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#FF6BD6', '#FF2DCF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.label}>{t('total_rewards')}</Text>
          <Text style={styles.points}>{points}</Text>
        </View>
      </LinearGradient>
    </Wrapper>
  );
};

export default Rewards;

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === 'ios' ? wp(95) : wp(92),
    height: Platform.OS === 'ios' ? hp(18) : hp(14),
    borderRadius: 20,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    marginTop: hp(3),
    marginBottom: hp(1),
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: RFValue(16),
    color: '#fff',
    marginBottom: hp(1),
  },
  points: {
    fontFamily: 'Poppins-Bold',
    fontSize: RFValue(26),
    color: '#fff',
  },
});
