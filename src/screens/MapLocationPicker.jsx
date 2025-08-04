// import {
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, { useState, useRef } from 'react';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';

// const MapLocationPicker = () => {
//   const [confirm, setConfirm] = useState(true);
//   const navigation = useNavigation();

//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const [receiverName, setReceiverName] = useState('');
//   const [fullAddress, setFullAddress] = useState('');
//   const [landmark, setLandmark] = useState('');

//   // Use useRef to keep the debounce timer between renders
//   const searchTimeout = useRef(null);

//   const handleSearchChange = text => {
//     setSearchQuery(text);
//     setShowDropdown(true);

//     if (searchTimeout.current) {
//       clearTimeout(searchTimeout.current);
//     }

//     // Only trigger search if text length >= 3 to reduce API calls
//     if (text.length < 3) {
//       setSearchResults([]);
//       return;
//     }

//     searchTimeout.current = setTimeout(() => {
//       fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           text
//         )}`,
//         {
//           headers: {
//             'User-Agent': 'MyReactNativeApp/1.0 (contact@myapp.com)', // Replace with your app info
//           },
//         }
//       )
//         .then(res => res.json())
//         .then(data => {
//           console.log('Search Results:', data);
//           setSearchResults(data);
//         })
//         .catch(err => {
//           console.error('Error fetching location:', err);
//           setSearchResults([]);
//         });
//     }, 500); // debounce 500ms
//   };

//   const handleSelectLocation = item => {
//     setSearchQuery(item.display_name);
//     setSearchResults([]);
//     setShowDropdown(false);
//     setSelectedAddress(item);
//   };

//   return (
//     <ImageBackground
//       source={require('../../assets/mapImage.jpeg')}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       {/* Header */}
//       <View style={styles.wrapper}>
//         <TouchableOpacity
//           style={styles.leftArrow}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <View style={styles.searchContainer}>
//           <Icon name="search" size={24} color="#000" style={styles.searchIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Search location..."
//             placeholderTextColor="#888"
//             value={searchQuery}
//             onChangeText={handleSearchChange}
//             onFocus={() => setConfirm(false)}
//           />
//         </View>
//         {showDropdown && searchResults.length > 0 && (
//           <View style={styles.dropdown}>
//             {searchResults.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => handleSelectLocation(item)}
//                 style={styles.dropdownItem}
//               >
//                 <Text
//                   style={styles.dropdownText}
//                   numberOfLines={2}
//                   ellipsizeMode="tail"
//                 >
//                   {item.display_name}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>

//       {confirm && <View style={styles.overlay}></View>}

//       {selectedAddress && !confirm && (
//         <View style={styles.container}>
//           <Text style={styles.titleText}>Confirm your Address</Text>

//           <View style={styles.card}>
//             <View style={styles.addressContainer}>
//               <Text style={styles.cardTitle}>
//                 {selectedAddress.display_name?.split(',')[0] || 'Selected Address'}
//               </Text>
//               <Text style={styles.cardSubtitle}>{selectedAddress.display_name}</Text>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => {
//               setFullAddress(selectedAddress?.display_name || '');
//               setConfirm(true); // show address form
//             }}
//           >
//             <Text style={styles.buttonText}>Confirm and add details</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Address Details Form (when confirm is true) */}
//       {confirm && (
//         <View style={styles.addressForm}>
//           <View style={styles.formHeader}>
//             <Text style={styles.formTitle}>Address Details</Text>
//             <TouchableOpacity onPress={() => setConfirm(false)}>
//               <Icon name="close" size={24} color="#000" />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.formSubtitle}>
//             Complete address would assist better us in serving you
//           </Text>

//           {/* Address Type Buttons */}
//           {/* <View style={styles.addressTypeRow}>
//             <TouchableOpacity style={[styles.addressTypeButton, styles.selected]}>
//               <Icon name="home" size={18} color="#6C63FF" />
//               <Text style={styles.addressTypeText}>Home</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.addressTypeButton}>
//               <Icon name="business" size={18} color="#6C63FF" />
//               <Text style={styles.addressTypeText}>Office</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.addressTypeButton}>
//               <Icon name="people" size={18} color="#6C63FF" />
//               <Text style={styles.addressTypeText}>Friend's house</Text>
//             </TouchableOpacity>
//           </View> */}

