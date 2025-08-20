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
    Image,
} from 'react-native'
import React, { useState } from 'react'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { Fonts } from '../../utils/typography';
import { RFValue } from 'react-native-responsive-fontsize';
import { hp, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/dimensions';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { REACT_APP_DEV_SERVER, REACT_APP_PROD_SERVER } from "@env"



const APP_SCHEME = 'footfall://signup';
const WEB_LINK = `${REACT_APP_PROD_SERVER}/signup`;
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.appinlay.footfallapp&hl=en_IN';
const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';
const PointScreen = () => {
    const { t } = useTranslation();
    const user = useSelector(state => state.user.user);
    const redeemPoints = user?.rewards?.points || 0
    console.log("Generated Referral code: ", user)
    const referralCode = user?.referralCode || 'N/A';
    const [activeScreen, setActiveScreen] = useState("points");
    const navigation = useNavigation()
    const handleCopyCode = () => {
        Clipboard.setString(referralCode);
        // Alert.alert('Copied!', 'Referral code copied to clipboard');
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
            const message = t('referral.share.message', { link, code: referralCode });
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

    const handleRedeem = () => navigation.navigate('RedeemScanner')

    return (
        <View>
            <View style={styles.helloContainer}>
                <Text style={styles.helloText}>{t('referral.hello', { name: user.name })}</Text>
                <Text style={styles.redeemText}>{t('referral.redeem_info')}</Text>
            </View>
            <View style={styles.rewardContainer}>
                <View style={styles.rewardBox}>
                    <Text style={styles.rewardText}>{redeemPoints}</Text>
                </View>
                <TouchableOpacity style={styles.rewardButton} onPress={handleRedeem}>
                    <Text style={styles.rewardButtonText}>{t('referral.redeem_button')}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.referContainer}>
                <Text style={styles.referText}>{t('referral.refer_title')}</Text>
                <Text style={styles.referSubText}>{t('referral.refer_subtitle')}</Text>
                <View style={styles.referCodeContainer}>
                    <Text style={styles.referCodeText}>{referralCode}</Text>
                    <View style={styles.copyButton}>
                        <TouchableOpacity onPress={handleCopyCode}>
                            <Ionicon name="copy-outline" size={20} color="#fff" />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
            <View style={styles.shareContainer}>
                <TouchableOpacity style={styles.whatsappButton} onPress={() => handleShare('whatsapp')}>
                    <Ionicon name="logo-whatsapp" size={20} color="#fff" />
                    <Text style={styles.shareText}>{t('referral.share.whatsapp')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialShareButton} onPress={() => handleShare('more')}>
                    <Ionicon name="share-social-outline" size={20} color="#fff" />
                    <Text style={styles.shareText}>{t('referral.share.more')}</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.howItWorksContainer}>
                <Text style={styles.howItWorksTitle}>{t('referral.how_it_works.title')}</Text>
                <View style={styles.howItWorksItem}>
                    <View style={styles.howItWorksIcon}>
                        <Ionicon name="share-social-outline" size={20} color="#fff" />
                    </View>
                    <Text style={styles.howItWorksText}>{t('referral.how_it_works.step1')}</Text>
                </View>
                <View style={styles.howItWorksItem}>
                    <View style={styles.howItWorksIcon}>
                        <Ionicon name="person-add-outline" size={20} color="#fff" />
                    </View>
                    <Text style={styles.howItWorksText}>{t('referral.how_it_works.step2')}</Text>
                </View>
                <View style={styles.howItWorksItem}>
                    <View style={styles.howItWorksIcon}>
                        <Ionicon name="wallet-outline" size={20} color="#fff" />
                    </View>
                    <Text style={styles.howItWorksText}>{t('referral.how_it_works.step3')}</Text>
                </View>
            </View>
        </View>
    )
}

export default PointScreen


const styles = StyleSheet.create({
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    rewardBox: {

    },
    rewardText: {
        fontSize: RFValue(30, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
    },
    rewardButton: {
        backgroundColor: "#8b05eb",
        padding: 10,
        borderRadius: 20,
        paddingHorizontal: 22,

    },
    rewardButtonText: {
        fontSize: RFValue(14, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
        lineHeight: 18
    },
    helloContainer: {
        marginBottom: 15
    },
    helloText: {
        fontSize: RFValue(22, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
    },
    redeemText: {
        fontSize: RFValue(12, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
        marginBottom: 5
    },
    referCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff20',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#fff',

    },
    referCodeText: {
        fontSize: RFValue(16, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
        letterSpacing: 7
    },
    referText: {
        fontSize: RFValue(20, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
        marginBottom: 5
    },
    referSubText: {
        fontSize: RFValue(12, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_Regular,
        marginBottom: 20,
        lineHeight: 20
    },
    copyButton: {
        borderLeftWidth: 0.5,
        paddingLeft: 15,
        borderLeftColor: '#ffffff78',
    },
    scrollContainer: {
        paddingBottom: hp(10),
        paddingHorizontal: 20,
        flexGrow: 1
    },
    header: {
        position: 'absolute',

    },

    referContainer: {
        marginBottom: 20
    },
    shareContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15
    },
    whatsappButton: {
        backgroundColor: '#8b05eb',
        borderRadius: 45,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        flex: 1
    },
    socialShareButton: {
        backgroundColor: '#ffffff68',
        borderRadius: 45,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        flex: 1
    },
    shareText: {
        fontSize: RFValue(12, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
    },
    howItWorksContainer: {
        marginTop: 25

    },
    howItWorksItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: "#ffffff25",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
        flexWrap: 'nowrap',
    },
    howItWorksIcon: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    howItWorksText: {
        width: SCREEN_WIDTH * 0.7,
        // borderWidth:1,
        borderColor: "#fff",
        // flex: 1,
        fontSize: RFValue(12, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
        lineHeight: RFValue(16, SCREEN_HEIGHT),
        flexWrap: 'wrap'
    },
    howItWorksTitle: {
        fontSize: RFValue(16, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
        marginBottom: 10
    },
    headerButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        marginBottom: 20
    },
    headerButton: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 30,
    },
    headerButtonText: {
        fontSize: RFValue(12, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
        lineHeight: 18
    }
});