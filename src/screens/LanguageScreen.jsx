// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import i18n, { changeAppLanguage } from '../i18n';
// import { useTranslation } from 'react-i18next';
// import LinearGradient from 'react-native-linear-gradient';
// import PageHeader from '../components/BackButton'; // adjust the path if needed

// const languages = [
//   { code: 'en', label: 'English' },
//   { code: 'hi', label: 'हिन्दी' },
// ];

// const LanguageScreen = ({ route, navigation }) => {
//   const { isInitialSetup = true } = route.params || {};
//   const [selectedLang, setSelectedLang] = useState(null);
//   const { t } = useTranslation();

//   const onContinue = async () => {
//     if (!selectedLang) return;

//     await changeAppLanguage(selectedLang);
//     await AsyncStorage.setItem('appLanguage', selectedLang);

//     if (isInitialSetup) {
//       navigation.replace('Onboarding');
//     } else {
//       navigation.goBack();
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.langButton,
//         selectedLang === item.code && styles.selectedLangButton,
//       ]}
//       onPress={() => setSelectedLang(item.code)}
//     >
//       <Text
//         style={[
//           styles.langText,
//           selectedLang === item.code && styles.selectedLangText,
//         ]}
//       >
//         {item.label}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <LinearGradient colors={['#000337', '#000000']} style={styles.gradient}>
//       <PageHeader label={t('language')} back />

//       <View style={styles.container}>
//         <Text style={styles.title}>{t('selectLanguage')}</Text>

//         <FlatList
//           data={languages}
//           keyExtractor={(item) => item.code}
//           renderItem={renderItem}
//           contentContainerStyle={styles.list}
//         />

//         <TouchableOpacity
//           onPress={onContinue}
//           disabled={!selectedLang}
//           style={[
//             styles.continueButton,
//             { opacity: selectedLang ? 1 : 0.5 },
//           ]}
//         >
//           <Text style={styles.continueText}>{t('continue')}</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// };

// export default LanguageScreen;

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: 'white',
//     marginBottom: 32,
//   },
//   langButton: {
//     padding: 16,
//     borderRadius: 8,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 12,
//     backgroundColor: 'white',
//   },
//   selectedLangButton: {
//     backgroundColor: '#27282F',
//     borderColor: '#27282F',
//   },
//   langText: {
//     fontSize: 18,
//     textAlign: 'center',
//     color: 'black',
//   },
//   selectedLangText: {
//     color: 'white',
//   },
//   list: {
//     marginBottom: 40,
//   },
//   continueButton: {
//     backgroundColor: '#27282F',
//     padding: 16,
//     borderRadius: 8,
//   },
//   continueText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n, { changeAppLanguage } from '../i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import PageHeader from '../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

// const languages = [
//   { code: 'en', label: 'English', native: 'A' },
//   { code: 'hi', label: 'Hindi', native: 'अ' },
// ];

const languages = [
  { code: 'en', labelKey: 'english', native: 'A' },
  { code: 'hi', labelKey: 'hindi', native: 'अ' },
];

const LanguageScreen = ({ route, navigation }) => {
  const { isInitialSetup = true } = route.params || {};
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(null);

  useEffect(() => {
    const initLang = async () => {
      const storedLang = await AsyncStorage.getItem('appLanguage');
      const currentLang = storedLang || i18n.language || 'en';
      setSelectedLang(currentLang);
    };
    initLang();
  }, []);

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

  return (
        <SafeAreaView style={{ flex: 1 }}>

    <LinearGradient colors={['#000337', '#000337']} style={styles.gradient}>
      <PageHeader back bg />
      <View style={styles.content}>
        {/* <View style={styles.topEmojiContainer}>
          <View style={styles.emojiWrapper}>
            <Text style={styles.bubble}>Hello!</Text>
            <Text style={styles.emoji}>😊</Text>
          </View>
          <View style={styles.emojiWrapper}>
            <Text style={[styles.bubble, { backgroundColor: '#FF4D6D' }]}>नमस्ते</Text>
            <Text style={styles.emoji}>😊</Text>
          </View>
        </View> */}

        <Text style={styles.title}>{t('chooseLanguage')}</Text>

        <View style={styles.langContainer}>
          {languages.map(lang => {
            const isSelected = selectedLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langCard, isSelected && styles.langCardSelected]}
                onPress={() => setSelectedLang(lang.code)}
              >
                <View style={styles.langIcon}>
                  <Text
                    style={[
                      styles.nativeText,
                      isSelected && styles.nativeTextSelected,
                    ]}
                  >
                    {lang.native}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.langLabel,
                    isSelected && styles.langLabelSelected,
                  ]}
                >
                  {t(lang.labelKey)}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Icon name="check-circle" size={20} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        {/* <LinearGradient
          colors={['#FF6BD6', '#FF2DCF']}
          style={styles.continueBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.continueText}>{t('continue') || 'CONTINUE'}</Text>
          <Icon
            name="arrow-forward"
            size={20}
            color="white"
            style={{ marginLeft: 8 }}
          />
        </LinearGradient> */}
        <LinearGradient
          colors={['#FF6BD6', '#FF2DCF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.continueBtn, { opacity: selectedLang ? 1 : 0.5 }]}
        >
          <TouchableOpacity
            onPress={onContinue}
            disabled={!selectedLang}
            style={styles.continueTouchable}
          >
            <Text style={styles.continueText}>
              {t('continue') || 'CONTINUE'}
            </Text>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
    </SafeAreaView>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topEmojiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emojiWrapper: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  bubble: {
    backgroundColor: '#FF6B6B',
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    fontSize: 14,
  },
  emoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  langContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    width: '100%',
  },
  langCard: {
    width: 120,
    height: 120,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  langCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  langIcon: {
    marginBottom: 8,
  },
  nativeText: {
    fontSize: 28,
    color: '#555',
  },
  nativeTextSelected: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  langLabel: {
    fontSize: 16,
    color: '#555',
  },
  langLabelSelected: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  continueBtn: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 10,
  },

  continueTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally inside button
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
