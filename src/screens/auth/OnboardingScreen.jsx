import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../components/CustomButton';
import { wp, hp, SCREEN_HEIGHT } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layout/AppLayout';
import { Fonts } from '../../utils/typography';
import AppButton from '../../components/AppButton';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const slides = [
    {
      image: require('../../../assets/onboarding1.png'),
      title: t('onboarding.slides.0.title'),
      desc: t('onboarding.slides.0.desc'),
    },
    {
      image: require('../../../assets/onboarding2.png'),
      title: t('onboarding.slides.1.title'),
      desc: t('onboarding.slides.1.desc'),
    },
    {
      image: require('../../../assets/onboarding3.png'),
      title: t('onboarding.slides.2.title'),
      desc: t('onboarding.slides.2.desc'),
    },
  ];

  const handleSignin = () => {
    navigation.navigate('Login');
  };
  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <AppLayout>
      <View style={{
        paddingVertical: 25,
        flex:1
      }}>
        <Text style={styles.slogan}>{t('onboarding.slogan')}</Text>
        <Text style={styles.description}>{t('onboarding.description')}</Text>
      <FlatList
        data={slides}
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal:16,          
          gap: 20,
          // paddingVertical:25
        }}
        renderItem={({ item, index }) => (
          <View style={[styles.slideContainer, {
            flexDirection: index % 2 !== 0 ? 'row-reverse' : 'row',
            paddingLeft: index % 2 !== 0 ? 16 : 10,
            }]}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
              </View>
            </View>
        )}
      />
      </View>


     
        <View style={styles.buttonContainer2}>
          <AppButton
            title={t('onboarding.buttons.signIn')}
          onPress={handleSignin}
          hideRightIcon={true}
          isOutline={true}
        />
        <AppButton
          title={t('onboarding.buttons.signUp')}
          onPress={handleSignup}
          hideRightIcon={true}
        />
        </View>
       
    </AppLayout>

  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  slideContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    padding: 10,
    gap: 15,
    borderWidth:1,
    borderColor:  'rgba(255, 255, 255, 0.3)'
    
  },
  image: {
    width: width * 0.28,
    height: width * 0.28,
    resizeMode: 'cover',
    borderRadius: 12
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: RFValue(16, SCREEN_HEIGHT),
    color: '#fff',
    fontFamily: Fonts.primary_SemiBold,
  },
  desc: {
    fontSize: RFValue(14, SCREEN_HEIGHT),
    color: '#d3d3d3',
    fontFamily: Fonts.primary_Medium,
  },
  buttonContainer: {
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginBottom: 0,
  },
  slogan: {
    fontSize: RFValue(25, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
    textAlign: 'center',
    color: '#fff',        
  },
  description: {
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#d3d3d3',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
  },
  buttonContainer2: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 15
  },
});