//           {/* Form Inputs */}
//           {/* <TextInput
//             style={styles.inputField}
//             placeholder="Receiver's name *"
//             placeholderTextColor="#888"
//             value={receiverName}
//             onChangeText={setReceiverName}
//           /> */}

//           <TextInput
//             style={styles.inputField}
//             placeholder="Complete address *"
//             placeholderTextColor="#888"
//             value={fullAddress}
//             onChangeText={setFullAddress}
//           />

//           <TextInput
//             style={styles.inputField}
//             placeholder="Nearby Landmark (optional)"
//             placeholderTextColor="#888"
//             value={landmark}
//             onChangeText={setLandmark}
//           />

//           {/* Save Button */}
//           <TouchableOpacity style={styles.saveButton}>
//             <Text style={styles.saveButtonText}>Save address</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </ImageBackground>
//   );
// };

// export default MapLocationPicker;

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     zIndex: 9,
//   },
//   wrapper: {
//     position: 'absolute',
//     top: 10,
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 20,
//   },

//   leftArrow: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 10,
//     marginRight: 8,
//     elevation: 3,
//   },

//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 50,
//     elevation: 3,
//   },
//   dropdown: {
//     position: 'absolute',
//     top: 55, // adjust based on your layout
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     elevation: 5,
//     zIndex: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//   },

//   dropdownItem: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },

//   dropdownText: {
//     fontSize: 14,
//     color: '#333',
//     flexWrap: 'wrap', // allow text to overflow to new lines
//   },

//   // leftArrow: {
//   //   backgroundColor: '#fff',
//   //   paddingHorizontal: 6,
//   //   paddingVertical: 12,
//   //   borderRadius: 8,
//   // },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#000',
//     marginLeft: 10,
//   },
//   searchIcon: {
//     marginHorizontal: 5,
//   },

//   // Bottom Card
//   container: {
//     position: 'absolute',
//     bottom: 0,
//     paddingHorizontal: 16,
//     paddingVertical: 30,
//     backgroundColor: '#fff',
//     width: '100%',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: -2 },
//     shadowRadius: 6,
//     elevation: 6,
//     zIndex: 10,
//   },
//   titleText: {
//     fontSize: 14,
//     color: '#888',
//     marginBottom: 12,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#f9f9f9',
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 16,
//     elevation: 2,
//   },
//   addressContainer: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   cardSubtitle: {
//     fontSize: 13,
//     color: '#555',
//     marginTop: 4,
//   },
//   button: {
//     backgroundColor: '#6C63FF',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // Address Form
//   addressForm: {
//     position: 'absolute',
//     bottom: 0,
//     backgroundColor: '#fff',
//     width: '100%',
//     paddingHorizontal: 20,
//     paddingVertical: 30,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     zIndex: 11,
//   },
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   formTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   formSubtitle: {
//     fontSize: 13,
//     color: '#888',
//     marginVertical: 10,
//   },
//   addressTypeRow: {
//     flexDirection: 'row',
//     marginBottom: 16,
//     justifyContent: 'space-between',
//   },
//   addressTypeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     backgroundColor: '#f1f1f1',
//   },
//   selected: {
//     backgroundColor: '#ecebff',
//   },
//   addressTypeText: {
//     fontSize: 14,
//     color: '#000',
//     marginLeft: 6,
//   },
//   inputField: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     fontSize: 14,
//     color: '#000',
//   },
//   saveButton: {
//     backgroundColor: '#6C63FF',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// import {
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import React, { useState, useEffect, useRef } from 'react';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation, useRoute } from '@react-navigation/native';

// // API Hooks
// import {
//   useCreateAddressMutation,
//   useUpdateAddressMutation,
// } from '../features/address/addressApiSlice';

// const MapLocationPicker = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { mode = 'create', address: existingAddress = null } =
//     route.params || {};

//   const [confirm, setConfirm] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState(existingAddress);
//   const [searchQuery, setSearchQuery] = useState(
//     existingAddress?.address || '',
//   );
//   const [searchResults, setSearchResults] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   // Form fields
//   const [address, setAddress] = useState(existingAddress?.address || '');
//   const [city, setCity] = useState(existingAddress?.city || '');
//   const [state, setState] = useState(existingAddress?.state || '');
//   const [country, setCountry] = useState(existingAddress?.country || '');
//   const [pinCode, setPinCode] = useState(existingAddress?.pinCode || '');
//   const [landmark, setLandmark] = useState('');

