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
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import PageHeader from '../../components/PageHeader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  useGetNotificationsQuery,
  useGetShopByIdQuery,
  useGetOfferByIdQuery,
} from '../../features/shops/shopApi';
import { useMarkNotificationAsReadMutation } from '../../features/shops/shopApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../../layout/AppLayout';
import { Fonts } from '../../utils/typography';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';


const NotificationScreen = () => {
  const [shopId, setShopId] = useState(null);
  const [offerId, setOfferId] = useState(null);

  const navigation = useNavigation();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const { data, isLoading, refetch } = useGetNotificationsQuery();
  const {t} = useTranslation()

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
    <AppLayout showCircle={false} style={{ flex: 1 }}>
      <PageHeader lable={t('notification')} back />
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
            <Text style={styles.emptyText}>{t('no_notifications')}</Text>
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
    </AppLayout>
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

  },
  offerCard: {
    backgroundColor: '#ff94cb4c',
  },
  shopCard: {
    backgroundColor: '#85a6304c',
  },
  notificationTitle: {
    fontSize: RFValue(16, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
    color: '#fff',
    marginBottom: hp(0.5),
  },
  entityType: {
    fontSize: RFValue(12, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_Regular,
    color: '#eeeeee',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: wp(35),
    height: wp(35),
    marginBottom: hp(2),
    opacity: 0.5,
  },
  emptyText: {
    fontSize: wp(4),
    color: '#fff',
    textAlign: 'center',
  },
});
