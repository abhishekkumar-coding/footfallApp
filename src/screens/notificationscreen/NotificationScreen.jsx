import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../../utils/dimensions';
import PageHeader from '../../components/BackButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  useGetNotificationsQuery,
  useGetShopByIdQuery,
  useGetOfferByIdQuery,
} from '../../features/shops/shopApi';
import { useMarkNotificationAsReadMutation } from '../../features/shops/shopApi';
import { SafeAreaView } from 'react-native-safe-area-context';


const NotificationScreen = () => {
  const [shopId, setShopId] = useState(null);
  const [offerId, setOfferId] = useState(null);

  const navigation = useNavigation();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const { data, isLoading, refetch } = useGetNotificationsQuery();

  const notifications = data?.data || []

  useFocusEffect(
    useCallback(() => {
      refetch()
    })
  )

  console.log("Notifications Data: ", notifications)


  const handleNotificationPress = async (item) => {
    try {
      const marrkedRes = await markAsRead(item._id);
      refetch()

      console.log("Marked Res : ", marrkedRes)
      if (item.entityType === 'offer') {
        // setOfferId(item.offerId);
        console.log("Offer Data from Notification Screen: ", item.offerId)
        navigation.navigate('OfferDetails', { offerId: item.offerId });
      } else if (item.entityType === 'shop') {
        // setShopId(item.shopId);
        navigation.navigate('ShopDetails', { id: item.shopId });
      }
    } catch (error) {
      console.error('Failed to navigate to details:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isOffer = item.entityType === 'offer';
    const isShop = item.entityType === 'shop';

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        style={[
          styles.notificationCard,
          isOffer && styles.offerCard,
          isShop && styles.shopCard,
        ]}
      >
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.entityType}>{item.entityType.toUpperCase()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
        <PageHeader lable="Notifications" back />
        <View style={styles.container}>
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator color="#fff" size="large" />
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image
                source={require('../../../assets/emptyNotification.png')}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              {/* <Text style={styles.emptyText}>No notifications yet</Text> */}
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: hp(5) }}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  notificationCard: {
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  offerCard: {
    backgroundColor: 'rgba(251, 111, 146, 1)', // light green
  },
  shopCard: {
    backgroundColor: 'rgba(85, 166, 48, 0.3)', // light orange
  },
  notificationTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(0.5),
  },
  entityType: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: wp(50),
    height: wp(50),
    marginBottom: hp(2),
  },
  emptyText: {
    fontSize: wp(4),
    color: '#fff',
    textAlign: 'center',
  },
});
