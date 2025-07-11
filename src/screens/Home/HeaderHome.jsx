import { SafeAreaView, StyleSheet, View, Image } from 'react-native';
import React from 'react';
import NotificationIcon from '../../utils/icons/NotificationIcon';
import { wp, hp } from '../../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';

const HeaderHome = () => {
  return (
    
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <NotificationIcon />
    </SafeAreaView>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width:"100%",
    // top: hp(6),
    paddingHorizontal:wp(4),
    paddingTop:hp(6),
    // left: wp(3.6),
    // right: wp(3.6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor:"#000337"
//'#000337', '#000000'
  },
  logoImage: {
    width: wp(30),
    height: hp(5),  
  },
});
