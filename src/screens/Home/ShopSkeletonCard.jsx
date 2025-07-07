import { StyleSheet, View } from "react-native";
import { hp, wp } from "../../utils/dimensions";

const ShopSkeletonCard = () => (
  <View style={skeletonStyles.card}>
    <View style={skeletonStyles.image} />
    <View style={skeletonStyles.textLine} />
    <View style={[skeletonStyles.textLine, { width: '60%' }]} />
  </View>
);

export default ShopSkeletonCard

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    margin: wp(1.5),
    width: wp(44),
    height: hp(25),
    padding: wp(2),
    justifyContent: 'flex-end',
  },
  image: {
    backgroundColor: '#333',
    height: hp(18),
    borderRadius: 8,
    marginBottom: hp(1),
  },
  textLine: {
    height: hp(1.8),
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: hp(0.5),
  },
});
