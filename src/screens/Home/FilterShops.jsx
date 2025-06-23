import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import CheckBox from '@react-native-community/checkbox' // make sure to install this library

const FilterShops = () => {
  const [selectedCategories, setSelectedCategories] = useState({
    Clothing: false,
    Cafe: false,
    Electronics: false,
    Bookstore: false,
    Grocery: false,
  });

  const [selectedDistances, setSelectedDistances] = useState({
    '1 km': false,
    '3 km': false,
    '5 km': false,
  });

  const [selectedRatings, setSelectedRatings] = useState({
    '4.0+': false,
    '4.5+': false,
  });

  const toggle = (stateSetter, key) => {
    stateSetter(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <LinearGradient colors={['#000337', '#000000']} style={styles.container}>
      <Text style={styles.heading}>Filter Shops</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Category Filters */}
        <Text style={styles.label}>Category</Text>
        {Object.keys(selectedCategories).map((category) => (
          <View key={category} style={styles.optionRow}>
            <Text style={styles.optionText}>{category}</Text>
            <CheckBox
              value={selectedCategories[category]}
              onValueChange={() => toggle(setSelectedCategories, category)}
              tintColors={{ true: '#3B63EF', false: '#ccc' }}
            />
          </View>
        ))}

        {/* Distance Filters */}
        <Text style={styles.label}>Distance</Text>
        {Object.keys(selectedDistances).map((distance) => (
          <View key={distance} style={styles.optionRow}>
            <Text style={styles.optionText}>Within {distance}</Text>
            <CheckBox
              value={selectedDistances[distance]}
              onValueChange={() => toggle(setSelectedDistances, distance)}
              tintColors={{ true: '#3B63EF', false: '#ccc' }}
            />
          </View>
        ))}

        {/* Rating Filters */}
        <Text style={styles.label}>Minimum Rating</Text>
        {Object.keys(selectedRatings).map((rating) => (
          <View key={rating} style={styles.optionRow}>
            <Text style={styles.optionText}>{rating}</Text>
            <CheckBox
              value={selectedRatings[rating]}
              onValueChange={() => toggle(setSelectedRatings, rating)}
              tintColors={{ true: '#3B63EF', false: '#ccc' }}
            />
          </View>
        ))}

        {/* Apply Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Apply Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default FilterShops;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  scroll: {
    paddingBottom: 50,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#3B63EF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
