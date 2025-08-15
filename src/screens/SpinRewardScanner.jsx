import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import AppLayout from '../layout/AppLayout';
import PageHeader from '../components/PageHeader';
import { useClaimRewardMutation } from '../features/shops/shopApi';

const SpinRewardScanner = ({ navigation, route }) => {
  const { vendorId, awardId } = route.params || {};
  const { t } = useTranslation();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [hasScanned, setHasScanned] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const [claimReward, { isLoading }] = useClaimRewardMutation();

  // Request camera permission on mount
  useEffect(() => {
    requestPermission();
  }, []);

  // Hide bottom tab bar while scanning
  useEffect(() => {
    navigation?.setOptions?.({ tabBarStyle: { display: 'none' } });
  }, [navigation]);

  // Scan line animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [scanLineAnim]);

  const showError = (messageKey) => {
    Toast.show({
      type: 'error',
      text1: t(messageKey),
      text2: t('pleaseTryAgain'),
      position: 'top',
    });
  };

  const showSuccess = () => {
    Toast.show({
      type: 'success',
      text1: t('rewardClaimed'),
      text2: t('congratsEnjoyReward'),
      position: 'top',
    });
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async (codes) => {
      if (hasScanned || !codes.length) return;

      const scannedValue = codes[0]?.value;
      if (!scannedValue) return showError('invalidQrCode');

      const params = new URLSearchParams(scannedValue);
      const ownerId = params.get('owner');

      if (!ownerId || !vendorId || !awardId) {
        return showError('invalidQrCode');
      }

      if (ownerId !== vendorId) {
        return showError('ownerVendorMismatch');
      }

      try {
        setHasScanned(true);
        Toast.show({
          type: 'info',
          text1: t('processing'),
          text2: t('validatingYourReward'),
          position: 'top',
        });

        await claimReward({ vendorId, awardId }).unwrap();
        showSuccess();

        // Redirect after short delay
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } catch (err) {
        console.error('Claim reward failed:', err);
        showError('claimRewardFailed');
        setHasScanned(false); // allow retry
      }
    },
  });

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text>{t('deviceNotFound')}</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>{t('requestingCameraPermission')}</Text>
      </View>
    );
  }

  return (
    <AppLayout showCircle={false}>
      <PageHeader lable={t('scanQr')} back/>
      <View style={styles.fullscreen}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={!isLoading}
          codeScanner={codeScanner}
        />

        {/* Scanning Frame */}
        <View style={styles.frame}>
          <Animated.View
            style={[
              styles.scanLineContainer,
              {
                transform: [
                  {
                    translateY: scanLineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 240],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#00f6ff', '#00ffe0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scanLine}
            />
          </Animated.View>

          {/* Frame corners */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
    </AppLayout>
  );
};

export default SpinRewardScanner;

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullscreen: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    position: 'absolute',
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  scanLineContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 3,
  },
  scanLine: {
    width: '100%',
    height: 3,
    shadowColor: '#00ffe0',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 20,
  },
  corner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderColor: '#FF4D00',
    borderRadius: 5,
  },
  topLeft: { top: 0, left: 0, borderLeftWidth: 5, borderTopWidth: 5 },
  topRight: { top: 0, right: 0, borderRightWidth: 5, borderTopWidth: 5 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 5, borderBottomWidth: 5 },
  bottomRight: { bottom: 0, right: 0, borderRightWidth: 5, borderBottomWidth: 5 },
});
