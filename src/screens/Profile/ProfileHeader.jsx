import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ProfileEditIcon from '../../utils/icons/ProfileEditIcon';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';

const ProfileHeader = ({ navigation, user }) => {
  console.log("ProfileHeader user prop:", user);

  const { email, name, photo, image } = user || {};
  console.log("Profile Photo: ", image)

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
          <Text style={styles.userGmail}>{email || 'No Email'}</Text>
        </View>
      </View>
      <ProfileEditIcon onPress={() => navigation.navigate('EditProfile')} />
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginTop: hp(2),
    width: "100%",
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(6),
  },
  profileIcon: {
    backgroundColor: "#FFD180", // light orange, or generate randomly
    justifyContent: "center",
    alignItems: "center",
    width: wp(15),
    height: hp(7),
    borderRadius: 50,
    overflow: "hidden",
  },

  profileInitial: {
    fontSize: RFValue(22),
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },

  profileImage: {
    width: wp(15),
    height: hp(7),
    resizeMode: "cover",
    // marginTop: hp(1),
  },
  details: {},
  userName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: RFValue(14),
    color: "#fff",
  },
  userGmail: {
    fontFamily: "Poppins-Regular",
    fontSize: RFValue(10),
    color: "#d3d3d3",
  },
});






