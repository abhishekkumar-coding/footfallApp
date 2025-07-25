// src/utils/DynamicLinkHandler.js
import { useEffect } from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setPendingReferral } from '../features/auth/userSlice';

function getQueryParam(url, param) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get(param);
  } catch (e) {
    console.log("Invalid URL:", url);
    return null;
  }
}

const DynamicLinkHandler = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleDynamicLink = (link) => {
    if (link?.url) {
      const referralCode = getQueryParam(link.url, 'code');
      if (referralCode) {
        console.log("Referral Code from Dynamic Link:", referralCode);
        // Save referral code in Redux
        dispatch(setPendingReferral(referralCode));
        // Force navigate to Signup (even if user is logged in)
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Signup', params: { referralCode } }],
          });
        }, 500); // slight delay to ensure navigator is mounted
      }
    }
  };

  useEffect(() => {
    // App is already open
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

    // App cold start
    dynamicLinks().getInitialLink().then(link => {
      if (link) handleDynamicLink(link);
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default DynamicLinkHandler;
