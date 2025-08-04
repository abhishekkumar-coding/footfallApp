import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import { StatusBar } from './StatusBar'
const Circle = () => {
    return (
        <>
            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <View key={index} style={[styles.circle, {
                        position: 'absolute',
                        top: - (100 + (index * 10)) / 2,
                        left: -(100 + (index * 10)) / 2,
                        borderWidth: 10,
                        borderColor: '#ffffff',
                        opacity: 0.07,
                        width: 100 + (index * 20),
                        height: 100 + (index * 20),
                        borderRadius: 100 + (index * 10),
                    }]} />
                ))}
            </View>

        </>
    )
}
const AppLayout = ({ children, statusBarColor, barStyle }) => {
    let statusBar = statusBarColor ? statusBarColor : 'transparent';

    return (
        <>
            <LinearGradient colors={['#080042', '#080042', '#080042', '#5b018c',]}
                angle={35} useAngle={true} style={{ flex: 1, }}>
                <StatusBar statusBarColor={statusBar} barStyle={barStyle} />
                <SafeAreaView style={{ flex: 1, }}>
                    <Circle />
                    {children}
                </SafeAreaView>
            </LinearGradient>
        </>
    )
}

export default AppLayout

const styles = StyleSheet.create({
    circle: {
        position: 'absolute',


    },

})