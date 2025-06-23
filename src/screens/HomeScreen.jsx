import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import HeaderHome from './Home/HeaderHome'
import SearchBar from './Home/SearchBar'
import Banner from './Home/Banner'
import ShopList from './Home/ShopList'
import { hp, wp } from '../utils/dimensions'

const HomeScreen = ({navigation}) => {
    console.log(navigation.getState())
    return (
        <LinearGradient
            colors={['#000337', '#000000']}
            style={ { flex: 1 }}
        >
            < ScrollView style={style.container}>
                <HeaderHome />
                <SearchBar />
                <Banner />
                <ShopList navigation={navigation} />
                
            </ScrollView>
        </LinearGradient>
    )
}

export default HomeScreen

const style = StyleSheet.create({
    container: {
        paddingTop: hp(3),
        paddingHorizontal: wp(3.6),
    }
})