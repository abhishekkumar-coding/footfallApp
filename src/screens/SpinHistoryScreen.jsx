import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
    useGetSpinHistoryQuery,
    useClaimRewardMutation,
    useGetShopByVendorQuery,
} from "../features/shops/shopApi";
import AppLayout from "../layout/AppLayout";
import PageHeader from "../components/PageHeader";

const SpinHistoryScreen = () => {
    const navigation = useNavigation();
    const [vendorId, setVendorId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [claimingId, setClaimingId] = useState(null);

    const { data, error, isLoading } = useGetSpinHistoryQuery();
    const spinsData = data?.data || [];

    const { data: shopDetails, isFetching: shopLoading } =
        useGetShopByVendorQuery(vendorId, {
            skip: !vendorId,
        });
    console.log("Shop Details: ", shopDetails)

    const [claimReward, { isLoading: isClaiming }] = useClaimRewardMutation();

    const isExpired = (expiryDate) => new Date(expiryDate) < new Date();

    const handleClaim = async (item) => {
        if (claimingId) return;
        setClaimingId(item._id);

        try {
            if (item.rewardSnapshot.type === "physical_reward") {
                const vendor = item.rewardSnapshot?.physicalRewardDetails?.redeemableAtVendors?.[0];
                if (!vendor) {
                    console.warn("No vendorId found for this reward.");
                    setClaimingId(null);
                    return;
                }
                setVendorId(vendor);
                setSelectedItem(item);
                setShowPopup(true);
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
        navigation.navigate("RewardScanner", { vendorId });
    };

    const handlePopupCancel = () => {
        setShowPopup(false);
        setVendorId(null);
    };

    const renderItem = ({ item }) => {
        const expired = isExpired(item.expiryDate);
        const disabled = item.claimed || expired;
        const isThisClaiming = claimingId === item._id;

        return (
            <View style={[styles.item, disabled && styles.disabledItem]}>
                <View style={styles.info}>
                    <Text style={styles.title}>{item.rewardSnapshot?.name}</Text>
                    <Text style={styles.description}>{item.rewardSnapshot?.description}</Text>
                    <Text style={styles.points}>
                        {item?.rewardSnapshot?.pointsValue} Points
                    </Text>
                    <Text style={styles.date}>
                        Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                    </Text>

                    {item.claimed && <Text style={styles.statusClaimed}>Claimed</Text>}
                    {!item.claimed && expired && (
                        <Text style={styles.statusExpired}>⏳ Expired</Text>
                    )}
                </View>

                {!disabled && (
                    <TouchableOpacity
                        style={styles.claimBtn}
                        onPress={() => handleClaim(item)}
                        disabled={isThisClaiming || isClaiming}
                    >
                        {isThisClaiming && isClaiming ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.claimText}>Claim</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (isLoading) {
        return (
            <AppLayout>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#FF9800" />
                    <Text>Loading history...</Text>
                </View>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <View style={styles.center}>
                    <Text style={styles.error}>❌ Failed to load spin history.</Text>
                </View>
            </AppLayout>
        );
    }

    if (!spinsData.length) {
        return (
            <AppLayout>
                <View style={styles.center}>
                    <Text style={styles.empty}>No spin history found.</Text>
                </View>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <PageHeader back={true} lable={"Spin History"} />
            <View style={styles.container}>
                <FlatList
                    data={spinsData}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            </View>

            {/* Popup for shop details */}
            <Modal visible={showPopup} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.popupBox}>
                        {shopLoading ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.shopTitle}>
                                    🎁 {shopDetails?.data.shops[0].name || "Shop Details"}
                                </Text>
                                <Text style={styles.shopAddress}>
                                    📍 {shopDetails?.data.shops[0].address || "Address not available"}
                                </Text>
                                <Text style={styles.encourageText}>
                                    Claim your reward now and enjoy your benefits at this shop!
                                </Text>

                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={styles.cancelBtn}
                                        onPress={handlePopupCancel}
                                    >
                                        <Text style={styles.btnText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.confirmBtn}
                                        onPress={handlePopupClaim}
                                    >
                                        <Text style={styles.btnText}>Claim</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

        </AppLayout>
    );
};

export default SpinHistoryScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: { padding: 16 },
    item: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.15)",
        padding: 12,
        marginBottom: 12,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        minHeight: 100,
    },
    disabledItem: { opacity: 0.5 },
    info: { flex: 1, paddingRight: 10 },
    title: { fontSize: 16, fontWeight: "600", color: "#fff" },
    description: { fontSize: 14, color: "#eee", marginVertical: 4 },
    points: { fontSize: 14, color: "#FFD700", fontWeight: "500" },
    date: { fontSize: 12, color: "#ccc" },
    statusClaimed: { color: "lightgreen", fontWeight: "bold", marginTop: 4 },
    statusExpired: { color: "salmon", fontWeight: "bold", marginTop: 4 },
    claimBtn: {
        backgroundColor: "#FF9800",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 6,
        minWidth: 80,
        alignItems: "center",
    },
    claimText: { color: "#fff", fontWeight: "bold" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    empty: { fontSize: 16, color: "#999" },
    error: { fontSize: 16, color: "red" },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    popupBox: {
        width: "100%",
        maxWidth: 350,
        backgroundColor: "rgba(0,0,0,5.15)", // glass effect
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    shopTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
        textAlign: "center",
    },
    shopAddress: {
        fontSize: 14,
        color: "#f1f1f1",
        textAlign: "center",
        marginBottom: 15,
    },
    encourageText: {
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
        fontStyle: "italic",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cancelBtn: {
        flex: 1,
        marginRight: 10,
        padding: 12,
        backgroundColor: "rgba(255, 0, 0, 0.7)",
        borderRadius: 10,
        alignItems: "center",
    },
    confirmBtn: {
        flex: 1,
        marginLeft: 10,
        padding: 12,
        backgroundColor: "rgba(0, 200, 83, 0.8)",
        borderRadius: 10,
        alignItems: "center",
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
