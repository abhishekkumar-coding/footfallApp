import { FlatList, ActivityIndicator, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { useGetRedeemHistoryQuery } from '../features/shops/shopApi';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '../components/PageHeader';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

const RedeemHistoryScreen = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetRedeemHistoryQuery();
  const redeemHistory = data?.data ?? [];

  const renderItem = ({ item }) => {
    const formattedDate = item?.createdAt
      ? new Date(item.createdAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : 'N/A';

    return (
      <View style={styles.item}>
        <View style={{ width: '75%' }}>
          <Text style={styles.text} numberOfLines={3}>{item?.reason || t('redeem_noReason')}</Text>
          <Text style={styles.date}>{t('redeem_date')}: {formattedDate}</Text>
        </View>
        <Text style={styles.points}>- {item?.points ?? '0'}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <BackButton lable={t('redeem_title')} back />
      <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.empty}>{t('redeem_failed')}</Text>
          </View>
        ) : redeemHistory.length === 0 ? (
          <View style={styles.centered}>
            <Image source={require('../../assets/emptyRedeemHistory.png')} style={{ width: wp(50), height: hp(20) }} />
            {/* <Text style={styles.empty}>{t('redeem_empty')}</Text> */}
          </View>
        ) : (
          <FlatList
            data={redeemHistory}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id || index.toString()}
            contentContainerStyle={{ paddingBottom: hp(10) }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </LinearGradient>
    </SafeAreaView>

  );
};

export default RedeemHistoryScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: '#999',
    fontSize: RFValue(18),
    textAlign: 'center',
    marginHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: RFValue(14),
    fontFamily: 'Poppins-SemiBold',
    width: 200,
    flexWrap: 'wrap',
    numberOfLines: 2,
  },
  date: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  points: {
    color: '#ff5555',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-Bold',
  },
});
