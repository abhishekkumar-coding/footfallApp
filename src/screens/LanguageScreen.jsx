import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n, { changeAppLanguage } from '../i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import PageHeader from '../components/PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import AppLayout from '../layout/AppLayout';
import AppButton from '../components/AppButton';
import { delay, hp, wp } from '../utils/dimensions';
import { Fonts } from '../utils/typography';


const languages = [
  { code: 'en', labelKey: 'english', native: 'A' },
  { code: 'hi', labelKey: 'हिन्दी', native: 'अ' },
];



const LanguageScreen = ({ route, navigation }) => {
  const { isInitialSetup = true } = route.params || {};
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const initLang = async () => {
      const storedLang = await AsyncStorage.getItem('appLanguage');
      const currentLang = storedLang || i18n.language || 'en';
      setSelectedLang(currentLang);
    };
    initLang();
  }, []);

    const referralCode = useSelector(state => state.user.pendingReferral);


  // const onContinue = async () => {
  //   if (!selectedLang) return;
  //   await changeAppLanguage(selectedLang);
  //   await AsyncStorage.setItem('appLanguage', selectedLang);

  //   if (isInitialSetup) {
  //     navigation.replace('Onboarding');
  //   } else {
  //     navigation.goBack();
  //   }
  // };

  const onContinue = async () => {
    if (!selectedLang) return;
    setIsLoading(true);
    await delay(1500);
  await changeAppLanguage(selectedLang);
  await AsyncStorage.setItem('appLanguage', selectedLang);

  if (referralCode) {
    // 🔹 If referral exists, go directly to Signup with code
    navigation.reset({
      index: 0,
      routes: [{ name: 'Signup', params: { referralCode } }],
    });
    return;
  }

  if (isInitialSetup) {
    navigation.replace('Onboarding');
  } else {
    navigation.goBack();
  }
  setIsLoading(false);
};


  return (
    <AppLayout >
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


  continueTouchable: {
    // height: 50,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
  },

  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  langIconContainer:{
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
  }
  
});
