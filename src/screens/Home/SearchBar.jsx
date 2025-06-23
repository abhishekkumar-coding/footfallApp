import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import SearchIcon from '../../utils/icons/SearchIcon'
import ScannerIcon from '../../utils/icons/ScannerIcon'

const SearchBar = () => {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <SearchIcon />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for shops or items"
                    placeholderTextColor="#d3d3d3"
                />
            </View>
            {/* <ScannerIcon /> */}
        </View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal:15,
        borderWidth:1,
        borderColor:"#d3d3d3",
        borderRadius:15,
        paddingVertical:5,
        marginVertical:20
    },
    inputContainer:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        gap:10

    },
    searchInput:{
        fontFamily:"Poppins-Regular",
        fontSize:18,
    },
})