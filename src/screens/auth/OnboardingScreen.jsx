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
    gap: 50
  },
  scrollContent: {
    width: "100%",
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 60,
    flex: 1,
    borderWidth: 2,
    borderColor: "red",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slidesContainer: {
    width: '100%',
    marginTop: 30,
  },
  slideContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  slideContainerReverse: {
    flexDirection: 'row-reverse',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  image: {
    width: width * 0.28,
    height: width * 0.28,
    resizeMode: 'contain',
    borderRadius: 12,
    marginRight: 15,
    marginLeft: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    fontFamily:"Poppins-SemiBold"
  },
  desc: {
    fontSize: 15,
    color: '#d3d3d3',
    fontFamily:"Poppins-Regular"
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  slogan: {
    fontSize: 35,
    // fontWeight: 'bold',
    fontFamily:"Poppins-SemiBold",
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  description: {
    fontSize: 20,
    fontFamily:"Poppins-Regular",
    textAlign: 'center',
    color: '#d3d3d3',
    paddingHorizontal: 30,
    paddingVertical:20
  },
  buttonContainer2:{
    flexDirection:"row",
    paddingHorizontal:120,
    gap:20,

  },
});

