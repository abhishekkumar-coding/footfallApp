import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import NotificationIcon from '../../utils/icons/NotificationIcon';
import { wp, hp } from '../../utils/dimensions';

const HeaderHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logoText}>FootFall</Text>
      <NotificationIcon />
    </SafeAreaView>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: hp(6), // Adjust this for translucent status bar
    left: wp(3.6),
    right: wp(3.6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  logoText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp(6),
  },
});
