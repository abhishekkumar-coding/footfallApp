import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  Share,
  Platform,
  Clipboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '../components/BackButton';
import { hp, wp } from '../utils/dimensions';

const ReferralScreen = () => {
  const user = useSelector((state) => state.user.user);
  const referralCode = user?.referralCode || 'N/A';

  // Your app's deep link configuration
  const APP_SCHEME = 'footfall';
  const DEEP_LINK_PATH = 'signup';
  
  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied', 'Referral code copied to clipboard');
  };

  const generateDeepLink = () => {
    return `${APP_SCHEME}://${DEEP_LINK_PATH}?referral=${encodeURIComponent(referralCode)}`;
  };

  const generateLinkTwUrl = () => {
    // This should be the LinkTw.in URL you've configured to redirect to your deep link
    // Example: https://linktw.in/ref_ABC123 (configured in LinkTw.in dashboard to redirect to footfall://signup?referral=ABC123)
    return `https://linktw.in/ref_${referralCode}`;
  };

  const handleOpenLink = async () => {
    try {
      const deepLink = generateDeepLink();
      
      // First try to open the app directly
      const canOpen = await Linking.canOpenURL(deepLink);
      
      if (canOpen) {
        await Linking.openURL(deepLink);
      } else {
        // Fallback to opening the LinkTw.in URL
        // LinkTw.in should be configured to redirect to your deep link
        await Linking.openURL(generateLinkTwUrl());
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Error', 'Could not open the link. Please make sure the app is installed.');
    }
  };

  const handleShare = async (platform) => {
    try {
      const linkTwUrl = generateLinkTwUrl();
      const message = `Join Footfall using my referral link! ${linkTwUrl}\n\nOr use code: ${referralCode}`;
      
      const shareOptions = {
        message: message,
        url: linkTwUrl, // For platforms that support URL preview
        title: 'Footfall Referral',
      };

      switch (platform) {
        case 'whatsapp':
          await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
          break;
        case 'messenger':
          await Linking.openURL(`fb-messenger://share/?link=${encodeURIComponent(linkTwUrl)}`);
          break;
        case 'instagram':
          if (Platform.OS === 'android') {
            await Linking.openURL(`intent://share?text=${encodeURIComponent(message)}#Intent;package=com.instagram.android;scheme=https;end`);
          } else {
            await Linking.openURL(`instagram://library?AssetPath=${encodeURIComponent(linkTwUrl)}`);
          }
          break;
        case 'email':
          await Linking.openURL(`mailto:?subject=Footfall Referral&body=${encodeURIComponent(message)}`);
          break;
        case 'sms':
          await Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
          break;
        case 'more':
        default:
          await Share.share(shareOptions);
      }
    } catch (error) {
      console.error('Sharing error:', error);
      Alert.alert('Error', 'Unable to share at this time. Please make sure the app is installed.');
    }
  };

  const shareOptions = [
    { platform: 'whatsapp', icon: 'whatsapp', color: '#25D366', label: 'WhatsApp' },
    { platform: 'messenger', icon: 'facebook', color: '#0084FF', label: 'Messenger' },
    { platform: 'instagram', icon: 'instagram', color: '#C13584', label: 'Instagram' },
    { platform: 'email', icon: 'envelope', color: '#FFFFFF', label: 'Email' },
    { platform: 'sms', icon: 'comment', color: '#5BC236', label: 'SMS', iconType: 'fontawesome' },
    { platform: 'more', icon: 'ellipsis-horizontal', color: '#CCCCCC', label: 'More', iconType: 'ionicon' },
  ];

  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <BackButton />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.heading}>Invite Friends</Text>
            <Text style={styles.subheading}>
              Share your referral link and earn rewards when they sign up
            </Text>
          </View>

          <View style={styles.rewardCard}>
            <Text style={styles.rewardTitle}>Your Referral Code</Text>
            <TouchableOpacity 
              style={styles.codeBox} 
              onPress={handleCopyCode}
              activeOpacity={0.8}
            >
              <Text style={styles.codeText}>{referralCode}</Text>
              <View style={styles.copyButton}>
                <Ionicon name="copy-outline" size={20} color="#fff" />
                <Text style={styles.copyText}>Copy</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleOpenLink}>
              <Text style={styles.shortLinkText}>Tap to test your referral link</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.howItWorks}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Share your referral link</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Friend clicks the link and signs up</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>You both earn Footfall rewards!</Text>
              </View>
            </View>
          </View>

          <View style={styles.shareSection}>
            <Text style={styles.sectionTitle}>Share Via</Text>
            <View style={styles.glassContainer}>
              <View style={styles.iconsGrid}>
                {shareOptions.map((option, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.iconContainer}
                    onPress={() => handleShare(option.platform)}
                  >
                    <View style={styles.glassIcon}>
                      {option.iconType === 'ionicon' ? (
                        <Ionicon name={option.icon} size={28} color={option.color} />
                      ) : option.iconType === 'fontawesome' ? (
                        <Icon name={option.icon} size={28} color={option.color} />
                      ) : (
                        <Icon name={option.icon} size={28} color={option.color} />
                      )}
                    </View>
                    <Text style={styles.iconLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(4),
    paddingHorizontal: wp(5),
  },
  scrollContainer: {
    paddingBottom: hp(10),
  },
  header: {
    marginTop: hp(3),
    marginBottom: hp(4),
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: RFValue(24),
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  subheading: {
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(14),
    color: '#ccc',
    textAlign: 'center',
    maxWidth: wp(80),
    lineHeight: 22,
  },
  rewardCard: {
    backgroundColor: 'rgba(31, 31, 31, 0.7)',
    borderRadius: 16,
    padding: wp(6),
    marginBottom: hp(4),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rewardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: RFValue(16),
    color: '#fff',
    marginBottom: hp(2),
  },
  codeBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  codeText: {
    color: '#fff',
    fontSize: RFValue(20),
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: 8,
  },
  copyText: {
    color: '#fff',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Medium',
  },
  howItWorks: {
    marginBottom: hp(4),
  },
  shareSection: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: RFValue(18),
    color: '#fff',
    marginBottom: hp(2),
  },
  stepContainer: {
    backgroundColor: 'rgba(31, 31, 31, 0.5)',
    borderRadius: 12,
    padding: wp(5),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3A7DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  stepNumberText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: RFValue(12),
  },
  stepText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(14),
    flex: 1,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: wp(4),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: wp(-2),
  },
  iconContainer: {
    width: '30%',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
  },
  glassIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconLabel: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(12),
    textAlign: 'center',
  },
});

export default ReferralScreen;