//   // Mutations
//   const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
//   const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

//   // debounce for search
//   const searchTimeout = useRef(null);

//   useEffect(() => {
//     // If edit mode, show form directly
//     if (mode === 'edit' && existingAddress) {
//       setConfirm(true);
//     }
//   }, [mode, existingAddress]);

//   // Handle search input change with debounce
//   const handleSearchChange = text => {
//     setSearchQuery(text);
//     setShowDropdown(true);

//     if (searchTimeout.current) {
//       clearTimeout(searchTimeout.current);
//     }

//     if (text.length < 3) {
//       setSearchResults([]);
//       return;
//     }

//     searchTimeout.current = setTimeout(() => {
//       fetch(
//         `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&q=${encodeURIComponent(
//           text,
//         )}`,
//         {
//           headers: {
//             'User-Agent': 'MyReactNativeApp/1.0 (contact@myapp.com)',
//           },
//         },
//       )
//         .then(res => res.json())
//         .then(data => {
//           setSearchResults(data);
//           console.log('Search Results:', data);
//         })
//         .catch(err => {
//           console.error('Error fetching location:', err);
//           setSearchResults([]);
//         });
//     }, 500);
//   };

//   const handleSelectLocation = item => {
//     setSearchQuery(item.display_name);
//     setSearchResults([]);
//     setShowDropdown(false);
//     setSelectedAddress(item);

//     // Prefill address fields from selected location details
//     setAddress(item.display_name || '');
//     // Nominatim doesn't have structured city/state/country always reliably
//     // You can parse address details if available:
//     const addressDetails = item.address || {};
//     setCity(
//       addressDetails.city ||
//         addressDetails.town ||
//         addressDetails.village ||
//         '',
//     );
//     setState(addressDetails.state || '');
//     setCountry(addressDetails.country || '');
//     setPinCode(addressDetails.postcode || '');

//     setConfirm(true);
//   };

//   // Prepare URLSearchParams body for POST/PUT
// // const prepareBody = () => {
// //   if (!selectedAddress) {
// //     Alert.alert('Error', 'Please select a valid location first.');
// //     return null;
// //   }

// //   const lat =
// //     selectedAddress.lat ||
// //     (existingAddress && existingAddress.location?.coordinates[1]);
// //   const lng =
// //     selectedAddress.lon ||
// //     (existingAddress && existingAddress.location?.coordinates[0]);

// //   if (!lat || !lng) {
// //     Alert.alert('Error', 'Coordinates not found for the selected address.');
// //     return null;
// //   }

// //   return {
// //     location: {
// //       type: "Point",
// //       coordinates: [parseFloat(lng), parseFloat(lat)]
// //     },
// //     address: address,
// //     city: city,
// //     state: state,
// //     country: country,
// //     pinCode: pinCode,
// //     landmark: landmark || undefined // send undefined instead of empty string
// //   };
// // };

// const prepareBody = () => {
//   // In edit mode, use existing coordinates if no new location was selected
//   if (mode === 'edit' && existingAddress && !selectedAddress) {
//     return {
//       location: existingAddress.location, // Use existing coordinates
//       address: address,
//       city: city,
//       state: state,
//       country: country,
//       pinCode: pinCode,
//       landmark: landmark || undefined
//     };
//   }

//   // For new address or when location was changed
//   if (!selectedAddress) {
//     Alert.alert('Error', 'Please select a valid location first.');
//     return null;
//   }

//   const lat = selectedAddress.lat ||
//              (existingAddress && existingAddress.location?.coordinates[1]);
//   const lng = selectedAddress.lon ||
//              (existingAddress && existingAddress.location?.coordinates[0]);

//   if (!lat || !lng) {
//     Alert.alert('Error', 'Coordinates not found for the selected address.');
//     return null;
//   }

//   return {
//     location: {
//       type: "Point",
//       coordinates: [parseFloat(lng), parseFloat(lat)]
//     },
//     address: address,
//     city: city,
//     state: state,
//     country: country,
//     pinCode: pinCode,
//     landmark: landmark || undefined
//   };
// };

// const handleSave = async () => {
//   const body = prepareBody();
//   if (!body) return;

