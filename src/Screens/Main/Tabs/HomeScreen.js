import { FlatList, Image, PermissionsAndroid, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ButtonComponent from '../../../components/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../Redux/Reducers/LoginSlice'
import ContainerComponent from '../../../components/ContainerComponent'
import { globalStyle } from '../../../styles/globalStyle'
import SpaceComponent from '../../../components/SpaceComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import { appColor } from '../../../constants/appColor'
import SearchComponent from '../../../components/SearchComponent'
import { fontFamilies } from '../../../constants/fontFamilies'
import Swiper from 'react-native-swiper'
import ShopRecomendList from '../../../components/ShopRecomendList'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'
import Geolocation from 'react-native-geolocation-service'
import MapAPI from '../../../core/apiMap/MapAPI'
import AxiosInstance from '../../../helpers/AxiosInstance'
import _ from 'lodash'
import {CallConfig} from '../../Call/Callconfig';



const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.login)
  const [search, setSearch] = useState('')
  const [cate, setCate] = useState([])
  const [cate2, setCate2] = useState(CATE2)
  const [shopRecomend, setShopRecomend] = useState(FEATURE)
  const [shop, setShop] = useState([])
  const [shopView, setShopView] = useState([])
  // console.log('shop', shop);
  const [selectedCate, setSelectedCate] = useState(1)
  const [userLocation, setUserLocation] = useState(null);
  const [addressUser, setAddressUser] = useState('');

  // console.log('shopView', shopView);
  // console.log('userlocation', userLocation);
  // console.log('cate', cate);

  useEffect(() => {
    //callkeep
    CallConfig(user.email, 'user' + user.email);
  }, []);

  const groupedData = [];
  for (let i = 0; i < cate.length; i += 2) {
    groupedData.push(cate.slice(i, i + 2));
  }

  const renderGroupedItem = ({item, index}) => (
    <View key={index}>
      {item.map(subItem => (
        <View key={subItem.id} style={styles.item}>
          {renderCate({item: subItem})}
        </View>
      ))}
    </View>
  );

  const renderCate = ({ item }) => {
    const { _id, name, image } = item
    return (
      <TouchableOpacity key={_id} style={styles.btnCate} onPress={() => navigation.navigate('CheckOut')}>
        <View style={styles.viewImgCate}>
          {image && <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />}
        </View>
        <TextComponent text={name} fontsize={14} styles={{ width: 63 }} textAlign={'center'} />
      </TouchableOpacity>
    )
  }

  const handleSelectCate = (id) => {
    setSelectedCate(id)
    if (id == 1) {
      handleNearByShops()
    } else if (id == 2) {
      handleNewShop()
    } else if (id == 3) {
      handleRateShop()
    }
  }

  const renderCate2 = ({ item, index }) => {
    const { id, name } = item
    return (
      <TouchableOpacity
        key={id}
        style={[{ marginRight: 20 }, index == cate2.length - 1 && styles.itemLast]}
        onPress={() => handleSelectCate(id)}
      >
        <TextComponent
          text={name}
          fontsize={14}
          styles={{width: 63}}
          textAlign={'center'}
        />
      </TouchableOpacity>
    );
  };

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
        description: encodeURIComponent(userLocation[1] + ',' + userLocation[0]),
      });
      // console.log('geocoding', geocoding.results[0].formatted_address);
      setAddressUser(geocoding.results[0].formatted_address);
    }
  }

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation([longitude, latitude]);
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getDirections = async (lat, long) => {
    console.log('userLocation', userLocation);
    try {
      if (userLocation) {
        const direction = await MapAPI.getDirections({
          vehicle: 'bike',
          origin: userLocation,
          destination: [long, lat],
        });
        return direction;
      }
      return null;
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleNearByShops = async () => {
    if (shop && userLocation) {
      const promises = shop.map(async (shop) => {
        const response = await getDirections(shop.latitude, shop.longitude)
        console.log('response', response);

        if (response) {
          const distance = response.routes[0].legs[0].distance.value;
          // const location = response.routes[0].legs[0].distance.value;
          const time = response.routes[0].legs[0].duration.value;
          return { ...shop, time, distance };
        }
        return shop;
      })
      const result = await Promise.all(promises)
      const filteredShops = result.filter((shop, index) => shop.distance <= 5000)
      setShopView(filteredShops)

    }
  };

  const handleRateShop = async () => {
    const shopRate = [...shop].sort((a, b) => b.rating - a.rating)
    setShopView(shopRate)
  }

  const handleNewShop = async () => {
    const shopNew = [...shop].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    setShopView(shopNew)

  }

  const getShop = async () => {
    const response = await AxiosInstance().get('/shopOwner')
    setShop(response.data)
  }

  const getCategories = async () => {
    const response = await AxiosInstance().get('/shopCategories')
    setCate(response.data)
  }

  useEffect(() => {
    requestLocationPermission().then(hasPermission => {
      if (hasPermission) {
        getUserLocation();
      }
    });
    getShop()
    getCategories()
  }, []);

  // useEffect(() => {
  //   if (userLocation) {
  //     getGeocoding();
  //   }
  // }, [userLocation]);


  // useEffect(() => {
  //   console.log('shop', shop);
  //   if (shop.length > 0) {
  //     handleNearByShops()
  //   }
  // }, [shop]);

  return (
    <ContainerComponent styles={globalStyle.container} isScroll>
      <RowComponent justifyContent={'space-between'}>
        <View style={{flex: 1}}>
          <TextComponent
            text={'Giao đến'}
            fontsize={16}
            fontFamily={fontFamilies.bold}
          />
          <SpaceComponent height={15} />
          <RowComponent
            button
            onPress={() =>
              navigation.navigate('EditAddress', {item: addressUser})
            }>
            <Image
              source={require('../../../assets/images/home/location.png')}
              style={{marginRight: 10}}
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
          renderItem={({ item, index }) =>
            <ShopRecomendList item={item} index={index} type={'large'} list={shopRecomend} onpress={() => navigation.navigate('Address')} />
          }
          keyExtractor={item => item.id}
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
          renderItem={({item, index}) => (
            <ShopRecomendList item={item} index={index} list={shopRecomend} />
          )}
          key={item => item.id}
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
          renderItem={({ item }) => <ShopAndProductComponent type={'shop'} item={item} onPress={() => navigation.navigate('Shop', { id: item._id })} />}
          keyExtractor={item => item._id}
          scrollEnabled={false}
        />
      </View>
      {/* <ButtonComponent text={'Đăng xuất'} onPress={signOut} type={'link'} /> */}
      <SpaceComponent height={70} />
    </ContainerComponent>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
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
    height:100
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
    location: 2,
    time: 20,
    rate: 4.5,
    image: require('../../../assets/images/home/p1.png'),
  },
  {
    id: 2,
    name: 'Chicken salan',
    location: 2,
    time: 20,
    rate: 4.5,
    image: require('../../../assets/images/home/p2.png'),
  },
  {
    id: 3,
    name: 'Drumsteak Thai Ha',
    location: 2,
    time: 20,
    rate: 4.5,
    image: require('../../../assets/images/home/p1.png'),
  },
];
var SHOP = [
  {
    id: 1,
    name: 'Drumsteak Thai Ha',
    rate: 4.5,
    discount: 20,
    image: require('../../../assets/images/home/p1.png'),
    latitude: 10.787273,
    longitude: 106.749809,
  },
  {
    id: 2,
    name: 'Chicken salan',
    rate: 4.5,
    discount: 20,
    image: require('../../../assets/images/home/p2.png'),
    latitude: 10.84191,
    longitude: 106.64361,
  },
  {
    id: 3,
    name: 'Drumsteak Thai Ha',
    rate: 4.5,
    discount: 20,
    image: require('../../../assets/images/home/p1.png'),
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
