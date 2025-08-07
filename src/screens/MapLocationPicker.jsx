import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

// API Hooks
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from '../features/address/addressApiSlice';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const MapLocationPicker = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode = 'create', address: existingAddress = null } =
    route.params || {};

  const [confirm, setConfirm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState(
    existingAddress?.address || '',
  );
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Form fields
  const [address, setAddress] = useState(existingAddress?.address || '');
  const [city, setCity] = useState(existingAddress?.city || '');
  const [state, setState] = useState(existingAddress?.state || '');
  const [country, setCountry] = useState(existingAddress?.country || '');
  const [pinCode, setPinCode] = useState(existingAddress?.pinCode || '');
  const [landmark, setLandmark] = useState(existingAddress?.landmark || '');

  // Mutations
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  // debounce for search
  const searchTimeout = useRef(null);

  useEffect(() => {
    // Initialize form with existing address data in edit mode
    if (mode === 'edit' && existingAddress) {
      setConfirm(true);
      // Initialize selectedAddress with existing coordinates if they exist
      if (existingAddress.location?.coordinates) {
        setSelectedAddress({
          lat: existingAddress.location.coordinates[1].toString(),
          lon: existingAddress.location.coordinates[0].toString(),
          display_name: existingAddress.address,
          address: {
            city: existingAddress.city,
            state: existingAddress.state,
            country: existingAddress.country,
            postcode: existingAddress.pinCode,
          },
        });
      }
    }
  }, [mode, existingAddress]);

  // Handle search input change with debounce
  const handleSearchChange = text => {
    setSearchQuery(text);
    setShowDropdown(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (text.length < 3) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&q=${encodeURIComponent(
          text,
        )}`,
        {
          headers: {
            'User-Agent': 'MyReactNativeApp/1.0 (contact@myapp.com)',
          },
        },
      )
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
        })
        .catch(err => {
          console.error('Error fetching location:', err);
          setSearchResults([]);
        });
    }, 500);
  };

  const handleSelectLocation = item => {
    setSearchQuery(item.display_name);
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedAddress(item);

    // Prefill address fields from selected location details
    setAddress(item.display_name || '');
    const addressDetails = item.address || {};
    setCity(
      addressDetails.city ||
      addressDetails.town ||
      addressDetails.village ||
      '',
    );
    setState(addressDetails.state || '');
    setCountry(addressDetails.country || '');
    setPinCode(addressDetails.postcode || '');

    setConfirm(true);
  };

  const getCoordinates = () => {
    // Priority 1: Newly selected address
    if (selectedAddress?.lat && selectedAddress?.lon) {
      return {
        lat: parseFloat(selectedAddress.lat),
        lng: parseFloat(selectedAddress.lon),
      };
    }

    // Priority 2: Existing address in edit mode
    if (mode === 'edit' && existingAddress?.location?.coordinates) {
      return {
        lat: existingAddress.location.coordinates[1],
        lng: existingAddress.location.coordinates[0],
      };
    }

    return null;
  };

  const prepareBody = () => {
    const coords = getCoordinates();

    // In edit mode, we can proceed without new coordinates if we have existing ones
    if (!coords && mode !== 'edit') {
      Alert.alert('Error', 'Coordinates not found for the selected address.');
      return null;
    }

    // Basic field validation
    if (!address || !city || !state || !country || !pinCode) {
      Alert.alert('Error', 'Please fill all required fields');
      return null;
    }

    // return {
    //   location: coords ? {
    //     type: "Point",
    //     coordinates: [coords.lng, coords.lat]
    //   } : existingAddress.location,
    //   address: address,
    //   city: city,
    //   state: state,
    //   country: country,
    //   pinCode: pinCode,
    //   landmark: landmark || undefined
    // };
    return {
      location: coords
        ? {
          type: 'Point',
          coordinates: [coords.lng, coords.lat],
        }
        : existingAddress.location,
      lat: coords?.lat,
      lng: coords?.lng,
      address: address,
      city: city,
      state: state,
      country: country,
      pinCode: pinCode,
      landmark: landmark || undefined,
    };
  };

  const handleSave = async () => {
    if (mode === 'edit' && !existingAddress?._id) {
      Alert.alert('Error', 'Missing address ID for update');
      return;
    }

    const body = prepareBody();
    if (!body) return;

    try {
      if (mode === 'edit' && existingAddress?._id) {
        await updateAddress({
          id: existingAddress._id,
          ...body,
        }).unwrap();
        Alert.alert('Success', 'Address updated successfully.');
      } else {
        await createAddress(body).unwrap();
        Alert.alert('Success', 'Address created successfully.');
      }
      navigation.goBack();
    } catch (err) {
      console.error('Failed to save address:', err);
      let errorMessage = 'Failed to save address. Please try again.';

      if (err.data) {
        if (err.data.errors) {
          errorMessage = Object.values(err.data.errors)
            .map(err => err.message)
            .join('\n');
        } else if (err.data.message) {
          errorMessage = err.data.message;
        }
      }

      Alert.alert('Error', errorMessage);
    }
  };
  const insets = useSafeAreaInsets();


  return (
    <ImageBackground
      source={require('../../assets/mapImage.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.wrapper, { top: insets.top + 0 }]}>
          <TouchableOpacity
            style={styles.leftArrow}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={24}
              color="#000"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Search location..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={() => setConfirm(false)}
            />
          </View>
          {showDropdown && searchResults.length > 0 && (
            <View style={styles.dropdown}>
              {searchResults.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectLocation(item)}
                  style={styles.dropdownItem}
                >
                  <Text
                    style={styles.dropdownText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Address Form */}
        {confirm && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.addressForm}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>
                  {mode === 'edit' ? 'Edit Address' : 'Add New Address'}
                </Text>
                <TouchableOpacity onPress={() => setConfirm(false)}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <Text style={styles.formSubtitle}>
                Complete address helps us serve you better
              </Text>

              <TextInput
                style={styles.inputField}
                placeholder="Address *"
                placeholderTextColor="#888"
                value={address}
                onChangeText={setAddress}
              />

              <TextInput
                style={styles.inputField}
                placeholder="City *"
                placeholderTextColor="#888"
                value={city}
                onChangeText={setCity}
              />

              <TextInput
                style={styles.inputField}
                placeholder="State *"
                placeholderTextColor="#888"
                value={state}
                onChangeText={setState}
              />

              <TextInput
                style={styles.inputField}
                placeholder="Country *"
                placeholderTextColor="#888"
                value={country}
                onChangeText={setCountry}
              />

              <TextInput
                style={styles.inputField}
                placeholder="Pin Code *"
                placeholderTextColor="#888"
                value={pinCode}
                onChangeText={setPinCode}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.inputField}
                placeholder="Nearby Landmark (optional)"
                placeholderTextColor="#888"
                value={landmark}
                onChangeText={setLandmark}
              />

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (isCreating || isUpdating) && { opacity: 0.6 },
                ]}
                onPress={handleSave}
                disabled={isCreating || isUpdating}
              >
                <Text style={styles.saveButtonText}>
                  {isCreating || isUpdating ? 'Saving...' : 'Save Address'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

// ... (keep your existing styles)
export default MapLocationPicker;

const styles = StyleSheet.create({
  // ... keep your existing styles here
  // add KeyboardAvoidingView and ScrollView styling support if needed
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9,
  },
  wrapper: {
    position: 'absolute',
    // top: 0,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },

  leftArrow: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
    elevation: 3,
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    elevation: 3,
  },
  dropdown: {
    position: 'absolute',
    top: 55, // adjust based on your layout
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 5,
    zIndex: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },

  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownText: {
    fontSize: 14,
    color: '#333',
    flexWrap: 'wrap', // allow text to overflow to new lines
  },

  // leftArrow: {
  //   backgroundColor: '#fff',
  //   paddingHorizontal: 6,
  //   paddingVertical: 12,
  //   borderRadius: 8,
  // },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  searchIcon: {
    marginHorizontal: 5,
  },

  // Bottom Card
  container: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 30,
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
  titleText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  addressContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
 
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  formSubtitle: {
    fontSize: 13,
    color: '#888',
    marginVertical: 10,
  },
  addressTypeRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  addressTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  selected: {
    backgroundColor: '#ecebff',
  },
  addressTypeText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 6,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wrapper: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  leftArrow: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
    elevation: 3,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  searchIcon: {
    marginHorizontal: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 5,
    zIndex: 15,
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    flexWrap: 'wrap',
  },
  addressForm: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 11,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  formSubtitle: {
    fontSize: 13,
    color: '#888',
    marginVertical: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