//   try {
//     if (mode === 'edit' && existingAddress?._id) {
//       // Update address
//       const response = await updateAddress({
//         id: existingAddress._id, // Make sure this is the correct ID
//         ...body  // Spread all body properties
//       }).unwrap();

//       console.log('Update response:', response); // Debug log
//       Alert.alert('Success', 'Address updated successfully.');
//     } else {
//       // Create address
//       const response = await createAddress(body).unwrap();
//       console.log('Create response:', response); // Debug log
//       Alert.alert('Success', 'Address created successfully.');
//     }
//     navigation.goBack();
//   } catch (err) {
//     console.error('Failed to save address:', err);
//     let errorMessage = 'Failed to save address. Please try again.';

//     if (err.data) {
//       if (err.data.errors) {
//         errorMessage = Object.values(err.data.errors)
//           .map(err => err.message)
//           .join('\n');
//       } else if (err.data.message) {
//         errorMessage = err.data.message;
//       }
//     }

//     Alert.alert('Error', errorMessage);
//   }
// };

//   return (
//     <ImageBackground
//       source={require('../../assets/mapImage.jpeg')}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       {/* Header */}
//       <View style={styles.wrapper}>
//         <TouchableOpacity
//           style={styles.leftArrow}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <View style={styles.searchContainer}>
//           <Icon
//             name="search"
//             size={24}
//             color="#000"
//             style={styles.searchIcon}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Search location..."
//             placeholderTextColor="#888"
//             value={searchQuery}
//             onChangeText={handleSearchChange}
//             onFocus={() => setConfirm(false)}
//           />
//         </View>
//         {showDropdown && searchResults.length > 0 && (
//           <View style={styles.dropdown}>
//             {searchResults.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => handleSelectLocation(item)}
//                 style={styles.dropdownItem}
//               >
//                 <Text
//                   style={styles.dropdownText}
//                   numberOfLines={2}
//                   ellipsizeMode="tail"
//                 >
//                   {item.display_name}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>

//       {/* Address Form */}
//       {confirm && (
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           style={styles.addressForm}
//         >
//           <ScrollView keyboardShouldPersistTaps="handled">
//             <View style={styles.formHeader}>
//               <Text style={styles.formTitle}>
//                 {mode === 'edit' ? 'Edit Address' : 'Add New Address'}
//               </Text>
//               <TouchableOpacity onPress={() => setConfirm(false)}>
//                 <Icon name="close" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.formSubtitle}>
//               Complete address helps us serve you better
//             </Text>

//             <TextInput
//               style={styles.inputField}
//               placeholder="Address *"
//               placeholderTextColor="#888"
//               value={address}
//               onChangeText={setAddress}
//             />

//             <TextInput
//               style={styles.inputField}
//               placeholder="City *"
//               placeholderTextColor="#888"
//               value={city}
//               onChangeText={setCity}
//             />

//             <TextInput
//               style={styles.inputField}
//               placeholder="State *"
//               placeholderTextColor="#888"
//               value={state}
//               onChangeText={setState}
//             />

//             <TextInput
//               style={styles.inputField}
//               placeholder="Country *"
//               placeholderTextColor="#888"
//               value={country}
//               onChangeText={setCountry}
//             />

//             <TextInput
//               style={styles.inputField}
//               placeholder="Pin Code *"
//               placeholderTextColor="#888"
//               value={pinCode}
//               onChangeText={setPinCode}
//               keyboardType="numeric"
//             />

//             <TextInput
//               style={styles.inputField}
//               placeholder="Nearby Landmark (optional)"
//               placeholderTextColor="#888"
//               value={landmark}
//               onChangeText={setLandmark}
//             />

//             <TouchableOpacity
//               style={[
//                 styles.saveButton,
//                 (isCreating || isUpdating) && { opacity: 0.6 },
//               ]}
//               onPress={handleSave}
//               disabled={isCreating || isUpdating}
//             >
//               <Text style={styles.saveButtonText}>
//                 {isCreating || isUpdating ? 'Saving...' : 'Save Address'}
//               </Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       )}
//     </ImageBackground>
//   );
// };

// export default MapLocationPicker;

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
      lat: coords?.lat, // ✅ Add this
      lng: coords?.lng, // ✅ Add this
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
    // maxHeight: '60%',
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
