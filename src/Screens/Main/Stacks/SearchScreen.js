import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import SearchComponent from '../../../components/SearchComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { appColor } from '../../../constants/appColor'
import ShopRecomendList from '../../../components/ShopRecomendList'
import { globalStyle } from '../../../styles/globalStyle'
import SearchModal from '../../../modal/SearchResultsModal'
import SearchResultsModal from '../../../modal/SearchResultsModal'
import AxiosInstance from '../../../helpers/AxiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { calculateTravelTime, haversineDistance } from '../../../components/CaculateDistanceShop'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

const SearchScreen = ({ navigation, route }) => {
    const { user } = useSelector(state => state.login)
    const { userLocation } = useSelector(state => state.userLocation)
    const name = route.params?.name || ''
    // console.log('name', name);

    const [search, setSearch] = useState(name)
    // console.log('search', search);

    const [shop, setShop] = useState()
    const [suggested, setSuggested] = useState([])
    const [historySearch, setHistorySearch] = useState([])
    const [isModalVisible, setModalVisible] = useState(false);
    const [nearShop, setNearShop] = useState([])
    const historyKey = `historySearch_${user._id}`
    // const [shopSearch, setShopSearch] = useState([])
    // console.log('historySearch', historySearch);
    const refSearch = useRef()
    // console.log('suggest', suggested);

    useFocusEffect(
        useCallback(() => {
            // if (refSearch.current) {
            //     refSearch.current.focus()
            //     console.log('refSearch.current', refSearch.current.focus());  
            // }
            const timer = setTimeout(() => {
                if (refSearch.current) {
                    refSearch.current.focus();
                }
            }, 100); // Delay to ensure the component is mounted
            return () => clearTimeout(timer);
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            if (name) {
                setSearch(name);
                // getSearch(name) // Cập nhật giá trị của search khi màn hình được focus
                getSearch2(name)
            }
        }, [name])
    );

    useEffect(() => {
        loadHistorySearch()
        getShop()
    }, [])

    const handleSearchChange = (text) => {
        setSearch(text);
        if (text.length > 0) {
            setModalVisible(true);
            // getSearch(text)
            getSearch2(text)
        } else {
            setModalVisible(false);
        }
    };

    const getSearch = async (keyword) => {
        try {
            const response = await AxiosInstance().post(`/shopOwner/search?keyword=${keyword}`)
            // console.log('search', response.data);
            // setSuggested(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const getSearch2 = async (keyword) => {
        try {
            const response = await AxiosInstance().get(`/products/search?keyword=${keyword}`)
            console.log('search2', response.data);
            setSuggested(response.data.suggestions)
        } catch (error) {
            console.log(error);
        }
    }


    const getShop = async () => {
        try {
            const response = await AxiosInstance().get('/shopOwner')
            setShop(response.data)
        } catch (error) {
            console.log(error);
        }
    }

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

    useEffect(() => {
        getNearByShops();
    }, [shop, userLocation]);

    const loadHistorySearch = async () => {
        try {
            const history = await AsyncStorage.getItem(historyKey)
            if (history) {
                setHistorySearch(JSON.parse(history))
            }
        } catch (error) {
            console.log(error);
        }
    }
        
    const saveHistorySearch = async (history) => {
        try {
            await AsyncStorage.setItem(historyKey, JSON.stringify(history))
        } catch (error) {
            console.log(error);
        }
    }

    const removeHistorySearch = async () => {
        try {
            await AsyncStorage.removeItem(historyKey)
            setHistorySearch([])
        } catch (error) {
            console.log(error);
        }
    }

    const handleSuggestionsShop = async (item) => {
        console.log('yes');
        console.log('item', typeof item);


        // if (item.type === 'shop') {
        //     console.log('shop');

        //     navigation.navigate('ListSearch', { type: 'shop', shopId: item._id, name: item.name })
        // }
        // else if (item.type === 'category') {
        //     console.log('category');

        //     navigation.navigate('ListSearch', { type: 'category', category: item._id, name: item.name })
        // }
        if (typeof item !== 'object') {
            const response = await AxiosInstance().get(`/products/search?keyword=${item}`)
            const shopSearch = response.data.results
            navigation.navigate('ListSearch', { shop: shopSearch, name: item })
            setHistorySearch(prevHistory => {
                const newHistory = [{ name: item }, ...prevHistory.filter(prev => prev.name !== item)]
                saveHistorySearch(newHistory.slice(0, 3))
                return newHistory.slice(0, 3)
            }
            )
        } else {
            const response = await AxiosInstance().get(`/products/search?keyword=${item.name}`)

            // Lưu lịch sử tìm kiếm
            setHistorySearch(prevHistory => {
                const newHistory = [item, ...prevHistory.filter(prev => prev.name !== item.name)]
                saveHistorySearch(newHistory.slice(0, 3))
                return newHistory.slice(0, 3)
            })

            const shopSearch = response.data.results
            navigation.navigate('ListSearch', { shop: shopSearch, name: item.name, type: item.type })
        }
    }

    const handleKeyPress = ({ nativeEvent }) => {
        if (nativeEvent.key === 'Enter') {
            // Thực hiện hành động khi ấn phím Enter
            console.log('Enter pressed');
            handleSuggestionsShop(search);
        }
    };

    const renderSuggestionItem = ({ item }) => (
        <TouchableOpacity style={styles.productContainer} onPress={() => handleSuggestionsShop(item)}>
            <Text style={styles.productName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderHistorySearch = ({ item }) => {
        const { name } = item
        return (
            <RowComponent button onPress={() => handleSuggestionsShop(item)} styles={styles.containerHS}>
                <Image source={require('../../../assets/images/home/history.png')} style={{ marginLeft: 3, marginRight: 9 }} />
                <TextComponent text={name} fontsize={14} color={appColor.subText} />
            </RowComponent>
        )
    }
    return (
        <ContainerComponent styles={globalStyle.container}>
            <SpaceComponent height={20} />
            <RowComponent>
                <ButtonComponent
                    image={require('../../../assets/images/home/back.png')}
                    type={'link'}
                    onPress={() => navigation.goBack()}
                />
                <SpaceComponent width={10} />
                <SearchComponent placeholder={'Tìm kiếm'}
                    value={search} onchangeText={text => handleSearchChange(text)} ref={refSearch}
                    onSubmitEditing={() => handleSuggestionsShop(search)} />
            </RowComponent>
            {search.length > 0 ?
                <View>
                    <SpaceComponent height={20} />
                    <FlatList
                        data={suggested}
                        renderItem={renderSuggestionItem}
                        keyExtractor={item => item.name}
                    />
                </View> :
                <View>
                    <SpaceComponent height={40} />
                    {historySearch.length > 0 && <RowComponent justifyContent={'space-between'} >
                        <TextComponent text={'Tìm kiếm gần đây'} fontsize={18} />
                        <ButtonComponent text={'Xóa'} type={'link'} color={appColor.primary} fontsize={14}
                            onPress={removeHistorySearch} />
                    </RowComponent>
                    }
                    {historySearch.length > 0 && <SpaceComponent height={20} />}
                    <View>
                        <FlatList
                            data={historySearch}
                            renderItem={renderHistorySearch}
                            keyExtractor={item => item.name}
                        />
                    </View>
                    <SpaceComponent height={30} />
                    <TextComponent text={'Nhà hàng nổi bật'} fontsize={20} />
                    <SpaceComponent height={20} />
                    <View>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={nearShop.slice(0,5)}
                            renderItem={({ item, index }) => <ShopRecomendList item={item} index={index} list={shop} />}
                            keyExtractor={item => item._id}
                        />
                    </View>
                </View>
            }
        </ContainerComponent>
    )

}

export default SearchScreen

const styles = StyleSheet.create({
    productContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    productName: {
        fontSize: 16,
    },
    containerHS: {
        borderBottomWidth: 1,
        borderBottomColor: appColor.gray,
        paddingBottom: 7,
        marginVertical: 5
    }
})

var FEATURE = [
    {
        id: 1,
        name: 'Drumsteak Thai Ha',
        distance: 2,
        time: 20,
        rating: 4.3,
        images: ['https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp'],
    },
    {
        id: 2,
        name: 'Chicken salan',
        distance: 2,
        time: 20,
        rating: 4.8,
        images: ['https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fdelivery-system-v2%2F03-04-2022-Image%2F20100005_2.jpg&w=1920&q=75'],
    },
    {
        id: 3,
        name: 'Drumsteak Thai Ha',
        distance: 2,
        time: 20,
        rating: 4.5,
        images: ['https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp'],
    },
]

var HISTORY = [
    {
        id: 1,
        name: 'Drumsteak Thai Ha',
    },
    {
        id: 2,
        name: 'Chicken salan',
    },
    {
        id: 3,
        name: 'Drumsteak Thai Ha',
    },
    {
        id: 4,
        name: 'Chicken salan',
    },
    {
        id: 5,
        name: 'Drumsteak Thai Ha',
    },
    {
        id: 6,
        name: 'Chicken salan',
    }
]