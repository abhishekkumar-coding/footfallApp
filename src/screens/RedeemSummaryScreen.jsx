import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/PageHeader';
import {
  useGetRedeemHistoryByVendorQuery,
  useGetWalletSummaryQuery,
  useRedeemVendorPointsMutation,
} from '../features/shops/shopApi';
import { useTranslation } from 'react-i18next';
import AppLayout from '../layout/AppLayout';
import Toast from 'react-native-toast-message';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/dimensions';

const RedeemSummaryScreen = ({ route }) => {
  const { t } = useTranslation();
  const [redeemPoints, setRedeemPoints] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const { data: userPoints } = useGetWalletSummaryQuery();
  const totalPoints = userPoints?.data?.wallet?.totalPoints ?? 0;

  const { vendorDetails } = route.params;
  const vendorId = vendorDetails.vendor._id;
  const { data: redeemHistory } = useGetRedeemHistoryByVendorQuery(vendorId);
  const [redeemVendorPoints, { isLoading }] = useRedeemVendorPointsMutation();

  const handleRedeemConfirm = async id => {
    setIsDisabled(true);
    try {
      const res = await redeemVendorPoints({ id, pointsToRedeem: Number(redeemPoints) }).unwrap();
      console.log("REsponse : ", res)
      setRedeemPoints('');
      Toast.show({ type: 'success', text1: t('redeemScreen.successMessage') });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.data?.message || t('redeemScreen.errorMessage'),
      });
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <AppLayout>
      <BackButton lable={t('redeemScreen.title')} back />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.vendorName}>{vendorDetails.vendor.name}</Text>

        {/* Points Glass Card */}
        <View style={styles.glassCard}>
          <ImageBackground
            source={require('../../assets/sparks.png')}
            imageStyle={{ opacity: 0.25 }}
            style={styles.balanceCard}
          >
            <Text style={styles.exciteText}>{t('redeemScreen.blazePoints')}</Text>
            <Text style={styles.balanceAmount}>{totalPoints.toFixed(2)}</Text>
          </ImageBackground>

          <View style={styles.redeemBox}>
            <Text style={styles.redeemTitle}>{t('redeemScreen.redeemPrompt')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('redeemScreen.pointsPlaceholder')}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={redeemPoints}
              onChangeText={setRedeemPoints}
            />
            <TouchableOpacity
              style={[
                styles.redeemBtn,
                {
                  backgroundColor: redeemPoints && !isDisabled ? 'transparent' : '#888',
                },
              ]}
              disabled={!redeemPoints || isDisabled}
              onPress={() => handleRedeemConfirm(vendorId)}
            >
              <LinearGradient
                colors={['#00F260', '#0575E6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.redeemBtnText}>
                  {isLoading ? t('redeemScreen.processingText') : t('redeemScreen.redeemNow')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Redeem History */}
        <Text style={styles.sectionTitle}>{t('redeemScreen.redeemHistoryTitle')}</Text>
        <View style={styles.historyContainer}>
          {Array.isArray(redeemHistory?.data) && redeemHistory.data.length > 0 ? (
            redeemHistory.data.map((item, index) => (
              <View key={index} style={styles.transactionItem}>
                <View>
                  <Text style={styles.reason}>{item.reason || t('redeemScreen.redeemed')}</Text>
                  {/* <Text style={styles.transactionDate}>{t('redeemScreen.noRedeemHistory')}</Text> */}
                </View>
                <Text style={styles.transactionPoints}>- {item.points}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.transactionDate}>{t('redeemScreen.noRedeemHistory')}</Text>
          )}
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default RedeemSummaryScreen;


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  vendorName: {
    color: '#fff',
    fontSize: RFValue(20),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  exciteText: {
    fontSize: RFValue(14),
    color: '#00F260',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  balanceCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: RFValue(36),
    fontFamily: 'Poppins-Bold',
  },
  redeemBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  redeemTitle: {
    color: '#fff',
    fontSize: RFValue(14),
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 12,
    fontSize: RFValue(13),
    fontFamily: 'Poppins-Regular',
  },
  redeemBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
 gradientBtn: {
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  minHeight: 48, 
},
  redeemBtnText: {
    color: '#000',
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
  },
  historyContainer: {
    marginBottom: 40,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  reason: {
    color: '#fff',
    fontSize: RFValue(11),
    fontFamily: 'Poppins-Medium',
    width:SCREEN_WIDTH * 0.7
  },
  transactionDate: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  transactionPoints: {
    color: '#00F260',
    fontSize: RFValue(15),
    fontFamily: 'Poppins-Bold',
  },
});
