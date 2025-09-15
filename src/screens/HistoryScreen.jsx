import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import { hp, SCREEN_HEIGHT, wp } from '../utils/dimensions';
import PageHeader from '../components/PageHeader';
import { useGetScanHistoryQuery } from '../features/shops/shopApi';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../layout/AppLayout';
import { Fonts } from '../utils/typography';

const HistoryScreen = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useGetScanHistoryQuery();
  const history = data?.data || [];
  console.log("Scan History: ", history)

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="orange" />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.empty}>
            {t('fetch_error')}
          </Text>
        </View>
      );
    }

    if (history.length === 0) {
      return (
        <View style={styles.centered}>
          <Image source={require('../../assets/emptyScanHistory.png')} style={{ width: wp(50), height: hp(20), opacity:0.5, marginBottom: hp(2) }} />
          <Text style={styles.empty}>{t('no_scans')}</Text>
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={styles.container}
        data={history}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderItem = ({ item }) => {
    const formattedDate = item?.scannedAt
      ? new Date(item.scannedAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : 'N/A';

    return (
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopName}>{item?.shopId?.name || 'Shop'}</Text>
          <Text style={styles.date}>{t('date_label')}: {formattedDate}</Text>
        </View>
        <Text style={styles.points}>+ {item?.points ?? '0'}</Text>
      </View>
    );
  };

  return (
    <AppLayout>
      <PageHeader lable={t('scan_history')} />
      {renderContent()}
    </AppLayout>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(7),
    paddingHorizontal: 12,

  },
  headerContainer: {
    paddingBottom: hp(),
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    marginBottom: 10,
  },
  headerTitle: {
    color: 'orange',
    fontSize: RFValue(24),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },

  centered: {
    flex: 1,
    // backgroundColor: '#000',
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
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
  },
  shopName: {
    color: '#fff',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-SemiBold',
  },
  date: {
    color: '#ccc',
    fontSize: RFValue(10),
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  points: {
    color: '#00e676',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-Bold',
    textAlign: 'right',
  },
});
