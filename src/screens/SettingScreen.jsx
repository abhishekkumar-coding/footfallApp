import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppLayout from '../layout/AppLayout'
import PageHeader from '../components/PageHeader'
import { useTranslation } from 'react-i18next'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { clearUser } from '../features/auth/userSlice';
import { shopApi,  } from '../features/shops/shopApi';
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
const ListItem = ({ title, description, onPress, isLogoutButton }) => {
    return (
        <TouchableOpacity style={[styles.listItem, {
            backgroundColor: isLogoutButton ? '#ffc1c023' : 'rgba(255,255,255,0.1)',
        }]} onPress={onPress} activeOpacity={0.9}>
            <Text style={[styles.title, {
                color: isLogoutButton ? '#FF0400' : '#fff',
            }]}>{title}</Text>
            <MaterialIcons name="arrow-forward-ios" size={20} color={isLogoutButton ? '#FF0400' : '#fff'} />
        </TouchableOpacity>
    )
}
const SettingScreen = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handleLogout = async () => {
        try {
            console.log('Logout is working');
            await AsyncStorage.multiRemove(['token', 'user', 'wishlist', 'selectedAddress','lastSpinDate']);
            dispatch(clearUser());
            dispatch(shopApi.util.resetApiState());

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (e) {
            console.error('Logout failed:', e);
        }
    };

    return (
        <AppLayout showCircle={false}>
            <PageHeader
                lable={t('settings')}
                back={true}
            />
            <ScrollView
                contentContainerStyle={styles.container}
            >
                <ListItem title={t('change_language')} onPress={() => navigation.navigate('Language', { isInitialSetup: false })}

                />
                <ListItem title={t('delete_account')} onPress={handleLogout}

                />
                <ListItem title={t('logout')} isLogoutButton={true} onPress={handleLogout}

                />
            </ScrollView>
        </AppLayout>
    )
}

export default SettingScreen

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 14,
        color: '#fff',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 10,
        marginBottom: 10,
    }
})