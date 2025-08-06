import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Fonts } from '../utils/typography'
import { SCREEN_HEIGHT } from '../utils/dimensions'
import { RFValue } from 'react-native-responsive-fontsize'
import { useTranslation } from 'react-i18next'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
        
const ViewAllButton = ({ onPress }) => {
  const { t } = useTranslation()
  return (
    <TouchableOpacity style={styles.container} onPress={()=>onPress&&onPress()} activeOpacity={0.9}>
          <Text style={styles.text}>{t('view_all')}</Text>
    </TouchableOpacity>
  )
}

export default ViewAllButton

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'center',
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    text: {
        fontFamily: Fonts.primary_SemiBold,
        fontSize: RFValue(14, SCREEN_HEIGHT),
        color: '#fff',
        lineHeight: RFValue(15, SCREEN_HEIGHT),
    },
})