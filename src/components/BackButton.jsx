import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';

import { goBack, navigate } from '../navigations/NavigationUtil';
import LeftArrowIcon from '../utils/icons/LeftArrowIcon';
import { Fonts } from '../utils/typography';
import LinearGradient from 'react-native-linear-gradient';

const PageHeader = ({ lable, rightComponent, subTitle,back }) => {
  const handleBack = () => {
    goBack();
  };

  return (
    <>
      <LinearGradient colors={['#000337', '#000337']} >
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <View
          style={[
            styles.headerContainer,
            {
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            },
          ]}
        >
          <View style={styles.leftSection}>
            {
              back&&

            <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
              <LeftArrowIcon
                name="chevron-left"
                type="feather"
                width={24}
                height={30}
              />
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
      </LinearGradient>
    </>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,

    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 999,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center"
  },
  iconButton: {
    padding: 6,
    borderRadius: 100,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.primary_SemiBold,
    marginLeft:10,
    marginTop: 2,

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
