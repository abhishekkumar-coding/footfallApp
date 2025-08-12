import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import WheelOfFortune from 'react-native-wheel-of-fortune';
import AppLayout from '../layout/AppLayout';
import { useGetAllRewardsQuery, useSpinWheelMutation } from '../features/shops/shopApi';
import { hp } from '../utils/dimensions';

export default function SpinWheelScreen() {
  const { data, isLoading: rewardsLoading } = useGetAllRewardsQuery();
  const rewardItems = data?.data || [];
  const rewards = rewardItems.map(item => item.name);

  const [spinWheelApi] = useSpinWheelMutation();
  const wheelRef = useRef(null);

  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState('');

  const onSpinPress = async () => {
    if (spinning) return;
    if (!rewards.length) return;

    setSpinning(true);

    let targetIndex = null;
    let prizeName = '';

    try {
      const result = await spinWheelApi().unwrap();
      const backendReward = result?.data?.spinRewardId;

      if (backendReward?._id) {
        const found = rewardItems.findIndex(it => it._id === backendReward._id);
        if (found >= 0) {
          targetIndex = found;
          prizeName = rewardItems[found]?.name || '';
        }
      }

      if (targetIndex === null && backendReward?.name) {
        const foundByName = rewardItems.findIndex(
          it => it.name?.toLowerCase() === backendReward.name.toLowerCase()
        );
        if (foundByName >= 0) {
          targetIndex = foundByName;
          prizeName = rewardItems[foundByName]?.name || '';
        }
      }

      if (targetIndex === null) {
        if (typeof result?.index === 'number') {
          targetIndex = result.index;
          prizeName = rewards[targetIndex] || '';
        } else if (typeof result?.winnerIndex === 'number') {
          targetIndex = result.winnerIndex;
          prizeName = rewards[targetIndex] || '';
        }
      }
    } catch (err) {
      console.warn('Spin API failed:', err);
    }

    if (targetIndex === null) {
      targetIndex = Math.floor(Math.random() * rewards.length);
      prizeName = rewards[targetIndex] || '';
    }

    // Store and spin to that index
    setSelectedPrize(prizeName);
    setWinnerIndex(targetIndex);
    if (wheelRef.current && typeof wheelRef.current._tryAgain === 'function') {
      wheelRef.current._tryAgain(targetIndex);
    }
  };

  const onWheelStop = () => {
    setSpinning(false);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setWinnerIndex(null);
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Spin & Win</Text>
          <Text style={styles.subtitle}>Try your luck and win exciting rewards!</Text>
        </View>

        {rewardsLoading ? (
          <ActivityIndicator size="large" />
        ) : rewards.length === 0 ? (
          <Text style={styles.info}>No rewards available.</Text>
        ) : (
          <>
            <View style={styles.wheelContainer}>
              <WheelOfFortune
                options={{
                  rewards,
                  knobSize: 20,
                  borderWidth: 5,
                  borderColor: '#FF6F00',
                  innerRadius: 50,
                  duration: 4000,
                  backgroundColor: '#FFB300',
                  textAngle: 'horizontal',
                  textStyle: {
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    includeFontPadding: false,
                  },
                  winner: winnerIndex ?? undefined,
                  colors: [
                    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
                    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
                    '#009688', '#4caf50', '#8bc34a', '#cddc39',
                    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
                  ],
                  onRef: ref => (wheelRef.current = ref),
                }}
                getWinner={onWheelStop}
              />
            </View>

            <TouchableOpacity
              style={[styles.spinButton, spinning && styles.spinButtonDisabled]}
              onPress={onSpinPress}
              disabled={spinning}
            >
              <Text style={styles.spinText}>
                {spinning ? 'Spinning…' : 'Spin Now'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Custom Popup */}
        <Modal transparent visible={popupVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.popupBox}>
              <Text style={styles.popupTitle}>🎉 Congratulations!</Text>
              <Text style={styles.popupText}>You won: {selectedPrize}</Text>
              
              <TouchableOpacity style={styles.popupButton} onPress={closePopup}>
                <Text style={styles.popupButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-evenly', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: RFValue(26), fontFamily: 'Poppins-Bold', color: '#fff' },
  subtitle: { fontSize: RFValue(15), fontFamily: 'Poppins-Regular', color: '#666' },
  info: { color: '#888' },
  wheelContainer: { width: 320, height: 320, alignItems: 'center', justifyContent: 'center' },
  spinButton: {
    marginTop: hp(10),
    backgroundColor: '#FF6F00',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
  },
  spinButtonDisabled: { opacity: 0.65 },
  spinText: { color: '#fff', fontSize: 18, fontFamily: 'Poppins-SemiBold' },

  // Popup styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  popupBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  popupTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  popupText: { fontSize: 16, color: '#555', marginBottom: 20 },
  popupButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  popupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
