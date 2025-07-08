import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import { hp } from '../utils/dimensions';
import PageHeader from '../components/BackButton';
import { useGetScanHistoryQuery } from '../features/shops/shopApi';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = () => {
  const { data, isLoading, isError, refetch } = useGetScanHistoryQuery();
  const history = data?.data || [];

  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused, refetching scan history...");
      refetch();
    }, [])
  );


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
          Failed to load history. Please try again.
        </Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No scans yet.</Text>
      </View>
    );
  }

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
          <Text style={styles.shopName}>{item?.shopId?.name || 'N/A'}</Text>
          <Text style={styles.date}>Date: {formattedDate}</Text>
        </View>
        <Text style={styles.points}>+ {item?.points ?? '0'}</Text>
      </View>
    );
  };

  return (
    <>
      <PageHeader lable={'Scan History'} />

      <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={styles.container}
          data={history}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}

        />
      </LinearGradient>
    </>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(7)
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
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: '#999',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginHorizontal: 20,
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
