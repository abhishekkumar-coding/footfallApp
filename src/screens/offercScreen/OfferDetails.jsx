import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/PageHeader';
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useGetOfferByIdQuery, useScanOfferMutation } from '../../features/shops/shopApi';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../../layout/AppLayout';
import PageHeader from '../../components/PageHeader';
import { Fonts } from '../../utils/typography';
import { Colors } from '../../utils/Colors';

const fallbackBanner = require('../../../assets/images/fallback-banner.png');

const OfferDetails = ({ route }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [error, setError] = useState(false);

    const { offerId } = route.params || {};

    const { data, isLoading, isError } = useGetOfferByIdQuery(offerId, {
        skip: !offerId,
    });

    const offer = data?.data || {}


    console.log("Offer data in Offer Screen : ", offer)

    // const [triggerScanOffer, { isLoading: isOfferResult }] = useScanOfferMutation();

    // const handleClick = async (value) => {
    //     try {
    //         const result = await triggerScanOffer({ id: value }).unwrap();
    //         Toast.show({
    //             type: 'success',
    //             text1: 'Offer Scanned',
    //             text2: result.message,
    //         });
    //     } catch (err) {
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Scan Failed',
    //             text2: err?.data?.message || 'An error occurred',
    //         });
    //     }
    // };

    if (isLoading) {
        return (
            <AppLayout showCircle={false}>
                <PageHeader lable={'Offer Details'} back={true} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            </AppLayout>
        );
    }



    const {
        title = 'No Title Available',
        description = 'No description provided.',
        bannerImage,
        // endDate = 'N/A',
        shopId,
    } = offer;

    const shopName = shopId?.name || 'Shop not available';

    const formattedDate = new Date(offer.endTime).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <AppLayout showCircle={false}>
            <PageHeader lable={'Offer Details'} back={true} />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <Image
                    source={
                        error || !bannerImage
                            ? require('../../../assets/noOfferBanner.png')
                            : { uri: bannerImage }
                    }
                    style={styles.banner}
                    resizeMode="cover"
                    onError={() => setError(true)} // Set fallback on error
                />

                <View style={styles.card}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>{t('shopName')}</Text>
                            <Text style={styles.value}>{shopName}</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderColor: '#999',
                            borderStyle: 'dashed',
                            width: '100%',
                            marginVertical: 0,
                        }}
                    />

                    <View style={styles.qrWrapper}>
                        <Text style={styles.scanText}>Tap the button below to open the scanner</Text>
                        <Text style={styles.validityText}>Valid till {formattedDate}</Text>

                        <TouchableOpacity onPress={() => navigation.navigate('OfferScanner')}>
                            <Text style={styles.scanButton}>Scan Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(5),
        marginTop: hp(0),
    },
    banner: {
        width: '100%',
        height: hp(22),
        borderRadius: 12,
        marginBottom: hp(2),
        resizeMode: 'cover',
    },
    title: {
        color: '#fff',
        fontSize: RFValue(24, SCREEN_HEIGHT),
        fontFamily: Fonts.primary_SemiBold,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    description: {
        fontFamily: Fonts.primary_Regular,
        color: '#fff',
        fontSize: RFValue(13, SCREEN_HEIGHT),
        textAlign: 'center',
        marginBottom: hp(1),
        textTransform: 'capitalize',
    },
    infoCard: {
        paddingHorizontal: 15,
        paddingVertical:10
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'        
    },
    label: {
        fontSize: RFValue(14, SCREEN_HEIGHT),
        color: '#EBEAED',
        fontFamily: Fonts.primary_Regular,
    },
    value: {
        fontSize: RFValue(16, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_SemiBold,
    },
    card: {
        backgroundColor: Colors.purple,
        borderWidth: 4,
        borderColor: Colors.purple,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
        marginBottom: hp(5),
    },
    qrWrapper: {
        paddingHorizontal: wp(5),
        paddingVertical: hp(3),
        alignItems: 'center',
    },
    scanText: {
        fontSize: RFValue(12, SCREEN_HEIGHT),
        color: '#EBEAED',
        fontFamily: Fonts.primary_SemiBold,
        textAlign: 'center',
        marginBottom: hp(0.5),
    },
    validityText: {
        fontSize: RFValue(12, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_Regular,
        marginBottom: hp(1),
    },
    scanButton: {
        color: '#FFF',
        backgroundColor: Colors.quinary,
        paddingHorizontal: wp(5),
        paddingVertical: hp(1),
        borderRadius: 30,
        fontSize: RFValue(15, SCREEN_HEIGHT),
        marginTop: hp(2),
        fontFamily: Fonts.primary_Regular,
        lineHeight: RFValue(19, SCREEN_HEIGHT),
    },
});

export default OfferDetails;
