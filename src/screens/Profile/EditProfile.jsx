import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const EditProfile = () => {
    const [name, setName] = useState('Abhishek Kumar');
    const [email, setEmail] = useState('abhishek@email.com');
    const [phone, setPhone] = useState('+91 9876543210');
    const [address, setAddress] = useState('Hathras, Uttar Pradesh');
    const [country, setCountry] = useState('India');
    const [state, setState] = useState('Uttar Pradesh');
    const [pincode, setPincode] = useState('204101');

    return (
        <LinearGradient colors={['#000337', '#000000']} style={styles.container}>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <BackButton />
                <Text style={styles.heading}>Edit Profile</Text>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.changePhoto}>Change Photo</Text>
                </View>
                {/* 
                <CustomInput label="Name" value={name} onChangeText={setName} />
                <CustomInput label="Email" value={email} onChangeText={setEmail} />
                <CustomInput label="Phone" value={phone} onChangeText={setPhone} />
                <CustomInput label="Address" value={address} onChangeText={setAddress} />
                <CustomInput label="Country" value={country} onChangeText={setCountry} />
                <CustomInput label="State" value={state} onChangeText={setState} />
                <CustomInput label="Pincode" value={pincode} onChangeText={setPincode} /> */}
                <CustomInput lable={"Name"} placeholder={name} />
                <CustomInput lable={"Email"} placeholder={email} />
                <CustomInput lable={"Phone"} placeholder={phone} />
                <CustomInput lable={"Address"} placeholder={address} />
                <CustomInput lable={"Country"} placeholder={country} />
                <CustomInput lable={"State"} placeholder={state} />
                <CustomInput lable={"Pincode"} placeholder={pincode} />

                <CustomButton title="Save Changes" />
            </ScrollView>
        </LinearGradient>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    heading: {
        fontFamily: "Poppins-Bold",
        fontSize: 24,
        color: "#fff",
        textAlign: "center",
        marginTop: 20
    },
    scrollContainer: {
        paddingBottom: 80,
        paddingTop: 40
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        borderColor: '#fff',
        marginTop: 20
    },
    changePhoto: {
        color: '#3B63EF',
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    // input: {
    //     backgroundColor: '#1e1e2f',
    //     color: '#fff',
    //     borderRadius: 12,
    //     paddingHorizontal: 15,
    //     paddingVertical: 14,
    //     fontSize: 16,
    //     // marginBottom: 18,
    //     fontFamily: 'Poppins-Regular',
    // },
    saveButton: {
        backgroundColor: '#3B63EF',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    saveText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
    },
});
