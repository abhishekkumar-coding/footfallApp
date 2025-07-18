import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../../utils/dimensions';
import PageHeader from '../../components/BackButton';
import { Warning } from '../../utils/icons/icons';
import { Congrates } from '../../utils/icons/icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// const notifications = [
//   {
//     id: '1',
//     title: 'Warning Alert!',
//     message: 'You tried scanning outside allowed radius.',
//     type: 'warning',
//   },
//   {
//     id: '2',
//     title: 'Congratulations!',
//     message: 'You’ve earned 100 bonus points.',
//     type: 'congrats',
//   },
//   {
//     id: '3',
//     title: 'Warning!',
//     message: 'Multiple failed scan attempts detected.',
//     type: 'warning',
//   },
//   {
//     id: '4',
//     title: 'Reward Unlocked!',
//     message: 'Cashback applied at XYZ Store.',
//     type: 'congrats',
//   },
// ];



const NotificationScreen = ({ route }) => {
    const { t } = useTranslation();

  const { notifications } = route.params;
  // const notifications = []


  const renderItem = ({ item }) => {
    const isWarning = item.type === 'warning';

    return (
      <View
        style={[
          styles.notificationCard,
          isWarning ? styles.warningCard : styles.congratsCard,
        ]}
      >
        <View style={styles.row}>
          <View
            style={[
              styles.iconCircle,
              isWarning ? styles.warningIconBg : styles.congratsIconBg,
            ]}
          >
            {isWarning ? <Warning /> : <Congrates />}
          </View>
          <View style={{ flex: 1, marginLeft: wp(3) }}>
            <Text style={styles.notificationTitle}>{t(item.title)}</Text>
            <Text style={styles.notificationMessage}>{t(item.message)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <PageHeader lable={t('notifications')} back={true} />
      <View style={styles.container}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../../assets/emptyNotification.png')} // Make sure this image exists
              style={styles.emptyImage}
              resizeMode="contain"
            />
            {/* <Text style={styles.emptyText}>No notifications yet</Text> */}
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item.id?.toString()}
            contentContainerStyle={{ paddingBottom: hp(5) }}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationCard: {
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  warningCard: {
    backgroundColor: 'rgba(244, 151, 142, 0.4)',
  },
  congratsCard: {
    backgroundColor: 'rgba(149, 213, 173, 0.4)',
  },
  iconCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIconBg: {
    backgroundColor: '#ef233c',
  },
  congratsIconBg: {
    backgroundColor: '#2b9348',
  },
  notificationTitle: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  notificationMessage: {
    color: '#ccc',
    fontSize: wp(3.5),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    marginTop: hp(10),
  },
  emptyImage: {
    width: wp(50),
    height: wp(50),
    marginBottom: hp(2),
  },
  emptyText: {
    color: '#ccc',
    fontSize: wp(4),
    fontWeight: '500',
  },

});
