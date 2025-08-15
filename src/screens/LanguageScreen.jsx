import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n, { changeAppLanguage } from '../i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PageHeader from '../components/PageHeader';
import { useSelector, useDispatch } from 'react-redux';
import AppLayout from '../layout/AppLayout';
import AppButton from '../components/AppButton';
import { delay, wp } from '../utils/dimensions';
import { Fonts } from '../utils/typography';
import { useUpdateUserMutation } from '../features/auth/authApi';
import { setUser } from '../features/auth/userSlice';

const languages = [
  { code: 'en', labelKey: 'english', native: 'A' },
  { code: 'hi', labelKey: 'hindi', native: 'अ' },
];

const LanguageScreen = ({ route, navigation }) => {
  const { isInitialSetup = true } = route.params || {};
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [updateUser] = useUpdateUserMutation();
  const [selectedLang, setSelectedLang] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(state => state.user.user);
  const referralCode = useSelector(state => state.user.pendingReferral);

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
    setIsLoading(true);

    try {
      // Change app language immediately
      await changeAppLanguage(selectedLang);

      // Save to backend
      if (user?._id) {
        const res = await updateUser({
          id: user._id,
          body: { language: selectedLang },
        }).unwrap();
        console.log("Updated Response: ", res)
        dispatch(setUser(res.data));
      }

      // Save locally
      await AsyncStorage.setItem('appLanguage', selectedLang);

      await delay(1000);

      // Navigation flow
      if (referralCode) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Signup', params: { referralCode } }],
        });
      } else if (isInitialSetup) {
        navigation.replace('Onboarding');
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to update language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      {!isInitialSetup && <PageHeader back lable={t('change_language')} />}
      <View style={styles.content}>
        <View style={styles.langIconContainer}>
          <Text style={[styles.langSymbol, { top: 10, left: 0 }]}>अ</Text>
          <Text style={[styles.langSymbol, { top: 0, left: -5 }]}>A</Text>
        </View>
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
        <AppButton title={t('continue') || 'CONTINUE'} onPress={onContinue} isLoading={isLoading} />
      </View>
    </AppLayout>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 30,
    fontFamily: Fonts.primary_Medium,
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
    backgroundColor: '#fff',
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
    marginBottom: 10,
  },
  nativeText: {
    fontSize: 30,
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
  langIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    height: 100,
    marginBottom: 22,
  },
  langSymbol: {
    fontSize: wp(20),
    color: '#fff',
    fontWeight: 'semibold',
    opacity: 0.5,
  },
});
