import React, { useEffect, useState } from 'react';
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
import PageHeader from '../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdateUserMutation } from '../features/auth/authApi'; // adjust path if needed
import { useSelector } from 'react-redux';
// API Hooks
import {
  useGetAllAddressesQuery,
  useDeleteAddressMutation,
} from '../features/address/addressApiSlice';

export default function AddressScreen() {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);

const userInfo = useSelector((state) => state.user.user);
const userId = userInfo?._id;
console.log('User ID:', userId); // Debugging line to check user ID

  const {
    data: addressData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllAddressesQuery({ page: 1, limit: 10 });

  const [deleteAddress] = useDeleteAddressMutation();

const [updateUser] = useUpdateUserMutation();

const handleSelect = async (id) => {
  setSelectedId(id);

  // Find selected address object
  const selectedAddress = addressData?.data?.addresses?.find(addr => addr._id === id);

  if (selectedAddress) {
    try {
      // 1. Store in AsyncStorage
      await AsyncStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
      console.log('✅ Address stored in AsyncStorage');

      // 2. Update user profile
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
      console.log('✅ User updated successfully:', res);
    } catch (error) {
      console.error('❌ Error in handleSelect:', error);
    }
  }
};


  const handleDelete = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true); // 👈 Show loader
              await deleteAddress(id).unwrap();
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

useEffect(() => {
  const loadSelectedAddress = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem('selectedAddress');
      if (savedAddress) {
        const parsed = JSON.parse(savedAddress);
        setSelectedId(parsed._id);
      }
    } catch (error) {
      console.error('Error loading saved address:', error);
    }
  };

  loadSelectedAddress();
}, []);


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
          <Icon name="map-marker" size={22} color="#5A67D8" />
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

        {/* Selection Indicator */}
        <View
          style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}
        >
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <View style={styles.screen}>
        <PageHeader back lable={'Address'} />
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate('MapLocationPicker', { mode: 'create' })
            }
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add New Address</Text>
          </TouchableOpacity>

          {isLoading ? (
            <Text style={{ color: '#fff', textAlign: 'center' }}>
              Loading addresses...
            </Text>
          ) : isError ? (
            <Text style={{ color: 'red', textAlign: 'center' }}>
              Failed to load addresses
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
            <Text style={styles.loadingText}>Deleting address...</Text>
          </View>
        )}
      </View>
    </LinearGradient>
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
      },
      android: { elevation: 3 },
    }),
  },
  addBtnText: { color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 16 },

  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#5A67D8',
    backgroundColor: 'rgba(90, 103, 216, 0.15)',
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  //   title: { fontSize: 16, fontWeight: '600', color: '#fff', marginLeft: 8 },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },

  subText: {
    fontSize: 14,
    color: '#ccc',
  },

  address: { color: '#ddd', fontSize: 14, marginBottom: 6, lineHeight: 20 },
  editBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
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

});
