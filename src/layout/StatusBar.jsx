/* eslint-disable react-hooks/exhaustive-deps */
import { StatusBar as StatusBarComponent, Platform,   } from 'react-native';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import useStatusBarHeight from '../utils/getIosStatusBarHeight';

import { View } from 'react-native';
import { STATUS_BAR_HEIGHT_ANDROID } from '../utils/dimensions';


export function StatusBar({ statusBarColor = 'transparent', barStyle, }) {
    useFocusEffect(
        React.useCallback(() => {
            StatusBarComponent.setBarStyle(barStyle ? barStyle : 'light-content');
            if (Platform.OS === 'android') {
                StatusBarComponent.setBackgroundColor(statusBarColor);
                StatusBarComponent.setTranslucent(true);
            }
        }, [ ]),
    );
}

export const StatusBarHeight = () => {    
    const statusBarHeight = useStatusBarHeight()
    return <View style={{ height: STATUS_BAR_HEIGHT_ANDROID, backgroundColor: 'transparent' }} />

}