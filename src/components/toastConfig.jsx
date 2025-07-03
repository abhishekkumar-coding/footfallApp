// toastConfig.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.toastContainerSuccess}>
      <View style={styles.toastTextContainer}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => Toast.hide()}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={styles.toastContainerError}>
      <View style={styles.toastTextContainer}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => Toast.hide()}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainerSuccess: {
    backgroundColor: '#4BB543',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastContainerError: {
    backgroundColor: '#D94343',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  toastTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toastMessage: {
    color: '#fff',
    fontSize: 13,
  },
});
