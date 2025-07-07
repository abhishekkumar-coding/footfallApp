import React, { useRef, useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Text, Animated, TouchableOpacity } from 'react-native';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useGetAllOffersQuery } from '../../features/shops/shopApi';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SkeletonItem = () => (
  <Animated.View style={[styles.skeletonContainer, styles.image]} />
);

const AutoSlider = () => {
  const flatListRef = useRef(null);
  const scrollPosition = useRef(0);
  const navigation = useNavigation()

  const { data, isLoading } = useGetAllOffersQuery();

  const initialImages = data?.data?.offers || [];

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (initialImages.length > 0) {
      const initialBatch = Array.from({ length: 3 }, (_, i) => ({
        ...initialImages[i % initialImages.length],
        id: `${i}`,
      }));
      setImages(initialBatch);
    }
  }, [initialImages]);

  useEffect(() => {
    if (!images.length) return; // Prevent scroll interval if images not ready

    const interval = setInterval(() => {
      scrollPosition.current += width;
      flatListRef.current?.scrollToOffset({
        offset: scrollPosition.current,
        animated: true,
      });

      if (scrollPosition.current >= (images.length - 3) * width) {
        const nextBatch = initialImages.map((img, i) => ({
          ...img,
          id: `${images.length + i}`,
        }));
        setImages(prev => [...prev, ...nextBatch]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [images, initialImages]);

  const handlePress = (title, description, endDate) => {
    navigation.navigate('OfferDetails', {
      title: title,
      description: description,
      endDate: endDate,
      // qrCodeData: "dummy-qr-code-data",
    });
  };

  return (
    <View style={{ width: '100%', paddingVertical: hp(2), gap: 10, paddingHorizontal: 10 }}>
      <Text style={styles.headText}>Top Offers</Text>

      {isLoading ? (
        <FlatList
          data={[1, 2, 3]} // dummy placeholders
          keyExtractor={item => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={() => <SkeletonItem />}
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const formattedDate = new Date(item.endTime).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <TouchableOpacity
                onPress={() => handlePress(item.title, item.description, formattedDate)}
                style={styles.imageContainer}
              >
                <Image source={{ uri: item.bannerImage }} style={styles.image} />
              </TouchableOpacity>
            );
          }}
        />

      )}
    </View>
  );
};

export default AutoSlider;

const styles = StyleSheet.create({
  headText: {
    fontSize: RFValue(16),
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginTop: hp(0),
  },
  imageContainer: {
    width,
    height: 140,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  image: {
    width: width * 0.9,
    height: 140,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  skeletonContainer: {
    backgroundColor: '#444', // skeleton color
    borderRadius: 5,
    marginRight: wp(2),
  },
});
