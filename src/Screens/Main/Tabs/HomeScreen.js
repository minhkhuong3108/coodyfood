import {
  FlatList,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ButtonComponent from '../../../components/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../Redux/Reducers/LoginSlice';
import ContainerComponent from '../../../components/ContainerComponent';
import { globalStyle } from '../../../styles/globalStyle';
import SpaceComponent from '../../../components/SpaceComponent';
import RowComponent from '../../../components/RowComponent';
import TextComponent from '../../../components/TextComponent';
import { appColor } from '../../../constants/appColor';
import SearchComponent from '../../../components/SearchComponent';
import { fontFamilies } from '../../../constants/fontFamilies';
import Swiper from 'react-native-swiper';
import ShopRecomendList from '../../../components/ShopRecomendList';
import ShopAndProductComponent from '../../../components/ShopAndProductComponent';
import Geolocation from 'react-native-geolocation-service';
import MapAPI from '../../../core/apiMap/MapAPI';
import AxiosInstance from '../../../helpers/AxiosInstance';
import _ from 'lodash';
import { CallConfig } from '../../Call/Callconfig';
import LoadingModal from '../../../modal/LoadingModal';
import { Shop } from 'iconsax-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { connectSocket, getSocket } from '../../../socket/socket';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.login);
  const [search, setSearch] = useState('');
  const [cate, setCate] = useState([]);
  const [cate2, setCate2] = useState(CATE2);
  const [shopRecomend, setShopRecomend] = useState();
  const [shop, setShop] = useState();
  const [shopView, setShopView] = useState([]);
  const [selectedCate, setSelectedCate] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [addressUser, setAddressUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nearShop, setNearShop] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    //callkeep
    CallConfig(user.email, 'user' + user.email);
    //socket
    // connectSocket();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };
  const getGeocoding = async () => {
    if (userLocation) {
      let geocoding = await MapAPI.getGeocoding({
        description: encodeURIComponent(
          userLocation[1] + ',' + userLocation[0],
        ),
      });
      // console.log('geocoding', geocoding.results[0].formatted_address);
      setAddressUser(geocoding.results[0].formatted_address);
    }
  };

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
      },
      error => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const getShop = async () => {
    const response = await AxiosInstance().get('/shopOwner');
    const shop = response.data;

    setShop(response.data);
  };

  const getCategories = async () => {
    const response = await AxiosInstance().get('/shopCategories');
    setCate(response.data);
  };

  const haversineDistance = (coords1, coords2) => {
    const toRad = x => (x * Math.PI) / 180;

    const lat1 = coords1[1];
    const lon1 = coords1[0];
    const lat2 = coords2[0];
    const lon2 = coords2[1];

    const R = 6371; // Bán kính Trái Đất tính bằng km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d; // Khoảng cách tính bằng km
  };

  const calculateTravelTime = (distance, speed) => {
    const time = distance / speed;
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return minutes;
  };

  const calculateDistanceToShop = shopLocation => {
    if (userLocation) {
      const distance = haversineDistance(userLocation, shopLocation);
      const minutes = calculateTravelTime(distance, 5);
      return { distance, time: minutes };
    }
    return null;
  };

  const getNearByShops = async () => {
    if (shop && userLocation) {
      const updatedShops = shop.map(shop => {
        const { distance, time } = calculateDistanceToShop([
          shop.latitude,
          shop.longitude,
        ]);
        return { ...shop, distance, time };
      });

      // const filteredShops = updatedShops.filter(shop => shop.distance <= 5); // Lọc các shop trong bán kính 5 km
      const filteredShops = updatedShops.filter(
        shop => shop.distance <= 1000000,
      ); // Lọc các shop trong bán kính 5 km
      setNearShop(filteredShops);
    }
  };

  // const getShopPopular = async () => {
  //   if (nearShop) {
  //     const shopPopular = [...nearShop].sort((a, b) => b.rating - a.rating)
  //     setShopRecomend(shopPopular)
  //   }
  // }

  const getShopPopular = async () => {
    if (shop) {
      const shopPopular = [...nearShop].sort((a, b) => b.rating - a.rating);
      setShopRecomend(shopPopular);
    }
  };

  const handleNearByShops = async () => {
    const shopDistance = [...nearShop].sort((a, b) => a.distance - b.distance);
    setShopView(shopDistance);
  };
  const handleRateShop = async () => {
    const shopRate = [...nearShop].sort((a, b) => b.rating - a.rating);
    setShopView(shopRate);
  };

  const handleNewShop = async () => {
    const shopNew = [...nearShop].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
    setShopView(shopNew);
  };

  const handleSelectCate = id => {
    setSelectedCate(id);
    if (id == 1) {
      handleNearByShops();
    } else if (id == 2) {
      handleNewShop();
    } else if (id == 3) {
      handleRateShop();
    }
  };

  const getCart = async () => {
    try {
      const response = await AxiosInstance().get(`/carts/${user._id}`);
      setCart(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  // useEffect(() => {
  //   requestLocationPermission().then(hasPermission => {
  //     if (hasPermission) {
  //       getUserLocation();
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (userLocation) {
      getGeocoding();
    }
  }, [userLocation]);

  useEffect(() => {
    getNearByShops();
  }, [shop, userLocation]);

  useEffect(() => {
    if (nearShop) {
      getShopPopular();
      handleSelectCate(selectedCate);
    }
  }, [nearShop, selectedCate]);

  // useEffect(() => {
  //   handleSelectCate(selectedCate);
  // }, [selectedCate, userLocation, shop]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      await Promise.all([getCategories(), getShop()]);
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getUserLocation();
      }
      setIsLoading(false); // Tắt loading sau khi tất cả các hàm đã hoàn thành
    };
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCart();
    }, []),
  );

  const groupedData = useMemo(() => {
    const result = [];
    for (let i = 0; i < cate.length; i += 2) {
      result.push(cate.slice(i, i + 2));
    }
    return result;
  }, [cate]);

  const renderGroupedItem = ({ item, index }) => (
    <View key={index}>
      {item.map(subItem => (
        <View key={subItem._id} style={styles.item}>
          {renderCate({ item: subItem })}
        </View>
      ))}
    </View>
  );

  const renderCate = ({ item }) => {
    const { _id, name, image } = item;
    return (
      <TouchableOpacity
        key={_id}
        style={styles.btnCate}
        onPress={() => navigation.navigate('ShopByCategory', { item })}>
        <View style={styles.viewImgCate}>
          {image && (
            <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
          )}
        </View>
        <TextComponent
          text={name}
          fontsize={14}
          styles={{ width: 63 }}
          textAlign={'center'}
        />
      </TouchableOpacity>
    );
  };

  const renderCate2 = ({ item, index }) => {
    const { id, name } = item;
    return (
      <TouchableOpacity
        key={id}
        style={[
          { marginRight: 20 },
          index == cate2.length - 1 && styles.itemLast,
        ]}
        onPress={() => handleSelectCate(id)}>
        <TextComponent
          text={name}
          fontsize={16}
          styles={id == selectedCate && styles.activeCate}
          color={id == selectedCate ? appColor.primary : appColor.text}
          textAlign={'center'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ContainerComponent styles={globalStyle.container}>
      <ContainerComponent isScroll>
        <RowComponent justifyContent={'space-between'}>
          <View style={{ flex: 1 }}>
            <TextComponent
              text={'Giao đến'}
              fontsize={16}
              fontFamily={fontFamilies.bold}
            />
            <SpaceComponent height={15} />
            <RowComponent
              button
              onPress={() =>
                navigation.navigate('EditAddress', { item: addressUser })
              }>
              <Image
                source={require('../../../assets/images/home/location.png')}
                style={{ marginRight: 10 }}
              />
              <TextComponent
                text={`${addressUser}`}
                color={appColor.subText}
                fontsize={12}
                width={'80%'}
              />
            </RowComponent>
          </View>
          <Image
            source={require('../../../assets/images/home/avatar.png')}
            style={styles.imgAvatar}
          />
        </RowComponent>
        <SpaceComponent height={25} />
        <SearchComponent
          placeholder={'Tìm kiếm'}
          value={search}
          onchangeText={text => setSearch(text)}
          onPress={() => navigation.navigate('Search')}
        />
        <SpaceComponent height={20} />

        <Swiper
          dotColor={appColor.white}
          activeDotColor={appColor.primary}
          height={'auto'}
          autoplay>
          <Image
            source={require('../../../assets/images/home/s1.png')}
            style={styles.banner}
          />
          <Image
            source={require('../../../assets/images/home/s2.png')}
            style={styles.banner}
          />
          <Image
            source={require('../../../assets/images/home/s3.png')}
            style={styles.banner}
          />
          <Image
            source={require('../../../assets/images/home/s4.png')}
            style={styles.banner}
          />
        </Swiper>
        <SpaceComponent height={10} />
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={groupedData}
            renderItem={renderGroupedItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <SpaceComponent height={20} />
        <TextComponent text={'Nổi bật gần bạn'} />
        <SpaceComponent height={10} />
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={shopRecomend}
            renderItem={({ item, index }) => (
              <ShopRecomendList
                item={item}
                index={index}
                type={'large'}
                list={shopRecomend}
                onpress={() => navigation.navigate('Shop', { id: item._id })}
              />
            )}
            keyExtractor={item => item._id}
          />
        </View>
        <SpaceComponent height={20} />
        <TextComponent text={'Đề xuất cho bạn'} fontsize={18} />
        <SpaceComponent height={10} />
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={shopRecomend}
            renderItem={({ item, index }) => (
              <ShopRecomendList 
              item={item} 
              index={index} 
              list={shopRecomend}  
              onpress={() => navigation.navigate('Shop', { id: item._id })}/>
            )}
            key={item => item._id}
          />
        </View>
        <SpaceComponent height={30} />
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={cate2}
            renderItem={renderCate2}
            keyExtractor={item => item.id}
          />
        </View>
        <SpaceComponent height={30} />
        <View>
          <FlatList
            data={shopView}
            renderItem={({ item }) => (
              <ShopAndProductComponent
                type={'shop'}
                item={item}
                onPress={() => navigation.navigate('Shop', { id: item._id })}
              />
            )}
            keyExtractor={item => item._id}
            scrollEnabled={false}
          />
        </View>
        <SpaceComponent height={70} />
      </ContainerComponent>
      <TouchableOpacity
        style={[styles.btnCart]}
        onPress={() => navigation.navigate('Cart')}>
        <Image source={require('../../../assets/images/home/cart.png')} />
        <View style={styles.viewQuantityCart}>
          <TextComponent
            text={cart.length > 0 ? cart.length : '0'}
            color={appColor.white}
            fontsize={10}
          />
        </View>
      </TouchableOpacity>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  viewQuantityCart: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: appColor.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCart: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColor.white,
    shadowColor: 'rgba(0,0,0,0.9)',
    elevation: 8,
  },
  activeCate: {
    borderBottomWidth: 2,
    borderBottomColor: appColor.primary,
    paddingBottom: 5,
  },
  itemLast: {
    marginRight: 0,
  },
  viewRate: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: appColor.green,
  },
  viewInfo: {
    paddingVertical: 10,
  },
  imgFeature: {
    width: 230,
    height: 156,
    borderRadius: 15,
  },
  containerFeature: {
    padding: 10,
    borderWidth: 1,
    borderColor: appColor.gray,
    borderRadius: 15,
    marginRight: 40,
  },
  item: {
    marginVertical: 15,
    height: 100,
  },
  viewImgCate: {
    width: 63,
    height: 63,
    backgroundColor: appColor.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: 'rgba(0,0,0,0.1)',
    elevation: 5,
    marginBottom: 10,
    borderRadius: 8,
  },
  btnCate: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    resizeMode: 'contain',
  },
  imgAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

var CATE = [
  {
    id: 1,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png'),
  },
  {
    id: 2,
    name: 'a',
    image: require('../../../assets/images/home/piza.png'),
  },
  {
    id: 3,
    name: 'b',
    image: require('../../../assets/images/home/piza.png'),
  },
  {
    id: 4,
    name: 'c',
    image: require('../../../assets/images/home/piza.png'),
  },
  {
    id: 5,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png'),
  },
  {
    id: 6,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png'),
  },
  {
    id: 7,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png'),
  },
  {
    id: 8,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png'),
  },
  {
    id: 9,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png'),
  },
  {
    id: 10,
    name: 'Pizza',
    image: require('../../../assets/images/home/piza.png'),
  },
];

var CATE2 = [
  {
    id: 1,
    name: 'Gần đây',
  },
  {
    id: 2,
    name: 'Bán chạy',
  },
  {
    id: 3,
    name: 'Món mới',
  },
  {
    id: 4,
    name: 'Đánh giá',
  },
];

var FEATURE = [
  {
    id: 1,
    name: 'Drumsteak Thai Ha',
    distance: 2,
    time: 20,
    rating: 4.3,
    images: [
      'https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp',
    ],
  },
  {
    id: 2,
    name: 'Chicken salan',
    distance: 2,
    rating: 4.8,
    images: [
      'https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp',
    ],
  },
  {
    id: 3,
    name: 'Drumsteak Thai Ha',
    distance: 2,
    time: 20,
    rating: 4.5,
    images: [
      'https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp',
    ],
  },
];
var SHOP = [
  {
    id: 1,
    name: 'Drumsteak Thai Ha',
    rating: 4.8,
    discount: 20,
    images: [
      'https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp',
    ],
    latitude: 10.787273,
    longitude: 106.749809,
  },
  {
    id: 2,
    name: 'Chicken salan',
    rating: 5,
    discount: 20,
    images: [
      'https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp',
    ],
    latitude: 10.84191,
    longitude: 106.64361,
  },
  {
    id: 3,
    name: 'Drumsteak Thai Ha',
    rating: 4.6,
    discount: 20,
    images: [
      'https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp',
    ],
    latitude: 10.83392,
    longitude: 106.64337,
  },
];

var PRODUCT = [
  {
    id: 1,
    name: 'Drumsteak Thai Ha',
    location: 2,
    time: 20,
    rate: 4.5,
    sold: 20,
    price: 20,
    oldPrice: 25,
    image: require('../../../assets/images/home/p1.png'),
    latitude: 10.867153,
    longitude: 106.641335,
  },
  {
    id: 2,
    name: 'Chicken salan',
    location: 2,
    time: 20,
    rate: 4.5,
    sold: 20,
    price: 20,
    oldPrice: 25,
    image: require('../../../assets/images/home/p2.png'),
    latitude: 10.84191,
    longitude: 106.64361,
  },
  {
    id: 3,
    name: 'Drumsteak Thai Ha',
    location: 2,
    time: 20,
    rate: 4.5,
    sold: 20,
    price: 20,
    oldPrice: 25,
    image: require('../../../assets/images/home/p1.png'),
    latitude: 10.775659,
    longitude: 106.700424,
  },
];
