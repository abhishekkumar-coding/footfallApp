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


const EditProfile = () => {
    const [name, setName] = useState('Abhishek Kumar');
    const [email, setEmail] = useState('abhishek@email.com');
    const [phone, setPhone] = useState('+91 9876543210');
    const [address, setAddress] = useState('Hathras, Uttar Pradesh');
    const [country, setCountry] = useState('India');
    const [state, setState] = useState('Uttar Pradesh');
    const [pincode, setPincode] = useState('204101');

    return (
        <LinearGradient colors={['#000337', '#000000']} style={{flex:1}}>
            <View style={styles.container}>
            <BackButton />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.heading}>Edit Profile</Text>
                <View style={{ paddingHorizontal: wp(5) }}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.changePhoto}>Change Photo</Text>
                    </View>

                    <CustomInput lable="Name" placeholder={name} />
                    <CustomInput lable="Email" placeholder={email} />
                    <CustomInput lable="Phone" placeholder={phone} />
                    <CustomInput lable="Address" placeholder={address} />
                    <CustomInput lable="Country" placeholder={country} />
                    <CustomInput lable="State" placeholder={state} />
                    <CustomInput lable="Pincode" placeholder={pincode} />

                    <CustomButton title="Save Changes" />
                </View>
            </ScrollView>
            </View>
        </LinearGradient>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(4),
        paddingHorizontal: wp(0),
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
