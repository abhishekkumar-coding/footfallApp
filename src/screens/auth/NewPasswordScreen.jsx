import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import CustomInput from '../../components/CustomInput'
import LockIcon from '../../utils/icons/LockIcon'
import BackButton from '../../components/BackButton'
import CustomButton from '../../components/CustomButton'
import { hp, wp } from '../../utils/dimensions'

const NewPasswordScreen = ({ navigation }) => {

    const newPasswordSubmit = () => {
        navigation.navigate('Login')
    }

    return (
        <LinearGradient colors={['#000337', '#000']} style={{ flex: 1 }}>
            <BackButton />
            <View style={styles.container}>
                <Text style={styles.title}>Set your new password</Text>
                <View style={styles.inputContainer}>
                    <CustomInput placeholder="Enter your new password" lable={'New Password'} secureTextEntry={true} isPassword={true} iconComponent={<LockIcon />} />
                    <CustomInput placeholder="Confirm your password" lable={'Confirm Password'} secureTextEntry={true} isPassword={true} iconComponent={<LockIcon />} />
                </View>
                <CustomButton title={"Continue"} onPress={newPasswordSubmit}/>
            </View>
        </LinearGradient>
    )
}

export default NewPasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(6),
        paddingTop: hp(4),
        marginTop: hp(5),
        gap: 0,
    },
    title: {
        fontSize: wp(6),
        fontWeight: 'bold',
        color: '#fff',
    },
    inputContainer: {
        gap: hp(1),
        marginVertical: hp(2),
    },
})