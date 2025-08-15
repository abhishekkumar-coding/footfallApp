import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/dimensions";
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from "../../utils/typography";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const SpinWheelCard = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#FF9800", "#FF5722"]}
                angle={30}
                useAngle={true}
                style={{ borderRadius: 10 }}
            >
                <ImageBackground
                    source={require("../../../assets/spinwheel-bg.png")}
                    imageStyle={{ opacity: 0.2, resizeMode: "cover" }}
                    style={styles.content}
                >
                    <Text style={styles.title}>{t("spinWheelCard.title")}</Text>
                    <Text style={styles.subtitle}>{t("spinWheelCard.subtitle")}</Text>

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate("SpinWheel")}
                    >
                        <MaterialIcons name="sports-esports" size={20} color="#000" />
                        <Text style={styles.buttonText}>{t("spinWheelCard.button")}</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </LinearGradient>
        </View>
    );
};

export default SpinWheelCard;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
    },
    content: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: RFValue(16, SCREEN_HEIGHT),
        fontFamily: Fonts.primary_Bold,
        color: "#fff",
        marginBottom: 5,
        textShadowColor: "#000000cb",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    subtitle: {
        fontSize: RFValue(12, SCREEN_HEIGHT),
        fontFamily: Fonts.primary_Medium,
        color: "#fff",
        marginBottom: 10,
        textShadowColor: "#000000cb",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    button: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#FFD54F",
        padding: 12,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: RFValue(16, SCREEN_HEIGHT),
        fontFamily: Fonts.primary_SemiBold,
        color: "#000",
    },
});
