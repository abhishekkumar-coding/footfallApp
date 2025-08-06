import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  Share,
  Platform,
  Clipboard,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '../components/PageHeader';
import { hp, SCREEN_HEIGHT, STATUS_BAR_HEIGHT_ANDROID, wp } from '../utils/dimensions';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../layout/AppLayout';
import PageHeader from '../components/PageHeader';
import { Fonts } from '../utils/typography';
import useStatusBarHeight from '../utils/getIosStatusBarHeight';
import PointScreen from './Referral/PointScreen';
import ReferralHistory from './Referral/ReferralHistory';
import Faq from './Referral/Faq';

const headerButton = [
  {
    title: "Points",
    label: "points",
  },
  // {
  //   title: "Referral History",
  //   label: "history",
  // },
  {
    title: "FAQ",
    label: "faq",
  },
]
const ReferralScreen = () => {
  const { t } = useTranslation();
  const [activeScreen, setActiveScreen] = useState("points");


  return (
    <AppLayout showCircle={false} >

      <PageHeader lable={t('referral.title')} back />
      <View style={styles.headerButtonContainer}>
        {headerButton.map((item) => {
          return <TouchableOpacity style={[
            styles.headerButton,
            activeScreen === item.label && { backgroundColor: "#8b05eb" }
          ]} onPress={() => setActiveScreen(item.label)}
            activeOpacity={0.9}
          >
            <Text style={styles.headerButtonText}>{item.title}</Text>
          </TouchableOpacity>
        })}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {activeScreen === "points" && <PointScreen />}
        {activeScreen === "history" && <ReferralHistory />}
        {activeScreen === "faq" && <Faq />}
      </ScrollView>
    </AppLayout >
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: hp(5),
    paddingHorizontal: 20,
    flexGrow: 1
  },
  header: {
    position: 'absolute',

  },

  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 20
  },
  headerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
  },
  headerButtonText: {
    fontSize: RFValue(12, SCREEN_HEIGHT),
    color: '#fff',
    fontFamily: Fonts.primary_SemiBold,
    lineHeight: 18
  }
});

export default ReferralScreen;
