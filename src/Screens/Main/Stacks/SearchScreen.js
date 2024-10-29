import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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

const SearchScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.login)
    const [search, setSearch] = useState('')
    const [shop, setShop] = useState(FEATURE)
    const [suggested, setSuggested] = useState([])
    const [historySearch, setHistorySearch] = useState([])
    const [isModalVisible, setModalVisible] = useState(false);
    const historyKey = `historySearch_${user._id}`
    console.log('historySearch', historySearch);

    // console.log('search', search.length);


    const refSearch = useRef()

    useEffect(() => {
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
    useEffect(() => {
        loadHistorySearch()
    }, [])

    const handleSearchChange = (text) => {
        setSearch(text);
        if (text.length > 0) {
            setModalVisible(true);
            getSearch(text)
        } else {
            setModalVisible(false);
        }
    };

    const getSearch = async (keyword) => {
        try {
            const response = await AxiosInstance().post(`/shopOwner/search?keyword=${keyword}`)
            console.log('search', response.data);
            setSuggested(response.data)
        } catch (error) {
            console.log(error);
        }
    }

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

    const handleSuggestionsShop = (item) => {
        setHistorySearch(prevHistory => {
            const newHistory = [item, ...prevHistory.filter(prev => prev._id !== item._id)]
            saveHistorySearch(newHistory.slice(0, 3))
            return newHistory.slice(0, 3)
        })
        if (item.type === 'shop') {
            navigation.navigate('ListSearch', { type: 'shop', shopId: item._id })
        }
        else if (item.type === 'category') {
            navigation.navigate('ListSearch', { type: 'category', category: item._id })
        }
    }

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
                <SearchComponent placeholder={'Tìm kiếm'} value={search} onchangeText={text => handleSearchChange(text)} ref={refSearch} />
            </RowComponent>
            {search.length > 0 ?
                <View>
                    <SpaceComponent height={20} />
                    <FlatList
                        data={suggested}
                        renderItem={renderSuggestionItem}
                        keyExtractor={item => item._id}
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
                            keyExtractor={item => item._id}
                        />
                    </View>
                    <SpaceComponent height={30} />
                    <TextComponent text={'Nhà hàng nổi bật'} fontsize={20} />
                    <SpaceComponent height={20} />
                    <View>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={shop}
                            renderItem={({ item, index }) => <ShopRecomendList item={item} index={index} list={shop} />}
                            keyExtractor={item => item.id}
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
        rating: 4.8,
        images: ['https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp'],
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