// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useTranslation } from 'react-i18next';
// import { changeAppLanguage } from '../i18n';
// import { useNavigation } from '@react-navigation/native';

// const LanguageScreen = () => {
//   const { t, i18n } = useTranslation();
//   const navigation = useNavigation();

// const onLanguageSelect = async (lang) => {
//   await changeAppLanguage(lang);
//   await AsyncStorage.setItem('appLanguage', lang);
//   // Navigate to Onboarding after selecting language
//   navigation.replace('Onboarding');
// };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>{t('select_language')}</Text>

//       <TouchableOpacity style={styles.button} onPress={() => onLanguageSelect('en')}>
//         <Text style={styles.buttonText}>{t('english')}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={() => onLanguageSelect('hi')}>
//         <Text style={styles.buttonText}>{t('hindi')}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default LanguageScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
//   heading: { color: 'white', fontSize: 22, marginBottom: 40 },
//   button: {
//     backgroundColor: '#222',
//     paddingVertical: 14,
//     paddingHorizontal: 28,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   buttonText: { color: 'white', fontSize: 18 },
// });





// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useTranslation } from 'react-i18next';
// import { changeAppLanguage } from '../i18n';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';

// const LanguageScreen = () => {
//   const { t } = useTranslation();
//   const navigation = useNavigation();
//   const [selectedLang, setSelectedLang] = useState(null);

//   const onLanguageSelect = (lang) => {
//     setSelectedLang(lang);
//   };

//   const onContinue = async () => {
//     if (!selectedLang) return;
//     try {
//       await changeAppLanguage(selectedLang);
//       await AsyncStorage.setItem('appLanguage', selectedLang);  // Save language
//       navigation.replace('Onboarding');  // Navigate and remove LanguageScreen from stack
//     } catch (e) {
//       console.error('Failed to set language', e);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>{t('select_language')}</Text>

//       <TouchableOpacity
//         style={[
//           styles.button,
//           selectedLang === 'en' && styles.selectedButton,
//         ]}
//         onPress={() => onLanguageSelect('en')}
//       >
//         <Text style={styles.buttonText}>{t('english')}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[
//           styles.button,
//           selectedLang === 'hi' && styles.selectedButton,
//         ]}
//         onPress={() => onLanguageSelect('hi')}
//       >
//         <Text style={styles.buttonText}>{t('hindi')}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.continueButton, !selectedLang && styles.disabledButton]}
//         onPress={onContinue}
//         disabled={!selectedLang}
//       >
//         <Text style={styles.continueButtonText}>Continue</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default LanguageScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
//   heading: { color: 'white', fontSize: 22, marginBottom: 40 },
//   button: {
//     backgroundColor: '#222',
//     paddingVertical: 14,
//     paddingHorizontal: 28,
//     borderRadius: 10,
//     marginBottom: 20,
//     width: 200,
//     alignItems: 'center',
//   },
//   selectedButton: {
//     backgroundColor: '#FF4D00',
//   },
//   buttonText: { color: 'white', fontSize: 18 },
//   continueButton: {
//     backgroundColor: '#FF4D00',
//     paddingVertical: 14,
//     paddingHorizontal: 60,
//     borderRadius: 10,
//     marginTop: 30,
//   },
//   disabledButton: {
//     backgroundColor: '#555',
//   },
//   continueButtonText: {
//     color: 'white',
//     fontSize: 18,
//   },
// });






import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { changeAppLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
];

const LanguageScreen = ({ route, navigation }) => {
  const { isInitialSetup = true } = route.params || {};
  const [selectedLang, setSelectedLang] = useState(null);
  const { t } = useTranslation();

  const onContinue = async () => {
    if (!selectedLang) return;

    await changeAppLanguage(selectedLang);
    await AsyncStorage.setItem('appLanguage', selectedLang);

    if (isInitialSetup) {
      navigation.replace('Onboarding');
    } else {
      navigation.goBack();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.langButton,
        selectedLang === item.code && styles.selectedLangButton,
      ]}
      onPress={() => setSelectedLang(item.code)}
    >
      <Text
        style={[
          styles.langText,
          selectedLang === item.code && styles.selectedLangText,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('selectLanguage')}</Text>

      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        onPress={onContinue}
        disabled={!selectedLang}
        style={[
          styles.continueButton,
          { opacity: selectedLang ? 1 : 0.5 },
        ]}
      >
        <Text style={styles.continueText}>{t('continue')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  langButton: {
    padding: 16,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
  },
  selectedLangButton: {
    backgroundColor: '#27282F',
    borderColor: '#27282F',
  },
  langText: {
    fontSize: 18,
    textAlign: 'center',
  },
  selectedLangText: {
    color: 'white',
  },
  list: {
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#27282F',
    padding: 16,
    borderRadius: 8,
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
