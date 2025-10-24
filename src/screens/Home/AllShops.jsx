import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
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
  {
    key: 'travel',
    label: 'Travel',
    subcategories: [
      'Flights & Airlines',
      'Hotels & Stays',
      'Tours & Activities',
      'Transport & Rentals',
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
  const [shops, setShops] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageForSerch = 1

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

  const limit = 10; // or any number of items per page you wa

  // 🚀 Fetch shops page by page
  const { data: shopData, isFetching, isLoading: shopsLoading } = useGetAllShopsQuery({
    page,
    limit,
    ...(selectedCategory !== "all" && { category: selectedCategory }),
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const newShops = shopData?.data?.shops || [];
  const totalPages = shopData?.data?.totalPages || 1;


  // 🚀 Reset to page 1 on filter/search change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, debouncedSearch]);


  console.log("Shops data: ", newShops)

  useEffect(() => {
    if (page === 1) {
      // Overwrite if it's first page (filter or search changed)
      setShops(newShops);
    } else if (newShops.length > 0) {
      // Append unique shops
      setShops(prev => {
        const unique = newShops.filter(
          s => !prev.some(old => old._id === s._id)
        );
        return [...prev, ...unique];
      });
    }

    setHasMore(page < totalPages);
  }, [shopData, page]);

  // 🚀 Load next page on scroll end
  const handleLoadMore = () => {
    if (!isFetching && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  // When category or search changes, clear shops list
  useEffect(() => {
    setPage(1);
    setShops([]);  // ✅ Clear old data
    setHasMore(true);
  }, [selectedCategory, debouncedSearch]);

  // ✅ Trigger refetch whenever page changes
  // useEffect(() => {
  //   refetch();
  // }, [page, refetch]);

  // ✅ Load wishlist once
  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  // ✅ Loading shimmer for category/filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedCategory, debouncedSearch]);

  // ✅ Reset page when filters/search change
  // useEffect(() => {
  //   setPage(1);
  //   setHasMore(true);
  // }, [selectedCategory, debouncedSearch]);


  // Autofocus on search open
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [showSearch]);

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    
    // If a search term was active, clear it immediately to trigger the query refetch
    // without waiting for the debounce timeout.
    if (debouncedSearch !== '') {
      setDebouncedSearch('');
    }
  };

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

  const renderFooter = () =>
    isFetching && hasMore ? (
      <ActivityIndicator size="large" color={Colors.purple} style={{ marginVertical: 15 }} />
    ) : null;

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

  /** ✅ Pagination Footer */
  const PaginationFooter = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[styles.pageButton, page === 1 && styles.disabledButton]}
        disabled={page === 1}
        onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
      >
        <Text style={styles.pageButtonText}>Prev</Text>
      </TouchableOpacity>

      <Text style={styles.pageIndicator}>
        Page {page} / {totalPages}
      </Text>

      <TouchableOpacity
        style={[styles.pageButton, page === totalPages && styles.disabledButton]}
        disabled={page === totalPages}
        onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
      >
        <Text style={styles.pageButtonText}>Next</Text>
      </TouchableOpacity>
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
          <TouchableOpacity onPress={handleCloseSearch}>
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
      {shopsLoading ? (
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
          data={shops}
          keyExtractor={(item) => item._id}
          renderItem={renderShop}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{
            paddingHorizontal: wp(4),
            paddingBottom: hp(5),
            flexGrow: 1,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={!isFetching ? renderEmpty : null}
          ListFooterComponent={renderFooter}
        />
      )
      }
      {/* {totalPages > 1 && <PaginationFooter />} */}
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(1.5),
    // backgroundColor: "rgba(255,255,255,0.05)",
  },
  pageButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    backgroundColor: Colors.purple,
    borderRadius: 20,
    marginHorizontal: wp(2),
  },
  disabledButton: {
    opacity: 0.4,
  },
  pageButtonText: {
    color: "#fff",
    fontFamily: Fonts.primary_SemiBold,
  },
  pageIndicator: {
    color: "#fff",
    fontFamily: Fonts.primary_Regular,
    fontSize: RFValue(14, SCREEN_HEIGHT),
  },
});