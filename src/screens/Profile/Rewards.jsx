// Rewards.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';    
import { hp, wp } from '../../utils/dimensions';
const Rewards = ({ points = 10 }) => {
  return (
    <LinearGradient
      colors={['#FF6BD6', '#FF2DCF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* top row */}
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Rewards</Text>
        </View>
        {/* you can swap this for a chevron if card is pressable */}
      </View>

      {/* big points number */}
      <Text style={styles.points}>{points}</Text>
    </LinearGradient>
  );
};

export default Rewards;

const styles = StyleSheet.create({
  container: {
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    width: '100%',
    height: hp(13),
    borderRadius: 20,
    padding: wp(5),
    justifyContent: 'space-between',
    marginTop:hp(3),
    marginBottom:hp(1)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp(5),
    color: '#fff',
    marginLeft: 6,
  },
  points: {
    fontFamily: 'Poppins-Bold',
    fontSize: wp(7),
    color: '#fff',
  },
});
