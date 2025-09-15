import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { hp, wp, SCREEN_HEIGHT } from "../../utils/dimensions";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import PageHeader from "../../components/PageHeader";
import ShopCard from "../../components/ShopCard";
import ShopSkeletonCard from "./ShopSkeletonCard";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/typography";
import { loadWishlist } from "../../features/wishlistSlice";
import { useGetAllShopsQuery } from "../../features/shops/shopApi";
import LinearGradient from "react-native-linear-gradient";
import AppLayout from "../../layout/AppLayout";

// const CATEGORIES = [
//   { key: 'all', label: 'All' },
//   { key: 'kirana / general stores', label: 'Kirana / General stores' },
//   { key: 'local restaurants / dhabas', label: 'Local restaurants / dhabas' },
//   { key: 'readymade garments', label: 'Readymade garments' },
//   { key: 'furniture stores', label: 'Furniture stores' },
//   { key: 'medical stores', label: 'Medical stores' },
//   { key: 'mobile repair shops', label: 'Mobile repair shops' },
//   { key: 'handicrafts', label: 'Handicrafts' },
//   { key: 'packaged goods resellers', label: 'Packaged goods resellers' },
// ];

const categories = [
  { key: 'all', label: 'All' },
  {
    key: 'retail',
    label: 'Retail & Grocery',
    subcategories: [
      'Kirana / General stores',
      'Fruits & vegetables',
      'Dairy & milk products',
      'Meat & poultry shops',
      'Bakery & confectionery',
    ],
  },
  {
    key: 'food',
    label: 'Food & Beverage',
    subcategories: [
      'Local restaurants / dhabas',
      'Street food vendors',
      'Sweets & snacks shops',
      'Tea & coffee stalls',
      'Catering services',
    ],
  },
  {
    key: 'clothing',
    label: 'Clothing & Accessories',
    subcategories: [
      'Readymade garments',
      'Tailors & boutiques',
      'Footwear shops',
      'Jewelry & imitation ornaments',
    ],
  },
  {
    key: 'home',
    label: 'Home & Living',
    subcategories: [
      'Furniture stores',
      'Home décor',
      'Electrical & hardware shops',
      'Kitchenware & utensils',
    ],
  },
  {
    key: 'health',
    label: 'Health & Wellness',
    subcategories: [
      'Medical stores',
      'Clinics & pathology labs',
      'Beauty parlors & salons',
      'Fitness centers / gyms',
    ],
  },
  {
    key: 'services',
    label: 'Services',
    subcategories: [
      'Mobile repair shops',
      'Electricians & plumbers',
      'Car/Bike repair',
      'Printing & photocopy',
      'Event decorators',
    ],
  },
  {
    key: 'specialty',
    label: 'Specialty & Local Products',
    subcategories: [
      'Handicrafts',
      'Wooden items',
      'Brass & metalware',
      'Seasonal fairs vendors',
    ],
  },
  {
    key: 'delivery',
    label: 'Quick Commerce & Delivery',
    subcategories: [
      'Packaged goods resellers',
      'Local couriers',
      'Flower shops',
    ],
  },
];



