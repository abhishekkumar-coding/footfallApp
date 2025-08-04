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
import BackButton from '../components/PageHeader';
import { hp, wp } from '../utils/dimensions';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_SCHEME = 'footfall://signup';
const WEB_LINK = 'https://footfall.onrender.com/signup'; 
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.appinlay.footfallapp&hl=en_IN';
const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';

const ReferralScreen = () => {
  const { t } = useTranslation();
  const user = useSelector(state => state.user.user);
  console.log("Generated Referral code: ", user)
  const referralCode = user?.referralCode || 'N/A';

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  // Build links
  const generateWebLink = () => `${WEB_LINK}?referral=${encodeURIComponent(referralCode)}`;
  const generateDeepLink = () => `footfall://signup?referral=${encodeURIComponent(referralCode)}`;
  const generateAndroidIntentLink = () =>
    `intent://signup?referral=${encodeURIComponent(referralCode)}#Intent;scheme=footfall;package=com.appinlay.footfallapp;S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;

  const handleOpenLink = async () => {
    try {
      if (Platform.OS === 'android') {
        await Linking.openURL(generateAndroidIntentLink());
      } else {
        const supported = await Linking.canOpenURL(generateDeepLink());
        if (supported) {
          await Linking.openURL(generateDeepLink());
        } else {
          await Linking.openURL(APP_STORE_URL);
        }
      }
    } catch (error) {
      console.error('Deep link error:', error);
      const storeUrl = Platform.OS === 'android' ? PLAY_STORE_URL : APP_STORE_URL;
      await Linking.openURL(storeUrl);
    }
  };

  // Share the referral link
  const handleShare = async (platform) => {
    try {
      const link = generateWebLink(); 
      const message = `Join Footfall using my referral link! ${link}\n\nOr use code: ${referralCode}`;
      switch (platform) {
        case 'whatsapp':
          await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
          break;
        case 'messenger':
          await Linking.openURL(`fb-messenger://share/?link=${encodeURIComponent(link)}`);
          break;
        case 'instagram':
          if (Platform.OS === 'android') {
            await Linking.openURL(`intent://share?text=${encodeURIComponent(message)}#Intent;package=com.instagram.android;scheme=https;end`);
          } else {
            await Linking.openURL(`instagram://library?AssetPath=${encodeURIComponent(link)}`);
          }
          break;
        case 'email':
          await Linking.openURL(`mailto:?subject=Footfall Referral&body=${encodeURIComponent(message)}`);
          break;
        case 'sms':
          await Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
          break;
        default:
          await Share.share({ message, title: 'Footfall Referral' });
      }
    } catch (error) {
      console.error('Sharing error:', error);
      Alert.alert('Error', 'Unable to share at this time.');
    }
  };

  const shareOptions = [
    { platform: 'whatsapp', icon: 'whatsapp', color: '#25D366', label: t('whatsapp') },
    { platform: 'messenger', icon: 'facebook', color: '#0084FF', label: t('facebook') },
    { platform: 'instagram', icon: 'instagram', color: '#C13584', label: t('instagram') },
    { platform: 'email', icon: 'envelope', color: '#FFFFFF', label: t('email') },
    { platform: 'sms', icon: 'comment', color: '#5BC236', label: t('sms') },
    { platform: 'more', icon: 'ellipsis-horizontal', color: '#CCCCCC', label: t('more'), iconType: 'ionicon' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BackButton lable={t('referral.title')} back />
      <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.heading}>{t('referral.inviteFriends')}</Text>
              <Text style={styles.subheading}>{t('referral.shareMessage')}</Text>
            </View>
            <View style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>{t('referral.yourCode')}</Text>
              <TouchableOpacity style={styles.codeBox} onPress={handleCopyCode} activeOpacity={0.8}>
                <Text style={styles.codeText}>{referralCode}</Text>
                <View style={styles.copyButton}>
                  <Ionicon name="copy-outline" size={20} color="#fff" />
                  <Text style={styles.copyText}>{t('referral.copy')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOpenLink}>
                {/* <Text style={styles.shortLinkText}>Open Referral Link</Text> */}
              </TouchableOpacity>
            </View>
            <View style={styles.shareSection}>
              <Text style={styles.sectionTitle}>{t('referral.shareVia')}</Text>
              <View style={styles.glassContainer}>
                <View style={styles.iconsGrid}>
                  {shareOptions.map((option, index) => (
                    <TouchableOpacity key={index} style={styles.iconContainer} onPress={() => handleShare(option.platform)}>
                      <View style={styles.glassIcon}>
                        {option.iconType === 'ionicon'
                          ? <Ionicon name={option.icon} size={28} color={option.color} />
                          : <Icon name={option.icon} size={28} color={option.color} />}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: wp(5) },
  scrollContainer: { paddingBottom: hp(10) },
  header: { marginBottom: hp(4), alignItems: 'center' },
  heading: { fontFamily: 'Poppins-Bold', fontSize: RFValue(24), color: '#fff', textAlign: 'center', marginBottom: hp(1) },
  subheading: { fontFamily: 'Poppins-Regular', fontSize: RFValue(14), color: '#ccc', textAlign: 'center', maxWidth: wp(80), lineHeight: 22 },
  rewardCard: { backgroundColor: 'rgba(31, 31, 31, 0.7)', borderRadius: 16, padding: wp(4), marginBottom: hp(4), borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  rewardTitle: { fontFamily: 'Poppins-SemiBold', fontSize: RFValue(16), color: '#fff', marginBottom: hp(2) },
  codeBox: { backgroundColor: '#1A1A1A', borderRadius: 12, paddingVertical: hp(2), paddingHorizontal: wp(3), overflow:"hidden", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  codeText: { color: '#fff', fontSize: RFValue(14), fontFamily: 'Poppins-SemiBold', letterSpacing: 1 },
  copyButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingVertical: hp(0.8), paddingHorizontal: wp(3), borderRadius: 8 },
  copyText: { color: '#fff', fontSize: RFValue(10), fontFamily: 'Poppins-Medium' },
  shareSection: { marginBottom: hp(2) },
  sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: RFValue(18), color: '#fff', marginBottom: hp(2) },
  glassContainer: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: wp(4), borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', overflow: 'hidden' },
  iconsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: wp(-2) },
  iconContainer: { width: '30%', alignItems: 'center', marginBottom: hp(2), paddingHorizontal: wp(2) },
  glassIcon: { backgroundColor: 'rgba(255, 255, 255, 0.15)', width: wp(18), height: wp(18), borderRadius: wp(9), justifyContent: 'center', alignItems: 'center', marginBottom: hp(1), borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  iconLabel: { color: '#fff', fontFamily: 'Poppins-Regular', fontSize: RFValue(12), textAlign: 'center' },
});

export default ReferralScreen;
