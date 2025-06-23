import { FlatList, View, Text, StyleSheet, Image, ScrollView, Touchable, TouchableOpacity } from 'react-native';
import PhoneIcon from '../../utils/icons/PhoneIcon';
import { hp, wp } from '../../utils/dimensions';
// import { Image } from 'react-native-svg';

const shopData = [
    {
        id: '1',
        name: 'Trendy Fashion',
        category: 'Clothing',
        rating: 4.5,
        location: 'Sector 22, Noida',
        image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=60',
        address: 'Shop #12, Main Market, Sector 22, Noida, Uttar Pradesh',
        timings: '10:00 AM - 9:00 PM',
        contact: '+91 9876543210'
    },
    {
        id: '2',
        name: 'Cafe Aroma',
        category: 'Cafe',
        rating: 4.2,
        location: 'Connaught Place, Delhi',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=60',
        address: 'K-Block, Outer Circle, Connaught Place, New Delhi, Delhi',
        timings: '8:00 AM - 11:00 PM',
        contact: '+91 9123456780'
    },
    {
        id: '3',
        name: 'Gadget World',
        category: 'Electronics',
        rating: 4.7,
        location: 'MG Road, Bangalore',
        image: 'https://images.unsplash.com/photo-1580910051070-d8c03c7c1d78?auto=format&fit=crop&w=800&q=60',
        address: '15, Commercial Street, MG Road, Bengaluru, Karnataka',
        timings: '10:30 AM - 8:00 PM',
        contact: '+91 9988776655'
    },
    {
        id: '4',
        name: 'Book Nest',
        category: 'Bookstore',
        rating: 4.6,
        location: 'Park Street, Kolkata',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=60',
        address: '42, Park Street, Kolkata, West Bengal',
        timings: '9:00 AM - 9:00 PM',
        contact: '+91 9812345678'
    },
    {
        id: '5',
        name: 'Fresh Mart',
        category: 'Grocery',
        rating: 4.3,
        location: 'Andheri West, Mumbai',
        image: 'https://images.unsplash.com/photo-1586864381182-63c15f6f52f2?auto=format&fit=crop&w=800&q=60',
        address: 'Shop #8, Lokhandwala Market, Andheri West, Mumbai, Maharashtra',
        timings: '7:00 AM - 10:00 PM',
        contact: '+91 9090909090'
    },
    {
        id: '6',
        name: 'Fitness Pro',
        category: 'Gym',
        rating: 4.1,
        location: 'Sector 18, Noida',
        image: 'https://images.unsplash.com/photo-1583454110550-19d1f9f4143b?auto=format&fit=crop&w=800&q=60',
        address: 'Top Floor, Wave Mall, Sector 18, Noida, Uttar Pradesh',
        timings: '6:00 AM - 10:00 PM',
        contact: '+91 9811112233'
    },
    {
        id: '7',
        name: 'Quick Cuts',
        category: 'Salon',
        rating: 4.4,
        location: 'Bandra, Mumbai',
        image: 'https://images.unsplash.com/photo-1600962815700-820a2a321173?auto=format&fit=crop&w=800&q=60',
        address: 'Plot 3, Pali Hill, Bandra West, Mumbai, Maharashtra',
        timings: '10:00 AM - 9:00 PM',
        contact: '+91 9876543200'
    },
    {
        id: '8',
        name: 'Daily Delight',
        category: 'Bakery',
        rating: 4.6,
        location: 'Indiranagar, Bangalore',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=60',
        address: 'Block A, CMH Road, Indiranagar, Bengaluru, Karnataka',
        timings: '9:00 AM - 10:00 PM',
        contact: '+91 9876501234'
    },
    {
        id: '9',
        name: 'Plant House',
        category: 'Home Decor',
        rating: 4.8,
        location: 'Banjara Hills, Hyderabad',
        image: 'https://images.unsplash.com/photo-1608136887611-4c2cc9e22ec0?auto=format&fit=crop&w=800&q=60',
        address: 'Lane 5, Road No. 12, Banjara Hills, Hyderabad, Telangana',
        timings: '10:00 AM - 8:00 PM',
        contact: '+91 9123401230'
    },
    {
        id: '10',
        name: 'Urban Wear',
        category: 'Clothing',
        rating: 4.0,
        location: 'Karol Bagh, Delhi',
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=60',
        address: 'Shop 202, Ajmal Khan Road, Karol Bagh, New Delhi, Delhi',
        timings: '11:00 AM - 9:00 PM',
        contact: '+91 9876543289'
    }
];



const ShopList = ({ navigation }) => {

    const handleViewAll = () => navigation.navigate("AllShops", { shopsData: shopData })

    console.log(`shoplist = ${navigation.getState()}`)

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ShopDetails', { shop: item })}>
            <Image
                style={styles.cardImage}
                source={{ uri: item.image }}
            />
            <View style={{ padding: 10, alignItems: "flex-start", flex: 1, justifyContent: "space-between" }}>
                <Text style={styles.category}>{item.category}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.details}>⭐ {item.rating}</Text>
                </View>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.timings}>{item.timings}</Text>
                {/* <TouchableOpacity style={styles.contactButton} ><View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}><PhoneIcon/> <Text style={styles.contact}> {item.contact}</Text></View></TouchableOpacity> */}
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={shopData}
            renderItem={renderItem}
            keyExtractor={item => item.id} a
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><Text style={styles.heading}>Nearby Shops</Text><TouchableOpacity onPress={handleViewAll}><Text style={[styles.heading, { fontSize: wp(3) }]}>View All</Text></TouchableOpacity></View>}
            contentContainerStyle={{ gap: 15 }}
            numColumns={2}
        />
    );
};

export default ShopList;
const styles = StyleSheet.create({
    listWrapper: {
        // paddingHorizontal: 20,
        paddingTop: hp(1),
        paddingBottom:hp(10)
    },
    heading: {
        fontSize: wp(5),
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        marginBottom: hp,
    },
    card: {
        width: '47%',
        backgroundColor: '#1f1f1f',
        borderRadius: 12,
        // padding: 12,
        marginBottom: hp(2),
        marginHorizontal: wp(1),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        position: "relative"
    },
    cardImage: {
        width: '100%',
        height: hp(14),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: hp(0),
    },
    name: {
        fontSize: wp(3),
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
    },
    location: {
        color: '#d3d3d3',
        fontSize: wp(3),
        marginBottom: 4,
        fontFamily: 'Poppins-Regular',
    },
    category: {
        color: '#A9CEFF',
        fontSize: wp(2.5),
        fontFamily: 'Poppins-Regular',
    },
    details: {
        fontSize: wp(1.9),
        color: '#FFD700',
        marginBottom: 2,
        fontFamily: 'Poppins-Medium',
    },
    timings: {
        fontSize: wp(3),
        color: '#bbb',
        fontFamily: 'Poppins-Regular',
    },
    contact: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        alignSelf: "center"
    },
    location: {
        color: "#d3d3d3",
        fontFamily: "Poppins-Regular",
        fontSize: wp(3.5),
    },
    contactButton: {
        backgroundColor: "#3B63EF",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignSelf: "center"
    }
});
