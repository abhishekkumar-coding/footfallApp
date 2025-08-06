import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ProfileEditIcon from '../../utils/icons/ProfileEditIcon';
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';
import { Fonts } from '../../utils/typography';

const ProfileHeader = ({ navigation, user }) => {
  console.log("ProfileHeader user prop:", user);

  const { email, name, photo,accountId, image } = user || {};
  console.log("Profile Photo: ", image)
  // const { email, name, photo, accountId } = user || {};
  // console.log("Profile Photo: ", photo)

  return (
    <View style={styles.container}>
      <View style={styles.profileDetails}>
        <View style={styles.profileIcon}>
          {photo || image ? (
            <Image
              style={styles.profileImage}
              source={{ uri: photo || image }}
            />
          ) : (
            <Text style={styles.profileInitial}>
              {name ? name.charAt(0).toUpperCase() : '?'}
            </Text>
          )}

        </View>
        <View style={styles.details}>
          <Text style={styles.userName}>{name || 'No Name'}</Text>
          <Text style={styles.userGmail}>Account ID: {accountId}</Text>
          <Text style={styles.userGmail}>{email || 'No Email'}</Text>
        </View>
      </View>    
      {/* <ProfileEditIcon color="#fff" onPress={() => navigation.navigate('EditProfile')} /> */}
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
        
  },
  profileDetails: {
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(6),
  },
  profileIcon: {
    backgroundColor: "#6300d3", // light orange, or generate randomly
    justifyContent: "center",
    alignItems: "center",
    width: wp(26),
    height: wp(26),
    borderRadius: 50,
    overflow: "hidden",
  },

  profileInitial: {
    fontSize: RFValue(50, SCREEN_HEIGHT),
    color: '#fff',
    fontFamily: Fonts.primary_SemiBold,
  },

  profileImage: {
    width: wp(25),
    height: wp(25),
    resizeMode: "cover",
    borderRadius: 50,
    // marginTop: hp(1),
  },
  details: {},
  userName: {
    fontFamily: Fonts.primary_SemiBold,
    fontSize: RFValue(22, SCREEN_HEIGHT),
    color: "#fff",
    textAlign: "center",
    marginBottom: 5
  },
  userGmail: {
    fontFamily: Fonts.primary_SemiBold,
    fontSize: RFValue(16, SCREEN_HEIGHT),
    color: "#fff",
    textAlign: "center",
    opacity: 0.6,
    marginBottom:5
  },
});






