import { StyleSheet, View } from "react-native";
import { hp, wp } from "../../utils/dimensions";
import { Colors } from "../../utils/Colors";

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
    backgroundColor: Colors.white_light,
    borderRadius: 10,
    margin: wp(1),
    width: wp(45),
    height: hp(25),
    padding: wp(2),
    justifyContent: 'flex-end',
  },
  image: {
    backgroundColor: Colors.white_light,
    height: hp(18),
    borderRadius: 8,
    marginBottom: hp(1),
  },
  textLine: {
    height: hp(1.8),
    backgroundColor: Colors.white_light,
    borderRadius: 4,
    marginBottom: hp(0.5),
  },
});
