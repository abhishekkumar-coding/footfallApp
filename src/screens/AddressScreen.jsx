import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PageHeader from '../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function AddressScreen() {
    const navigation = useNavigation();
    const [addresses, setAddresses] = useState([
        { id: '1', type: 'Home', icon: 'home', address: 'W3-092, 9th Floor, Wellington Estate, Near DLF Phase 5 Club, Opposite ...' },
        { id: '2', type: 'Office', icon: 'office-building', address: 'W3-092, 9th Floor, Wellington Estate, Near DLF Phase 5 Club, Opposite ...' },
        { id: '3', type: "Abhi's House", icon: 'account', address: 'W3-092, 9th Floor, Wellington Estate, Near DLF Phase 5 Club, Opposite ...' },
        { id: '4', type: 'Other Location', icon: 'map-marker', address: 'W3-092, 9th Floor, Wellington Estate, Near DLF Phase 5 Club, Opposite ...' },
    ]);

    const [selectedId, setSelectedId] = useState(null); // Track selected card

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const renderAddress = ({ item }) => {
        const isSelected = selectedId === item.id;
        return (
            <TouchableOpacity 
                style={[styles.card, isSelected && styles.selectedCard]} 
                onPress={() => handleSelect(item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.row}>
                    <Icon name={item.icon} size={22} color="#5A67D8" />
                    <Text style={styles.title}>{item.type}</Text>
                </View>
                <Text style={styles.address}>{item.address}</Text>
                <TouchableOpacity style={styles.editBtn}>
                    <Icon name="dots-horizontal" size={22} color="#aaa" />
                </TouchableOpacity>
                {/* Radio Indicator */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
            <View style={styles.screen}>
                <PageHeader back lable={"Address"} />
                <View style={styles.container}>
                    {/* Add New Address Button */}
                    <TouchableOpacity style={styles.addBtn} onPress={()=>navigation.navigate("MapLocationPicker")}>
                        <Icon name="plus" size={20} color="#fff" />
                        <Text style={styles.addBtnText}>Add New Address</Text>
                    </TouchableOpacity>

                    {/* Saved Addresses */}
                    <FlatList
                        data={addresses}
                        renderItem={renderAddress}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#000337' },
    container: { flex: 1, padding: 16, paddingBottom: Platform.OS === 'ios' ? 30 : 16 },

    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 14,
        paddingVertical: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5 },
            android: { elevation: 3 },
        }),
    },
    addBtnText: { color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 16 },

    card: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6 },
            android: { elevation: 2 },
        }),
        position: 'relative',
    },
    selectedCard: {
        borderColor: '#5A67D8',
        backgroundColor: 'rgba(90, 103, 216, 0.15)', // Highlighted
    },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    title: { fontSize: 16, fontWeight: '600', color: '#fff', marginLeft: 8 },
    address: { color: '#ddd', fontSize: 14, marginBottom: 6, lineHeight: 20 },
    editBtn: { position: 'absolute', right: 12, top: 12 },

    // Radio Button
    radioOuter: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#aaa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: { borderColor: '#5A67D8' },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#5A67D8',
    },
});
