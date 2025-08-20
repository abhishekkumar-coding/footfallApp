import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";

import {
    useGetSpinHistoryQuery,
    useClaimRewardMutation,
    useGetShopByVendorQuery,
} from "../features/shops/shopApi";
import AppLayout from "../layout/AppLayout";
import PageHeader from "../components/PageHeader";
import { hp, SCREEN_HEIGHT } from "../utils/dimensions";
import { Fonts } from "../utils/typography";

const SpinHistoryScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    // State
    const [vendorId, setVendorId] = useState(null);
    const [awardId, setAwardId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [claimingId, setClaimingId] = useState(null);
    const [screen, setScreen] = useState("unClaimed");
    const [selectedType, setSelectedType] = useState(null);

    // API hooks
    const { data, error, isLoading } = useGetSpinHistoryQuery();
    const [claimReward, { isLoading: isClaiming }] = useClaimRewardMutation();
    const { data: shopDetails, isFetching: shopLoading } =
        useGetShopByVendorQuery(vendorId, { skip: !vendorId });

    // Data
    const spinsData = data?.data || [];
    const unClaimedRewards = spinsData.filter(item => !item.claimed);
    const claimedRewards = spinsData.filter(item => item.claimed);
    console.log(spinsData)

    // Helpers
    const isExpired = expiryDate => new Date(expiryDate) < new Date();

    // Handle claim logic
    const handleClaim = async (item) => {
        if (claimingId) return;
        setClaimingId(item._id);
        setAwardId(item._id);
        setSelectedType(item.rewardSnapshot?.type); // Store type here

        try {
            if (item.rewardSnapshot?.type === "no_reward") {
                setSelectedItem(item);
                // Show "So sad" message instead of popup
                alert("😢 So sad! Better luck next time. Try spinning again!");
                return;
            }

            if (item.rewardSnapshot?.type === "physical_reward") {
                const vendor = item.rewardSnapshot?.physicalRewardDetails?.redeemableAtVendors?.[0];
                if (!vendor) {
                    console.warn("No vendorId found for this reward.");
                    return;
                }
                setVendorId(vendor);
                setSelectedItem(item);
                setShowPopup(true); // Only opens here
            } else {
                await claimReward({ awardId: item._id }).unwrap();
            }
        } catch (err) {
            console.error("❌ Claim failed:", err);
        } finally {
            setClaimingId(null);
        }
    };

    const handlePopupClaim = () => {
        setShowPopup(false);
        if (vendorId) {
            navigation.navigate("SpinRewardScanner", { vendorId, awardId });
        }
    };

    const handlePopupCancel = () => {
        setShowPopup(false);
        setVendorId(null);
    };

    // Render each reward
    const renderItem = ({ item }) => {
        const expired = isExpired(item.expiryDate);
        const disabled = item.claimed || expired || item.rewardSnapshot?.type === "no_reward";
        const isThisClaiming = claimingId === item._id;
        const isNoReward = item.rewardSnapshot?.type === "no_reward";

        return (
            <View style={[
                styles.item,
                (disabled || isNoReward) && styles.disabledItem
            ]}>
                <View style={styles.info}>
                    <Text style={styles.title}>{item.rewardSnapshot?.name}</Text>
                    <Text style={styles.description}>{item.rewardSnapshot?.description}</Text>
                    {!isNoReward && (
                        <>
                            <Text style={styles.points}>
                                {item?.rewardSnapshot?.pointsValue} Points
                            </Text>

                            <Text style={styles.date}>
                                {t("spinWheelHistory.expiry")}: {new Date(item.expiryDate).toLocaleDateString()}
                            </Text>
                        </>
                    )}

                    {item.claimed && <Text style={styles.statusClaimed}>{t('spinWheelHistory.claimedStatus')}</Text>}
                    {!item.claimed && expired && <Text style={styles.statusExpired}>{t('spinWheelHistory.expiredStatus')}</Text>}
                </View>

                {!disabled && (
                    <TouchableOpacity
                        style={styles.claimBtn}
                        onPress={() => handleClaim(item)}
                        disabled={isThisClaiming || isClaiming}
                    >
                        {isThisClaiming && isClaiming ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <Text style={styles.claimText}>{t('spinWheelHistory.claimBtn')}</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // Loading
    if (isLoading) {
        return (
            <AppLayout>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#FF9800" />
                    <Text style={styles.loadingText}>{t('spinWheelHistory.loading')}</Text>
                </View>
            </AppLayout>
        );
    }

    // Error
    if (error) {
        return (
            <AppLayout>
                <View style={styles.center}>
                    <Text style={styles.error}>{t('spinWheelHistory.error')}</Text>
                </View>
            </AppLayout>
        );
    }

    // Empty
    if (!spinsData.length) {
        return (
            <AppLayout>
                <View style={styles.center}>
                    <Text style={styles.empty}>{t('spinWheelHistory.empty')}</Text>
                </View>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <PageHeader back={true} lable={t("spinWheelHistory.header")} />

            {/* Tabs */}
            <View style={styles.tabRow}>
                <TouchableOpacity onPress={() => setScreen("unClaimed")}>
                    <Text style={[styles.tabText, screen === "unClaimed" && styles.activeTab]}>
                        {t('spinWheelHistory.pending')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setScreen("claimed")}>
                    <Text style={[styles.tabText, screen === "claimed" && styles.activeTab]}>
                        {t('spinWheelHistory.claimed')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Lists */}
            {screen === "unClaimed" && (
                <FlatList
                    data={unClaimedRewards}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Image
                                source={require("../../assets/noSpinHistory.png")}
                                style={{ height: hp(30), resizeMode: "contain", marginBottom: 10 }}
                            />
                            <Text style={styles.empty}>{t('spinWheelHistory.empty')}</Text>
                        </View>
                    }
                />
            )}

            {screen === "claimed" && (
                <FlatList
                    data={claimedRewards}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Image
                                source={require("../../assets/noClaimedHistory.png")}
                                style={{ height: hp(30), resizeMode: "contain", marginBottom: 10 }}
                            />
                            <Text style={styles.empty}>{t('spinWheelHistory.noClaimed')}</Text>
                        </View>
                    }
                />
            )}


            {selectedType === "physical_reward" && (
                <Modal visible={showPopup} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.popupBox}>
                            {shopLoading ? (
                                <ActivityIndicator size="large" color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.shopTitle}>
                                        🎁 {shopDetails?.data?.shops?.[0]?.name || t("spinWheelHistory.shopDefault")}
                                    </Text>
                                    <Text style={styles.shopAddress}>
                                        📍 {shopDetails?.data?.shops?.[0]?.address || t("spinWheelHistory.addressDefault")}
                                    </Text>
                                    <Text style={styles.encourageText}>
                                        {t("spinWheelHistory.claimMsg")}
                                    </Text>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity style={styles.cancelBtn} onPress={handlePopupCancel}>
                                            <Text style={styles.btnText}>{t("spinWheelHistory.cancel")}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.confirmBtn} onPress={handlePopupClaim}>
                                            <Text style={styles.btnText}>{t("spinWheelHistory.confirm")}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            )}


        </AppLayout>
    );
};

export default SpinHistoryScreen;

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    loadingText: { color: "#fff", fontFamily: "Poppins-SemiBold" },
    error: { color: "#FF4C4C", fontSize: 16, fontFamily: "Poppins-SemiBold", textAlign: "center" },
    empty: {
        color: '#ffffff71',
        fontSize: RFValue(16, SCREEN_HEIGHT),
        textAlign: 'center',
        marginHorizontal: 20,
        fontFamily: Fonts.primary_SemiBold
    }, tabRow: { flexDirection: "row", justifyContent: "space-evenly", marginVertical: 15 },
    tabText: { fontSize: RFValue(10), fontFamily: "Poppins-SemiBold", color: "#fff" },
    activeTab: { color: "#FF9800" },
    list: { paddingHorizontal: 15, paddingBottom: 20 },
    item: { backgroundColor: "rgba(0,0,0,0.2)", padding: 15, borderRadius: 10, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    disabledItem: { opacity: 0.5 },
    info: { flex: 1, paddingRight: 10 },
    title: { fontSize: 16, fontFamily: "Poppins-SemiBold", color: "#fff" },
    description: { fontSize: 13, color: "#bbb", fontFamily: "Poppins-Regular" },
    points: { fontSize: 14, color: "#FFD700", fontFamily: "Poppins-SemiBold" },
    date: { fontSize: 12, color: "#888", fontFamily: "Poppins-Regular" },
    statusClaimed: { fontSize: 13, color: "#4CAF50", fontFamily: "Poppins-SemiBold" },
    statusExpired: { fontSize: 13, color: "#FF9800", fontFamily: "Poppins-SemiBold" },
    claimBtn: { backgroundColor: "#FF9800", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
    claimText: { color: "#fff", fontSize: 14, fontFamily: "Poppins-SemiBold" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center", padding: 20 },
    popupBox: { backgroundColor: "#1E1E1E", borderRadius: 12, padding: 20, width: "90%", alignItems: "center" },
    shopTitle: { fontSize: 18, fontFamily: "Poppins-Bold", color: "#fff", marginBottom: 8, textAlign: "center" },
    shopAddress: { fontSize: 14, fontFamily: "Poppins-Regular", color: "#ccc", marginBottom: 12, textAlign: "center" },
    encourageText: { fontSize: 14, fontFamily: "Poppins-Regular", color: "#FFD700", textAlign: "center", marginBottom: 16 },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
    cancelBtn: { flex: 1, backgroundColor: "#444", paddingVertical: 10, borderRadius: 8, marginRight: 8, alignItems: "center" },
    confirmBtn: { flex: 1, backgroundColor: "#FF9800", paddingVertical: 10, borderRadius: 8, marginLeft: 8, alignItems: "center" },
    btnText: { color: "#fff", fontFamily: "Poppins-SemiBold", fontSize: 14 },
});
