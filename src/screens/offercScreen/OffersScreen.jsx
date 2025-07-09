import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import { useGetAllOffersQuery, useGetSortedOffersQuery } from '../../features/shops/shopApi';
import BackButton from "../../components/BackButton";
import { useNavigation } from '@react-navigation/native';


const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Latest', value: 'latest' },
  { label: 'Ending soon', value: 'endingSoon' },
  { label: 'Distance', value: 'distance' },
];

const OffersScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigation = useNavigation();

  const { data: allOffersData, } = useGetAllOffersQuery();
  const { data: sortedData, isLoading } = useGetSortedOffersQuery(selectedFilter);

  const offers =
    selectedFilter === 'all'
      ? allOffersData?.data?.offers || []
      : sortedData?.data?.offers || [];



  const handlePress = (title, description, endDate, bannerImage, shopName, vendorId, offerId) => {
    navigation.navigate('OfferDetails', {
      title,
      description,
      endDate,
      bannerImage,
      shopName,
      vendorId,
      offerId
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
    // console.log("offer id: ",item._id)

    return (
      <TouchableOpacity onPress={() => handlePress(item.title, item.description, formattedDate, item.bannerImage, item.shopId.name, item.shopId.owner, item._id)}>
        <ImageBackground
          source={{ uri: item.bannerImage }}
          style={styles.offerCard}
          imageStyle={{ borderRadius: 12 }}
        />

      </TouchableOpacity>
    );
  };
  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <BackButton lable={"Offers"} back={true} />

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
                selectedFilter === option.value && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedFilter(option.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === option.value && styles.selectedFilterText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#ff5f6d" />
        </View>
      ) : (
        <FlatList
          data={offers}
          renderItem={renderOffer}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: hp(5) }}>
              <Image source={require('../../../assets/emptyofferBox.png')} style={{ width: wp(50), height: hp(20) }} />
              <Text style={{ fontSize: RFValue(20), color: "#999", fontFamily: "Poppins-SemiBold", textAlign: "center" }}>No Offers Available</Text>
            </View>
          }
        />
      )}
    </LinearGradient>
  )

};

export default OffersScreen;

const styles = StyleSheet.create({
  listContent: {
    // backgroundColor: '#000',
    paddingHorizontal: wp(2),
    gap: hp(2),
    paddingTop: hp(1),
    paddingBottom: hp(5),
    justifyContent: "space-between"
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
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: hp(10),
    fontSize: RFValue(14),
    fontFamily: 'Poppins-SemiBold',
  }

});

