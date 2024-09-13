import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import SearchComponent from '../../../components/SearchComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { appColor } from '../../../constants/appColor'
import ShopRecomendList from '../../../components/ShopRecomendList'
import { globalStyle } from '../../../styles/globalStyle'

const SearchScreen = () => {
    const [search, setSearch] = useState('')
    const [shop, setShop] = useState(FEATURE)
    const [historySearch, setHistorySearch] = useState(HISTORY)

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
            <SpaceComponent height={70} />
            <RowComponent>
                <ButtonComponent
                    image={require('../../../assets/images/home/back.png')}
                    type={'link'}
                />
                <SpaceComponent width={10} />
                <SearchComponent placeholder={'Tìm kiếm'} value={search} onchangeText={text => setSearch(text)} />
            </RowComponent>
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
        </ContainerComponent>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
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