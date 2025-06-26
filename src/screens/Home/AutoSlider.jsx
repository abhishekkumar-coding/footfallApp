import React, { useRef, useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { hp, wp } from '../../utils/dimensions';

const { width } = Dimensions.get('window');

const initialImages = [
  { id: '1', uri: 'https://i.pinimg.com/736x/24/22/8c/24228c6899390c7a53f67af7f28f9f31.jpg' },
  { id: '2', uri: 'https://i.pinimg.com/736x/a2/7f/3d/a27f3d4209b40c1db98cf718cad1edea.jpg' },
  { id: '3', uri: 'https://i.pinimg.com/736x/7b/c9/b2/7bc9b2b1aad479631309ee864715878e.jpg' },
];

const AutoSlider = () => {
  const flatListRef = useRef(null);
  const scrollPosition = useRef(0);
  const [images, setImages] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      ...initialImages[i % initialImages.length],
      id: `${i}`,
    }))
  );

 useEffect(() => {
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
}, [images]);
  return (
    <View style={{width:"100%", paddingVertical:hp(2), gap:10}}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}
      />
    </View>
  );
};

export default AutoSlider;

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 180,
    resizeMode: "stretch",
    borderRadius:0,
    paddingHorizontal:wp(6),
    
  },
});
