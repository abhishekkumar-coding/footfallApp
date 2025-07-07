import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import { useGetAllOffersQuery } from '../../features/shops/shopApi';
import BackButton from "../../components/BackButton"
import { useNavigation } from '@react-navigation/native';

const sampleOffers = [
  {
    id: '1',
    title: '50% Off on Groceries',
    description: 'Limited time offer on daily essentials.',
    date: 'Valid till 30 Sep 2025',
    image: 'https://images.unsplash.com/photo-1606756793539-ef74c1c2f6ac?fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Flat ₹500 Off',
    description: 'On electronics above ₹5,000.',
    date: 'Valid till 15 Oct 2025',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Buy 1 Get 1 Free',
    description: 'On selected fashion brands.',
    date: 'Valid till 10 Nov 2025',
    image: 'https://images.unsplash.com/photo-1562887280-9de308f14f3c?fit=crop&w=800&q=80',
  },
];



const filterOptions = ['Latest', 'Ending Soon', 'Distance'];

const OffersScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('Latest');
  const navigation = useNavigation()

  const { data } = useGetAllOffersQuery()
  console.log("OffersScreen : ", data?.data)
  const offers = data?.data?.offers || []

   const handlePress = (title, description, endDate) => {
    navigation.navigate('OfferDetails', {
      title: title,
      description: description,
      endDate: endDate,
      // qrCodeData: "dummy-qr-code-data",
    });
  };


  const renderOffer = ({ item }) => {
  const formattedDate = new Date(item.endTime).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  console.log(item.title)

  return (
    <TouchableOpacity onPress={()=>handlePress(item.title, item.description, formattedDate)}>
    <ImageBackground
      source={{ uri: item.bannerImage }}
      style={styles.offerCard}
      imageStyle={{ borderRadius: 12 }}
    >
    </ImageBackground>
    </TouchableOpacity>
  );
};

  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <BackButton lable={"Offers"} back={true}/>
      <FlatList
        data={offers}
        renderItem={renderOffer}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {filterOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterButton,
                    selectedFilter === option && styles.selectedFilterButton,
                  ]}
                  onPress={() => setSelectedFilter(option)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === option && styles.selectedFilterText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
      />
    </LinearGradient>
  );
};

export default OffersScreen;

const styles = StyleSheet.create({
  listContent: {
    // backgroundColor: '#000',
    paddingHorizontal: wp(2),
    gap: hp(2),
    paddingTop: hp(1),
    paddingBottom: hp(5),
    justifyContent:"space-between"
  },
  headerContainer: {
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  filterContainer: {
    flexDirection: 'row',
    gap: wp(2),
    paddingHorizontal: wp(3),
  },
  filterButton: {
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3.5),
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF4D00',
    backgroundColor: 'transparent',
  },
  selectedFilterButton: {
    backgroundColor: '#FF4D00',
  },
  filterText: {
    color: '#FF4D00',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-SemiBold',
  },
  selectedFilterText: {
    color: '#fff',
  },
  offerCard: {
    height: 130,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: wp(4),
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  offerTitle: {
    color: '#fff',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-SemiBold',
  },
  offerDescription: {
    color: '#ddd',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Regular',
    marginTop: hp(0.5),
  },
  offerDate: {
    color: '#aaa',
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Light',
    marginTop: hp(0.5),
  },
});
