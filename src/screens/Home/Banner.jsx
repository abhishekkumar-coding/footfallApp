import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Banner = () => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.footfallId}>🛍️ New Shops Just Added!</Text>
                <Text style={styles.status}>Explore trending stores near you and mark your favorites</Text>
            </View>
            {/* <Image
                source={require('../assets/footfall-box.png')} // Use a relevant icon/image
                style={styles.image}
            /> */}
        </View>
    );
}

export default Banner

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#F8C200', // light yellow/orange
        padding: 20,
        borderRadius: 16,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
        marginVertical:20,
        width: "100%"
    },
    
    footfallId: {
        fontSize: 30,
        fontFamily: 'Poppins-SemiBold',
        color: '#000',
        marginTop: 2,
    },
    status: {
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        color: '#444',
        marginTop: 2,
    },
    date: {
        fontSize: 12,
        color: '#555',
        fontFamily: 'Poppins-Light',
        marginTop: 4,
    },
    image: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
})