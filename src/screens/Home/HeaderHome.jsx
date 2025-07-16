import { SafeAreaView, StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import NotificationIcon from '../../utils/icons/NotificationIcon';
import { wp, hp } from '../../utils/dimensions';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const HeaderHome = () => {
  const navigation = useNavigation();
  const notifications = useSelector((state)=>state.notification.notifications)
  const badgeCount = notifications.length

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />

      <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen', {notifications})}>
        <View style={styles.iconContainer}>
          <NotificationIcon />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HeaderHome;


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: "100%",
    paddingHorizontal: wp(4),
    paddingTop: hp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: "#000337"
  },
  logoImage: {
    width: wp(30),
    height: hp(5),
  },
  iconContainer: {
    position: 'relative',
    padding: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    height: 20,
    minWidth: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'white',
  },

  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
