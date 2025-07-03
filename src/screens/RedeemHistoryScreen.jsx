import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useGetRedeemHistoryQuery } from '../features/shops/shopApi';
import LinearGradient from 'react-native-linear-gradient';
import { hp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '../components/BackButton';

const RedeemHistoryScreen = () => {
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
          <Text style={styles.text} numberOfLines={3}>{item?.reason || 'N/A'}</Text>
          <Text style={styles.date}>Date: {formattedDate}</Text>
        </View>
        <Text style={styles.points}>- {item?.points ?? '0'}</Text>
      </View>
    );
  };

  return (
    <>
        <BackButton lable={"Redeem History"} back/>
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1, paddingHorizontal: 20 }}>
      {isLoading ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Loading redeem history...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Failed to load redeem history.</Text>
        </View>
      ) : redeemHistory.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>No redeem history found.</Text>
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
    </>

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
    fontSize: 16,
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
