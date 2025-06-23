import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import LeftArrowIcon from '../utils/icons/LeftArrowIcon';
import { hp, wp } from '../utils/dimensions';


const BackButton = () => {
    
    const navigation = useNavigation();


    return (
        <View style={styles.backContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <LeftArrowIcon/>
            </TouchableOpacity>
        </View>

    )
}

export default BackButton

const styles = StyleSheet.create({
    backContainer: {
        position: 'absolute',
        top: hp(3),
        left: wp(4),
        zIndex: 10,
    },
})