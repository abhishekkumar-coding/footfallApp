import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import WheelOfFortune from 'react-native-wheel-of-fortune';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLayout from '../layout/AppLayout';
import { useGetAllRewardsQuery, useSpinWheelMutation } from '../features/shops/shopApi';
import { hp } from '../utils/dimensions';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function SpinWheelScreen() {
  const { data, isLoading: loadingRewards } = useGetAllRewardsQuery();
  const rewardsData = data?.data || [];
  const rewardsNames = rewardsData.map(item => item.name);
  const navigation = useNavigation();
  const [spinWheelApi, { isLoading: loadingSpin }] = useSpinWheelMutation();
  const { t } = useTranslation();

  const wheelRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [prizeText, setPrizeText] = useState('');
  const [hasSpunToday, setHasSpunToday] = useState(false);

  useEffect(() => {
    checkSpinStatus();
  }, []);

  const checkSpinStatus = async () => {
    try {
      const lastSpinDate = await AsyncStorage.getItem('lastSpinDate');
      const today = new Date().toDateString();
      setHasSpunToday(lastSpinDate === today);
    } catch (err) {
      console.error('Error checking spin status:', err);
    }
  };

  const setSpinStatus = async () => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem('lastSpinDate', today);
      setHasSpunToday(true);
    } catch (err) {
      console.error('Error saving spin status:', err);
    }
  };

  const handleSpinPress = () => {
    if (hasSpunToday) {
      Alert.alert('Daily Limit', 'You can only spin once per day. Come back tomorrow!');
      return;
    }
    if (isSpinning || rewardsNames.length === 0) return;

    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * rewardsNames.length);
    setSelectedIndex(randomIndex);

    if (wheelRef.current?._tryAgain) {
      wheelRef.current._tryAgain(randomIndex);
    }
  };

  const handleWheelStop = async (_, landedIndex) => {
    setIsSpinning(false);
    setPopupVisible(true);
    setPrizeText('Checking reward...');

    const rewardId = rewardsData[landedIndex]?._id;
    try {
      const response = await spinWheelApi(rewardId).unwrap();
      console.log("response: ", response?.data?.spinRewardId?.type)
      if (response?.data?.spinRewardId?.type === 'no_reward') {
        setPrizeText('no_reward');
      } else {
        setPrizeText(response?.data?.name || rewardsNames[landedIndex]);
      }

      await setSpinStatus(); // mark spin as done for today
    } catch (error) {
      console.error('Spin API error:', error);
      setPrizeText('Error confirming prize');
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedIndex(null);
    setPrizeText('');
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('spinWheel.title')}</Text>
          <Text style={styles.subtitle}>{t('spinWheel.subtitle')}</Text>
        </View>

        {loadingRewards ? (
          <ActivityIndicator size="large" color="#FF6F00" />
        ) : rewardsNames.length === 0 ? (
          <Text style={styles.info}>{t('spinWheel.noRewards')}</Text>
        ) : (
          <>
            <View style={styles.wheelContainer}>
              <WheelOfFortune
                options={{
                  rewards: rewardsNames.map(name =>
                    name.length > 5
                      ? name.match(/.{1,10}/g).join('\n')
                      : name
                  ),
                  knobSize: 25,
                  borderWidth: 5,
                  borderColor: '#FF6F00',
                  innerRadius: 50,
                  duration: 4000,
                  backgroundColor: '#FFB300',
                  textAngle: 'horizontal',
                  textStyle: {
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '40%',
                    alignSelf: 'center',
                  },
                  winner: selectedIndex ?? undefined,
                  colors: [
                    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
                    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
                    '#009688', '#4caf50', '#8bc34a', '#cddc39',
                    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
                  ],
                  onRef: ref => (wheelRef.current = ref),
                }}
                getWinner={handleWheelStop}
              />
            </View>

            <TouchableOpacity
              style={[styles.spinButton, (isSpinning || hasSpunToday) && styles.spinButtonDisabled]}
              onPress={handleSpinPress}
              disabled={isSpinning || hasSpunToday}
              activeOpacity={0.8}
            >
              <Text style={styles.spinButtonText}>
                {isSpinning
                  ? t('spinWheel.spinning')
                  : hasSpunToday
                    ? t('spinWheel.comeBackTomorrow')
                    : t('spinWheel.spinNow')}
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.encouragementText}>
                {t('spinWheel.claimRewardsText')}
              </Text>

              <TouchableOpacity
                style={styles.claimButton}
                onPress={() => navigation.navigate("SpinHistory")}
                activeOpacity={0.8}
              >
                <Text style={styles.claimButtonText}>{t('spinWheel.rewardsButton')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Modal */}
        <Modal
          transparent
          visible={popupVisible}
          animationType="fade"
          onRequestClose={closePopup}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.popupBox}>
              {loadingSpin ? (
                <>
                  <ActivityIndicator size="large" color="#FF6F00" />
                  <Text style={styles.popupText}>{t('spinWheel.confirmingReward')}</Text>
                </>
              ) : prizeText === 'no_reward' ? (
                <>
                  <Text style={[styles.popupTitle, { color: '#d9534f' }]}>{t('spinWheel.noRewardTitle')}</Text>
                  <Text style={styles.popupText}>
                    {t('spinWheel.noRewardMessage')}
                  </Text>
                  <TouchableOpacity style={styles.popupButton} onPress={closePopup}>
                    <Text style={styles.popupButtonText}>{t('spinWheel.noRewardButton')}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.popupTitle}>{t('spinWheel.congratsTitle')}</Text>
                  <Text style={styles.popupText}>{t('spinWheel.congratsMessage')} {prizeText}</Text>
                  <TouchableOpacity style={styles.popupButton} onPress={closePopup}>
                    <Text style={styles.popupButtonText}>{t('spinWheel.congratsButton')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'space-evenly' },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: RFValue(20), fontFamily: 'Poppins-Bold', color: '#fff' },
  subtitle: { fontSize: RFValue(15), fontFamily: 'Poppins-Regular', color: '#ddd', textAlign: 'center' },
  info: { color: '#888', fontSize: RFValue(16) },
  wheelContainer: { width: 320, height: 320, justifyContent: 'center', alignItems: 'center' },
  spinButton: { marginTop: hp(10), backgroundColor: '#FF6F00', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 50, elevation: 6 },
  spinButtonDisabled: { opacity: 0.65 },
  spinButtonText: { color: '#fff', fontSize: 18, fontFamily: 'Poppins-SemiBold' },
  bottomRow: { marginTop: hp(5), width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  encouragementText: { flex: 1, color: '#fff', fontSize: RFValue(10), fontFamily: 'Poppins-Medium' },
  claimButton: { backgroundColor: '#FF6F00', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 30, marginLeft: 15, elevation: 4 },
  claimButtonText: { color: '#fff', fontWeight: 'bold', fontSize: RFValue(10) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  popupBox: { width: '80%', backgroundColor: '#fff', borderRadius: 15, padding: 20, alignItems: 'center' },
  popupTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  popupText: { fontSize: 16, color: '#555', marginBottom: 20, textAlign: 'center' },
  popupButton: { backgroundColor: '#FF6F00', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  popupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
