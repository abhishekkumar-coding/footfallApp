import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '../components/BackButton';
import {
  useGetRedeemHistoryByVendorQuery,
  useGetWalletSummaryQuery,
} from '../features/shops/shopApi';
import { useRedeemVendorPointsMutation } from '../features/shops/shopApi';

const RedeemSummaryScreen = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const { data: userPoints } = useGetWalletSummaryQuery();
  const totalPoints = userPoints?.data?.wallet?.totalPoints ?? 0;

  const { vendorDetails } = route.params;
  const vendorId = vendorDetails.vendor._id;

  const { data } = useGetRedeemHistoryByVendorQuery(vendorId);
  const [isDisabled, setIsDisabled] = useState(false);
  const [redeemVendorPoints, { isLoading }] = useRedeemVendorPointsMutation();

  const handleClaimPress = () => {
    setModalVisible(true);
  };

  const handleRedeemConfirm = async id => {
    setIsDisabled(true);
    try {
      const res = await redeemVendorPoints({
        id,
        pointsToRedeem: Number(redeemPoints),
      }).unwrap();
      // console.log("Redeem successful:", res);

      setModalVisible(false);
      setRedeemPoints('');
      setIsDisabled(false);

      setMessageType('success');
      setMessage('Points redeemed successfully!');
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error('Error redeeming points:', error);
      setIsDisabled(false);

      setMessageType('error');
      setMessage(
        error?.data?.message || 'Failed to redeem points. Please try again.',
      );
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // const transactions = [
  //     { id: 1, name: "Purchase 1", date: "7 November, 7:09", points: "-12.01" },
  //     { id: 2, name: "Purchase 2", date: "6 November, 15:20", points: "-30.00" },
  //     { id: 3, name: "Purchase 3", date: "5 November, 18:45", points: "-5.50" },
  //     { id: 4, name: "Purchase 1", date: "7 November, 7:09", points: "-12.01" },
  //     { id: 5, name: "Purchase 2", date: "6 November, 15:20", points: "-30.00" },
  //     { id: 6, name: "Purchase 3", date: "5 November, 18:45", points: "-5.50" }, { id: 1, name: "Purchase 1", date: "7 November, 7:09", points: "-12.01" },
  //     { id: 7, name: "Purchase 2", date: "6 November, 15:20", points: "-30.00" },
  //     { id: 8, name: "Purchase 3", date: "5 November, 18:45", points: "-5.50" },
  // ];

  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <BackButton lable={'Redeem'} back />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          <Text style={styles.vendorName}>{vendorDetails.vendor.name}</Text>
          {/* <Text style={styles.shopName}>Shop Name</Text> */}
        </View>

        <LinearGradient
          colors={['#DA22FF', '#9733EE']}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>POINT BALANCE</Text>
          <Text style={styles.balanceAmount}>{totalPoints.toFixed(2)}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleClaimPress}
            >
              <Text style={styles.actionText}>Claim</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Redeem History</Text>
        <View style={{ marginBottom: 50 }}>
          {Array.isArray(data?.data) && data.data.length > 0 ? (
            data.data.map(item => (
              <View style={styles.transactionItem}>
                <View>
                  <Text style={styles.reason} numberOfLines={3}>
                    {item.reason}
                  </Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
                <Text style={styles.transactionPoints}>- {item.points}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.transactionDate}>No redeem history found.</Text>
          )}
        </View>

        {/* Redeem Modal */}
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Points to Redeem</Text>
              <TextInput
                style={styles.input}
                placeholder="Points"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                value={redeemPoints}
                onChangeText={setRedeemPoints}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#555' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    {
                      backgroundColor:
                        redeemPoints || isDisabled ? '#DA22FF' : '#888',
                    },
                  ]}
                  disabled={!redeemPoints || isDisabled}
                  onPress={() => handleRedeemConfirm(vendorId)}
                >
                  <Text style={styles.modalBtnText}>
                    {isLoading ? 'Processing...' : 'Redeem'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {message && (
        <View
          style={[
            styles.popupContainer,
            {
              backgroundColor:
                messageType === 'success' ? '#28a745' : '#dc3545',
            },
          ]}
        >
          <Text style={styles.popupText}>{message}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

export default RedeemSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    // backgroundColor: '#12002b',
    padding: 16,
  },
  profileContainer: {
    width: '100%',
    marginBottom: hp(4),
  },
  vendorName: {
    color: '#fff',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-SemiBold',
  },
  shopName: {
    color: 'gray',
    fontSize: RFValue(15),
    fontFamily: 'Poppins-SemiBold',
  },
  profile: {
    width: wp(12),
    height: wp(12),
    borderRadius: 50,
    backgroundColor: '#FF4D00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontSize: RFValue(20),
    color: '#fff',
  },
  balanceCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    fontFamily: 'Poppins-Medium',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 20,
    fontFamily: 'Poppins-Bold',
  },
  buttonRow: {
    width: '100%',
  },
  actionButton: {
    flex: 0.48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  actionText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: RFValue(15),
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  reason: {
    color: '#fff',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-SemiBold',
    width: 200,
    flexWrap: 'wrap',
    numberOfLines: 2,
  },

  transactionDate: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  transactionPoints: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'rgba(0,0,0)',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  popupContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    zIndex: 1000,
  },
  popupText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: RFValue(14),
    textAlign: 'center',
  },
});
