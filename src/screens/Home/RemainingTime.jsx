import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/typography';
import Spacer from '../../components/Spacer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
const PROGRESS_BAR_WIDTH = SCREEN_WIDTH * 0.85;
const RemainingTime = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <LinearGradient colors={['#147472', '#4638ae',]} angle={30} useAngle={true}
                style={{ borderRadius: 10, }}
            >

                <ImageBackground source={require("../../../assets/bg-imagess.png")} imageStyle={{ opacity: 0.5, objectFit: 'cover', }} style={styles.content}>
                    <Text style={styles.title}>Unlock 1000 points</Text>
                    <Text style={styles.subtitle}>Scan 10 shops to unlock 1000 points</Text>
                    <View style={styles.progressBarContainer}>
                        <Text style={styles.progressBarText}>0/10</Text>
                    </View>
                    <Progress.Bar progress={0.7} width={PROGRESS_BAR_WIDTH} color="#21DAD7" height={10} borderRadius={10} />
                    <Spacer height={12} />
                    <TouchableOpacity style={styles.button} activeOpacity={0.9}
                        onPress={() => navigation.navigate('ScanOptions')}
                    >
                        <MaterialIcons name="qr-code-scanner" size={20} color="#000" />
                        <Text style={styles.buttonText}>Scan</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </LinearGradient>
        </View>
    )
}

export default RemainingTime

const styles = StyleSheet.create({
    container: {
        padding: 10,
        // backgroundColor:"#ffffff4d",
        borderRadius: 10,
        // margin:10
    },
    content: {
        paddingVertical: 14,
        paddingHorizontal: 20
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
        backgroundColor: "#21DAD7",
        padding: 12,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: RFValue(16, SCREEN_HEIGHT),
        fontFamily: Fonts.primary_SemiBold,
        color: "#000"
    },
    progressBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 10
    },
    progressBarText: {
        fontSize: RFValue(12, SCREEN_HEIGHT),
        fontFamily: Fonts.primary_Medium,
        color: "#fff"
    }

})