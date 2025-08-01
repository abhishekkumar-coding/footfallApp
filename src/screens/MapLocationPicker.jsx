import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const MapLocationPicker = () => {
  const [confirm, setConfirm] = useState(true);
  const navigation = useNavigation();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [receiverName, setReceiverName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');

  // Debounce logic to prevent rapid API calls
  let searchTimeout = null;

  const handleSearchChange = text => {
    setSearchQuery(text);
    setShowDropdown(true);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${text}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
        })
        .catch(err => {
          console.error('Error fetching location:', err);
          setSearchResults([]);
        });
    }, 500); // debounce for 500ms
  };

  const handleSelectLocation = item => {
    setSearchQuery(item.display_name);
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedAddress(item);
  };

  return (
    <ImageBackground
      source={require('../../assets/mapImage.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.wrapper}>
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
          {/*<TextInput
            style={styles.input}
            placeholder="Search location..."
            placeholderTextColor="#888"
          /> */}
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

      {confirm && <View style={styles.overlay}></View>}

      {/* Bottom Card (initial confirmation) */}
      {/* <View style={styles.container}>
        <Text style={styles.titleText}>Confirm your Address</Text>

        <View style={styles.card}>
          <View style={styles.addressContainer}>
            <Text style={styles.cardTitle}>Mathura, Sector 2</Text>
            <Text style={styles.cardSubtitle}>
              Jiva sector 21B, Block B, Industrial area{'\n'}
              Faridabad NIT - 121001
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setConfirm(!confirm)}
        >
          <Text style={styles.buttonText}>Confirm and add details</Text>
        </TouchableOpacity>
      </View> */}

      {selectedAddress && !confirm && (
        <View style={styles.container}>
          <Text style={styles.titleText}>Confirm your Address</Text>

          <View style={styles.card}>
            <View style={styles.addressContainer}>
              <Text style={styles.cardTitle}>
                {selectedAddress.display_name?.split(',')[0] ||
                  'Selected Address'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {selectedAddress.display_name}
              </Text>
            </View>
          </View>

          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => setConfirm(true)}
          >
            <Text style={styles.buttonText}>Confirm and add details</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setFullAddress(selectedAddress?.display_name || '');
              setConfirm(true); // show address form
            }}
          >
            <Text style={styles.buttonText}>Confirm and add details</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Address Details Form (when confirm is true) */}
      {confirm && (
        <View style={styles.addressForm}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Address details</Text>
            <TouchableOpacity onPress={() => setConfirm(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.formSubtitle}>
            Complete address would assist better us in serving you
          </Text>

          {/* Address Type Buttons */}
          <View style={styles.addressTypeRow}>
            <TouchableOpacity
              style={[styles.addressTypeButton, styles.selected]}
            >
              <Icon name="home" size={18} color="#6C63FF" />
              <Text style={styles.addressTypeText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addressTypeButton}>
              <Icon name="business" size={18} color="#6C63FF" />
              <Text style={styles.addressTypeText}>Office</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addressTypeButton}>
              <Icon name="people" size={18} color="#6C63FF" />
              <Text style={styles.addressTypeText}>Friend's house</Text>
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          {/* <TextInput
            style={styles.inputField}
            placeholder="Receiver's name *"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Complete address *"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Nearby Landmark (optional)"
            placeholderTextColor="#888"
          /> */}

          <TextInput
            style={styles.inputField}
            placeholder="Receiver's name *"
            placeholderTextColor="#888"
            value={receiverName}
            onChangeText={setReceiverName}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Complete address *"
            placeholderTextColor="#888"
            value={fullAddress}
            onChangeText={setFullAddress}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Nearby Landmark (optional)"
            placeholderTextColor="#888"
            value={landmark}
            onChangeText={setLandmark}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save address</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
};

export default MapLocationPicker;

const styles = StyleSheet.create({
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

  // Address Form
  addressForm: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
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
});
