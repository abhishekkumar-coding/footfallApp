import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PageHeader from '../components/PageHeader';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdateUserMutation } from '../features/auth/authApi'; // adjust path if needed
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



import {
  useGetAllAddressesQuery,
  useDeleteAddressMutation,
} from '../features/address/addressApiSlice';
import AppLayout from '../layout/AppLayout';
import { clearSavedAddress, setSavedAddress } from '../features/auth/userSlice';
import { RFValue } from 'react-native-responsive-fontsize';
import { SCREEN_HEIGHT } from '../utils/dimensions';
import { Fonts } from '../utils/typography';
import { Colors } from '../utils/Colors';
import { useTranslation } from 'react-i18next';

export default function AddressScreen() {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation()
  const userInfo = useSelector((state) => state.user.user);
  const userId = userInfo?._id;

  const {
    data: addressData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllAddressesQuery(
    { page: 1, limit: 10 },
    {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteAddress] = useDeleteAddressMutation();

  const [updateUser] = useUpdateUserMutation();

  const handleSelect = async (id) => {
    setSelectedId(id);

    const selectedAddress = addressData?.data?.addresses?.find(addr => addr._id === id);

    if (selectedAddress) {
      try {
        const payload = {
          ...selectedAddress,
          userId: userId,
        };

        await AsyncStorage.setItem('selectedAddress', JSON.stringify(payload));

        dispatch(setSavedAddress(payload));

        const body = {
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          pinCode: selectedAddress.pinCode,
          latitude: selectedAddress.latitude,
          longitude: selectedAddress.longitude,
        };

        const res = await updateUser({ id: userId, body }).unwrap();
        // console.log('✅ User updated successfully:', res);
      } catch (error) {
        console.error('❌ Error selecting address:', error);
      }
    }
  };



  const handleDelete = id => {
    Alert.alert(
      t('confirm_delete'),
      t('delete_message'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true); // 👈 Show loader
              await deleteAddress(id).unwrap();
              const savedAddress = await AsyncStorage.getItem('selectedAddress');
              if (savedAddress) {
                const parsed = JSON.parse(savedAddress);
                // console.log("Parsed Address fron Local: ", parsed)
                if (parsed._id === id) {
                  await AsyncStorage.removeItem('selectedAddress');
                  dispatch(clearSavedAddress()); // ⬅️ clear Redux
                  setSelectedId(null); // Also reset local state
                  // console.log('✅ Removed selectedAddress from AsyncStorage');
                }
              }
              await refetch(); // Refresh list
            } catch (err) {
              console.error('Failed to delete address:', err);
            } finally {
              setDeleting(false); // 👈 Hide loader
            }
          },
        },
      ],
    );
  };

  // Refetch addresses when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Load selected address from AsyncStorage on first mount
  useEffect(() => {
    const loadSelectedAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem('selectedAddress');
        if (savedAddress) {
          const parsed = JSON.parse(savedAddress);
          if (parsed.userId === userId) {
            setSelectedId(parsed._id);
            dispatch(setSavedAddress(parsed)); // ⬅️ sync to Redux
          } else {
            await AsyncStorage.removeItem('selectedAddress');
            setSelectedId(null);
          }
        }
      } catch (error) {
        console.error('Error loading saved address:', error);
      }
    };

    if (userId) {
      loadSelectedAddress();
    }
  }, [userId]);


  // Removed duplicate handleSelect to fix redeclaration error

  const renderAddress = ({ item }) => {
    const isSelected = selectedId === item._id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => handleSelect(item._id)}
        activeOpacity={0.8}
      >
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Icon name="map-marker" size={22} color="#fff" />
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            {/* Main Address */}
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{item.address || 'No address'}</Text>

            {/* Sub details */}
            <Text style={styles.subText}>
              {item.city}, {item.state}
            </Text>
            <Text style={styles.subText}>{item.country}</Text>
            <Text style={styles.subText}>{item.pinCode}</Text>
          </View>
        </View>

        {/* Edit/Delete Buttons */}
        <View style={styles.editBtn}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MapLocationPicker', {
                mode: 'edit',
                address: item,
              })
            }
          >
            <Icon name="pencil" size={20} color="#aaa" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item._id)}
            style={{ marginLeft: 12 }}
          >
            <Icon name="trash-can" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>


      </TouchableOpacity>
    );
  };

  return (
    <AppLayout>
      <PageHeader back lable={t('address_header')} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            navigation.navigate('MapLocationPicker', { mode: 'create' })
          }
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addBtnText}>{t('add_new_address')}</Text>
        </TouchableOpacity>

        {isLoading ? (
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {t('loading_addresses')}
          </Text>
        ) : isError ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>
            {t('failed_load_addresses')}
          </Text>
        ) : (
          <FlatList
            data={addressData?.data?.addresses || []}
            renderItem={renderAddress}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      {deleting && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>{t('deleting_address')}</Text>
        </View>
      )}

    </AppLayout>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000337' },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  addBtnText: { color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 16 },

  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#5A67D8',
    backgroundColor: 'rgba(90, 103, 216, 0.15)',
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', },

  title: {
    fontSize: RFValue(16, SCREEN_HEIGHT),
    color: '#fff',
    marginBottom: 2,
    fontFamily: Fonts.primary_SemiBold
  },

  subText: {
    fontSize: RFValue(12, SCREEN_HEIGHT),
    color: '#ccc',
    fontFamily: Fonts.primary_Regular
  },

  address: { color: '#ddd', fontSize: 14, marginBottom: 6, lineHeight: 20 },
  editBtn: {
    position: 'absolute',
    right: 10,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioOuter: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: { borderColor: '#5A67D8' },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5A67D8',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white_light,
    marginTop: 5,
  },
});
