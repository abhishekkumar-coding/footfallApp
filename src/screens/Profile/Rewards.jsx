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
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { Fonts } from '../../utils/typography';
import { Colors } from '../../utils/Colors';

const Rewards = ({ rewardPoints = 0, onPress, title, color=[Colors.secondary, Colors.quinary] }) => {
  const [points, setPoints] = useState(0);
  const level = Math.floor(points / 50);
  const maxPoints = 100;
  const progress = Math.min(points / maxPoints, 1);

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
    paddingVertical: 8,
  
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
