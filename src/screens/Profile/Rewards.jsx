// Rewards.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';    
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
    height: 120,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    marginTop:30,
    marginBottom:10
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
    fontSize: 20,
    color: '#fff',
    marginLeft: 6,
  },
  points: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: '#fff',
  },
});
