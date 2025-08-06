import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { goBack, navigate } from '../navigations/NavigationUtil';
import LeftArrowIcon from '../utils/icons/LeftArrowIcon';
import { Fonts } from '../utils/typography';
import LinearGradient from 'react-native-linear-gradient';
import { hp, SCREEN_HEIGHT, SCREEN_WIDTH, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PageHeader = ({ lable, rightComponent, subTitle, back, bg }) => {
  const handleBack = () => {
    goBack();
  };

  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.leftSection}>
        {
          back &&
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
           <MaterialIcons name="arrow-back" size={22} color={'#fff'}/>
          </TouchableOpacity>
        }
        <View>
          <Text style={[styles.title, { color: '#fff' }]}>{lable}</Text>
          {subTitle && (
            <View style={styles.subTitleBox}>
              <Text style={[styles.subTitle, { color: '#fff' }]}>
                {subTitle}
              </Text>
            </View>
          )}
        </View>
      </View>
      {rightComponent && (
        <View style={styles.rightSection}>{rightComponent}</View>
      )}
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent', 
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    zIndex: 999,
    paddingBottom: 14,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    gap: 12,
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,

  },
  iconButtonBg: {
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingVertical: wp(1.3),
    paddingHorizontal: wp(2)
  },
  title: {
    fontSize: RFValue(20, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
  },
  subTitleBox: {
    marginTop: 4,
  },
  subTitle: {
    fontSize: 12,
    fontFamily: Fonts.primary_SemiBold,
  },
  rightSection: {
    marginLeft: 8,
  },
});