const AllShops = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchInputRef = useRef(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (key) => {
    setExpandedCategory(prev => prev === key ? null : key);
    setSelectedCategory(null); // reset subcategory when switching parent
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      400
    );
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch shops
  const { data: shopData, refetch } = useGetAllShopsQuery(
    {
      ...(selectedCategory !== "all" && { category: selectedCategory }),
      ...(debouncedSearch && { search: debouncedSearch }),
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );


  const shops = useMemo(() => shopData?.data?.shops || [], [shopData]);

  console.log("All Shops: ", shops)

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedCategory, debouncedSearch]);

  // Autofocus on search open
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [showSearch]);

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const renderShop = ({ item }) => (
    <ShopCard
      shop={item}
      onPress={() => navigation.navigate('ShopDetails', { id: item._id })}
    />
  );
  const renderCategory = ({ item }) => {
    const isSelected = selectedCategory === item.key;
    return (
      <TouchableOpacity
        style={[styles.filterButton, isSelected && styles.selectedFilterButton]}
        onPress={() => setSelectedCategory(item.key)}
        activeOpacity={0.8}
      >
        <Text style={[styles.filterText, isSelected && styles.selectedFilterText]}>
          {t(item.lable) || item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('noShopsAvailable')}</Text>
      <Text style={styles.emptySubText}>{t('pleaseTryAgainLater')}</Text>
      <Image
        source={require('../../../assets/noShop.png')}
        style={styles.emptyImage}
      />
    </View>
  );

  return (
    <AppLayout showCircle={false} style={{ flex: 1 }}>


      {showSearch ? (
        <View style={styles.searchContainer}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder={t('searchShops')}
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => { setShowSearch(false); setSearchQuery('') }}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.headerRow}>
          <PageHeader lable={t('shops')} back />
          <TouchableOpacity onPress={() => setShowSearch(true)}>
            <Icon name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <View>
        {/* Categories Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.filterButton,
                selectedCategory === cat.key || expandedCategory === cat.key && styles.selectedFilterButton,
              ]}
              onPress={() => toggleCategory(cat.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  expandedCategory === cat.key && styles.selectedFilterText,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Subcategories Row (outside main view) */}
        {expandedCategory && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subCategoryContainer}
          >
            {categories
              .find((cat) => cat.key === expandedCategory)
              ?.subcategories?.map((sub, idx) => (
                <TouchableOpacity
                  key={`${expandedCategory}-${idx}`}
                  style={[
                    styles.subCategoryButton,
                    selectedCategory === sub && { backgroundColor: Colors.purple },
                  ]}
                  onPress={() => setSelectedCategory(sub)}
                >
                  <Text
                    style={[
                      styles.subCategoryText,
                      selectedCategory === sub && styles.selectedFilterText,
                    ]}
                  >
                    {sub}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
      </View>
      {isLoading ? (
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, i) => `skeleton-${i}`}
          renderItem={() => <ShopSkeletonCard />}
          numColumns={2}
          columnWrapperStyle={styles.skeltonColumnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.skeletonListContent} // new style
        />

      ) : (
        <FlatList
          data={shops.length > 0 ? shops : []} // Always same type of array
          keyExtractor={(item, index) => item?._id ?? `empty-${index}`} // Safe key
          numColumns={2} // Keep fixed columns
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{
            paddingHorizontal: wp(4),
            paddingBottom: hp(5),
            flexGrow: 1, // Ensures empty state centers properly
          }}
          renderItem={renderShop}
          ListEmptyComponent={renderEmpty}

        />
      )
      }
    </AppLayout>
  );
};


export default AllShops;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp(4),
  },

  /** HEADER **/
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    marginTop: hp(1),
  },

  /** SEARCH **/
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(3),
    borderRadius: 15,
    paddingHorizontal: wp(2.5),
    backgroundColor: "rgba(255,255,255,0.3)"
  },
  searchInput: {
    flex: 1,
    color: Colors.black,
    paddingVertical: hp(1.2),
  },
  filterContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
  },
  filterButton: {
    paddingHorizontal: wp(6),
    borderRadius: 30,
    marginHorizontal: wp(1),
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: hp(4),
    justifyContent: 'center',
  },
  selectedFilterButton: {
    backgroundColor: Colors.purple,
  },
  filterText: {
    fontSize: RFValue(14, SCREEN_HEIGHT),
    color: "#fff",
    fontFamily: Fonts.primary_SemiBold,
  },
  selectedFilterText: {
    color: "#fff",
  },
  skeltonColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  skeletonListContent: {
    flexGrow: 1, // Fills the available height
    justifyContent: "center", // Vertical center
    alignItems: "center", // Horizontal center
    paddingHorizontal: wp(4),
  },
  listContent: {
    paddingBottom: hp(10),
    paddingTop: hp(2),
    paddingHorizontal: wp(2),
    marginTop: hp(3),

  },

  /** EMPTY STATE **/
  emptyContainer: {
    marginTop: hp(10),
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.primary_SemiBold,
    fontSize: RFValue(20, SCREEN_HEIGHT),
    color: "#fff",
    opacity: 0.5,
    textAlign: 'center',
  },
  emptySubText: {
    fontFamily: Fonts.primary_Regular,
    fontSize: RFValue(15, SCREEN_HEIGHT),
    color: "#fff",
    opacity: 0.4,
    textAlign: 'center',
  },
  emptyImage: {
    width: wp(35),
    height: hp(20),
    resizeMode: 'contain',
    opacity: 0.5,
    marginTop: hp(2),
  },

  filterButton: {
    paddingHorizontal: wp(6),
    borderRadius: 30,
    marginHorizontal: wp(1),
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: hp(4),
    // maxWidth: wp(60),
    justifyContent: 'center',
  },

  subCategoryContainer: {
    flexDirection: "row",
    // marginTop: hp(1.2),
    marginBottom: hp(2),
    paddingHorizontal: wp(5),
  },

  subCategoryButton: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(0.8),
    borderRadius: 20,
    marginRight: wp(2),
    backgroundColor: "rgba(255,255,255,0.1)",
    alignSelf: "flex-start",       // ✅ keeps same height
  },

  subCategoryText: {
    fontSize: RFValue(14, SCREEN_HEIGHT),
    color: "#fff",
    fontFamily: Fonts.primary_Regular,
  },
});