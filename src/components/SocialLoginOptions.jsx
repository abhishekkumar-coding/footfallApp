import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const SocialLoginOptions = ({ onGooglePress, onApplePress }) => {
    return (
        <>
            <View style={styles.orContainer}>
                <Text style={styles.line}></Text>
                <Text style={styles.orText}>or</Text>
                <Text style={styles.line}></Text>
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.socialButton} onPress={onGooglePress}>
                    <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
                    <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
            </View>
        </>
    );

}

export default SocialLoginOptions

const styles = StyleSheet.create({
    orContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    line: {
        width: '40%',
        height: 0.5,
        backgroundColor: '#fff',
        marginHorizontal: 10,
    },
    orText: {
        color: '#fff',
        fontSize: 20,
        // fontWeight: 'bold',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical:20,
        marginBottom: 20,
    },
    socialButton: {
        borderWidth:1,
        borderColor:"#fff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(52, 52, 52, 0.3)',
        // backgroundColor: '#4068F6',
        borderRadius: 15,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 5,
        gap:20,
        width: "100%",
    },
    googleIcon: {
        width: 30,
        height: 30,
    },
    socialIcon: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
    },
    socialText: {
        fontSize: 20,
        // fontWeight: '500',
        fontFamily: 'Poppins-Regular',
        color: '#FFF',
        textAlign: 'center',
    },
})