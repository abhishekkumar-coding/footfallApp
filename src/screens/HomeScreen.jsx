import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import HeaderHome from './Home/HeaderHome';
import SearchBar from './Home/SearchBar';
import Banner from './Home/Banner';
import ShopList from './Home/ShopList';
import { hp, wp } from '../utils/dimensions';
import AutoSlider from './Home/AutoSlider';

const HomeScreen = ({ navigation }) => {
    console.log(navigation.getState());

    return (
        <LinearGradient
            colors={['#000337', '#000000']}
            style={{ flex: 1 }}
        >
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <HeaderHome />

            <View style={style.scrollContainer}>
                {/* <SearchBar /> */}
                {/* <Banner /> */}
                {/* <AutoSlider/> */}
                <ShopList navigation={navigation} />
            </View>
        </LinearGradient>
    );
};

export default HomeScreen;

const style = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        marginTop: hp(14),               
        paddingHorizontal: wp(0),
    }
});
