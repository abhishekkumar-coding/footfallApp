// Rewards.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { Fonts } from '../../utils/typography';
import { Colors } from '../../utils/Colors';

const Rewards = ({ rewardPoints = 0, onPress, title, color=[Colors.secondary, Colors.quinary] }) => {
  const [points, setPoints] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setPoints(rewardPoints ?? 0);
  }, [rewardPoints]);

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress} activeOpacity={0.8} style={{
      width:'47%'
    }}>
      <LinearGradient
        colors={color}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{borderRadius: 16}}
      >
        <View style={styles.content}>
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.points}>{points}</Text>
        </View>
      </LinearGradient>
    </Wrapper>
  );
};

export default Rewards;

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  
  },
  label: {
    fontFamily: Fonts.primary_SemiBold,
    fontSize: RFValue(14, SCREEN_HEIGHT),
    color: '#fff',
  },
  points: {
    fontFamily: Fonts.primary_Bold,
    fontSize: RFValue(25, SCREEN_HEIGHT),
    color: '#fff',
  },
});
