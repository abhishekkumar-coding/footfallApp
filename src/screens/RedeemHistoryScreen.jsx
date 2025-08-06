import { FlatList, ActivityIndicator, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { useGetRedeemHistoryQuery } from '../features/shops/shopApi';
import LinearGradient from 'react-native-linear-gradient';
import { hp, SCREEN_HEIGHT, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '../components/PageHeader';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../layout/AppLayout';
import { Fonts } from '../utils/typography';

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
    <AppLayout showCircle={false} style={{ flex: 1 }}>

      <BackButton lable={t('redeem_title')} back />
      
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
            <Image source={require('../../assets/emptyRedeemHistory.png')} style={{
              width: wp(20), height: hp(10),
                resizeMode: 'contain',
              opacity: 0.5
            }} />
            <Text style={styles.empty}>{t('redeem_empty')}</Text>
          </View>
        ) : (
          <FlatList
            data={redeemHistory}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id || index.toString()}
            contentContainerStyle={{ paddingBottom: hp(10), paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      
    </AppLayout>

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
    color: '#ffffff71',
    fontSize: RFValue(16, SCREEN_HEIGHT),
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: Fonts.primary_SemiBold
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
    fontSize: RFValue(14, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,    
    flexWrap: 'wrap',
    numberOfLines: 2,
  },
  date: {
    color: '#ffffff71',
    fontSize: RFValue(12, SCREEN_HEIGHT),
    marginTop: 5,
    fontFamily: Fonts.primary_Regular,
  },
  points: {
    color: '#ff4d4d',
    fontSize: RFValue(16, SCREEN_HEIGHT),
    fontFamily: 'Poppins-Bold',
  },
});
