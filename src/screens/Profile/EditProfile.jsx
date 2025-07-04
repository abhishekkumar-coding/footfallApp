import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
} from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useUpdateUserMutation } from '../../features/auth/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setUser } from '../../features/auth/userSlice';
import Toast from 'react-native-toast-message';

const EditProfile = () => {
    const user = useSelector((state) => state.user.user);
    const { _id: userId, name: userName, email: userEmail, phone: userPhone } = user;
    console.log('Current user data:', user);


    const [name, setName] = useState(userName || '');
    const [email, setEmail] = useState(userEmail || '');
    const [phone, setPhone] = useState(userPhone || '');
    const [isSaving, setIsSaving] = useState(false);
    //   const [password, setPassword] = useState('');
    const navigation = useNavigation()

    const [updateUser] = useUpdateUserMutation();
    const dispatch = useDispatch();

    const handleSave = async () => {
        setIsSaving(true);

        try {
            const body = { name, email, phone };
            console.log('Updating user with:', body);
            const res = await updateUser({ id: userId, body }).unwrap();
            console.log('Update success:', res);
            dispatch(setUser(res.data));
            Toast.show({
                type: 'success',
                text1: 'Profile updated successfully',
                visibilityTime: 2000,
            });

            navigation.goBack()
        }
        catch (error) {
            console.log('Update failed:', error);
            Toast.show({
                type: 'error',
                text1: 'Update failed',
                text2: errorMessage,
                visibilityTime: 3000,
            });
        }
        finally {
            setIsSaving(false);
        }
    };

    return (
        <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
            <BackButton lable={"Edit Profile"} back />
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* <Text style={styles.heading}>Edit Profile</Text> */}
                    <View style={{ paddingHorizontal: wp(5) }}>
                        {/* <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.changePhoto}>Change Photo</Text>
                    </View> */}

                        <CustomInput lable="Name" placeholder={name} onChangeText={setName} value={name} />
                        <CustomInput lable="Email" placeholder={email} onChangeText={setEmail} value={email} />
                        <CustomInput lable="Phone" placeholder={phone} onChangeText={setPhone} value={phone} />
                        {/* <CustomInput lable="Password" placeholder={"Enter New Password"} onChangeText={setPassword} value={password}/> */}
                        {/* <CustomInput lable="Address" placeholder={address} />
                    <CustomInput lable="Country" placeholder={country} />
                    <CustomInput lable="State" placeholder={state} />
                    <CustomInput lable="Pincode" placeholder={pincode} /> */}

                        <CustomButton
                            title={isSaving ? "Saving..." : "Save Changes"}
                            disabled={isSaving}
                            onPress={handleSave}
                        />
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {

    },
    heading: {
        fontFamily: 'Poppins-Bold',
        fontSize: RFValue(18),
        color: '#fff',
        textAlign: 'center',

    },
    scrollContainer: {
        paddingBottom: hp(10),
        // paddingTop: hp(6),
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: hp(3),
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        borderColor: '#fff',
        marginTop: hp(3),
    },
    changePhoto: {
        color: '#3B63EF',
        marginTop: hp(1),
        fontSize: RFValue(14),
        fontFamily: 'Poppins-Medium',
    },
    saveButton: {
        backgroundColor: '#3B63EF',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    saveText: {
        color: '#fff',
        fontSize: RFValue(16),
        fontFamily: 'Poppins-SemiBold',
    },
});
