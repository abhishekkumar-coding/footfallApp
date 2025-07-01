import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

const HistoryScreen = () => {
  const history = useSelector(state => state.user?.user?.scanHistory);
  console.log("History data : ", history[0].shopId)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scan History</Text>

      {(!history || history.length === 0) ? (
        <Text style={styles.empty}>No scans yet.</Text>
      ) : (
        history.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.text}>{item.value}</Text>
            <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'orange',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  empty: {
    color: '#999',
    fontSize: 16,
  },
  item: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
  date: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
});
