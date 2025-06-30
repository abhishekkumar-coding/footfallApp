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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../components/CustomButton';
import { wp, hp } from '../../utils/dimensions'; 
import { RFValue } from 'react-native-responsive-fontsize';


const { width } = Dimensions.get('window');

const slides = [
  {
    image: require('../../../assets/onboarding1.png'),
    title: 'Discover Local Shops',
    desc: 'Find the best deals and shops near you.',
  },
  {
    image: require('../../../assets/onboarding2.png'),
    title: 'Earn Rewards',
    desc: 'Scan QR codes and earn points with every visit.',
  },
  {
    image: require('../../../assets/onboarding3.png'),
    title: 'Spin & Win',
    desc: 'Play games and win discounts & rewards.',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleSignin = () => {
    navigation.navigate('Login');
  };
  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <LinearGradient colors={['#000337', '#000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.slidesContainer}>
          {slides.map((slide, index) => (
            <View
              key={index}
              style={[
                styles.slideContainer,
                index % 2 !== 0 && styles.slideContainerReverse,
              ]}
            >
              <Image source={slide.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.desc}>{slide.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.slogan}>Explore Stores Around You</Text>
          <Text style={styles.description}>
            Discover nearby shops, earn rewards, and unlock fun deals every day!
          </Text>
          <View style={styles.buttonContainer2}>
            <CustomButton  backgroundColor='transparent' borderWidth={1} title={"Sign In"} onPress={handleSignin} />
            <CustomButton  backgroundColor='#FF4D00' borderWidth={1} title={"Sign Up"} onPress={handleSignup}/>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: hp(5)
  },
  // scrollContent: {
  //   width: "100%",
  //   alignItems: 'center',
  //   paddingVertical: 30,
  //   paddingBottom: 60,
  //   flex: 1,
  //   borderWidth: 2,
  //   borderColor: "red",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
  slidesContainer: {
    width: '100%',
    marginTop: hp(5),
    paddingHorizontal:wp(2)
  },
  slideContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: wp(6),
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    marginVertical: hp(1.5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: wp(2),
    elevation: 8,
  },
  slideContainerReverse: {
    flexDirection: 'row-reverse',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    textAlign:"right"
  },
  image: {
    width: width * 0.28,
    height: width * 0.28,
    resizeMode: 'contain',
    borderRadius: wp(4),
    marginRight: wp(4),
    marginLeft: wp(4),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: RFValue(11),
    // fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(0.8),
    fontFamily:"Poppins-SemiBold"
  },
  desc: {
    fontSize: wp(3),
    color: '#d3d3d3',
    fontFamily:"Poppins-Regular"
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  slogan: {
    fontSize:RFValue(15),
    // fontWeight: 'bold',
    fontFamily:"Poppins-SemiBold",
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  description: {
    fontSize: RFValue(12),
    fontFamily:"Poppins-Regular",
    textAlign: 'center',
    color: '#d3d3d3',
    paddingHorizontal: wp(6),
    paddingVertical:hp(1.5)
  },
  buttonContainer2:{
    flexDirection:"row",
    paddingHorizontal:wp(28.2),
    gap:wp(5),

  },
});

