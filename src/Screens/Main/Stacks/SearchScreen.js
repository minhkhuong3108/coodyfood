import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
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

const SearchScreen = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [shop, setShop] = useState(FEATURE)
    const [historySearch, setHistorySearch] = useState(HISTORY)
    const [isModalVisible, setModalVisible] = useState(false);
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

    const handleSearchChange = (text) => {
        setSearch(text);
        if (text.length > 0) {
            setModalVisible(true);
        } else {
            setModalVisible(false);
        }
    };

    const suggestedProducts = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' },
        { id: '3', name: 'Product 3' },
        // Thêm các sản phẩm khác ở đây
    ];
    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.name}</Text>
        </View>
    );

    const renderHistorySearch = ({ item }) => {
        const { name } = item
        return (
            <RowComponent styles={styles.containerHS}>
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
                data={suggestedProducts}
                renderItem={renderProduct}
                keyExtractor={item => item.id}
                />
            </View> :
                <View>
                    <SpaceComponent height={40} />
                    <RowComponent justifyContent={'space-between'} >
                        <TextComponent text={'Tìm kiếm gần đây'} fontsize={18} />
                        <ButtonComponent text={'Xóa'} type={'link'} color={appColor.primary} fontsize={14} />
                    </RowComponent>
                    <SpaceComponent height={20} />
                    <View>
                        <FlatList
                            data={historySearch.slice(0, 3)}
                            renderItem={renderHistorySearch}
                            keyExtractor={item => item.id}
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
        location: 2,
        time: 20,
        rate: 4.5,
        image: require('../../../assets/images/home/p1.png')
    },
    {
        id: 2,
        name: 'Chicken salan',
        location: 2,
        time: 20,
        rate: 4.5,
        image: require('../../../assets/images/home/p2.png')
    },
    {
        id: 3,
        name: 'Drumsteak Thai Ha',
        location: 2,
        time: 20,
        rate: 4.5,
        image: require('../../../assets/images/home/p1.png')
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