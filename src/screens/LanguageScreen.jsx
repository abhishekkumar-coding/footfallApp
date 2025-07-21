import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { changeAppLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import PageHeader from '../components/BackButton'; // adjust the path if needed

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
    <LinearGradient colors={['#000337', '#000000']} style={styles.gradient}>
      <PageHeader label={t('language')} back />

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
    </LinearGradient>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 32,
  },
  langButton: {
    padding: 16,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  selectedLangButton: {
    backgroundColor: '#27282F',
    borderColor: '#27282F',
  },
  langText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
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
