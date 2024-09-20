import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'
import { globalStyle } from '../../../styles/globalStyle'

const ProductFavoriteScreen = () => {
    const [shop, setShop] = useState(SHOP)
    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent isback text={'Nhà Hàng Yêu Thích'} />
            <FlatList
                data={shop}
                renderItem={({ item }) => <ShopAndProductComponent item={item} favorite type={'shop'} />}
                keyExtractor={item => item.id}
            />
        </ContainerComponent>
    )
}

export default ProductFavoriteScreen

const styles = StyleSheet.create({})

var SHOP = [
    {
        id: 1,
        name: 'Drumsteak Thai Ha',
        location: 2,
        time: 20,
        rate: 4.5,
        discount: 20,
        image: require('../../../assets/images/home/p1.png')
    },
    {
        id: 2,
        name: 'Chicken salan',
        location: 2,
        time: 20,
        rate: 4.5,
        discount: 20,
        image: require('../../../assets/images/home/p2.png')
    },
    {
        id: 3,
        name: 'Drumsteak Thai Ha',
        location: 2,
        time: 20,
        rate: 4.5,
        discount: 20,
        image: require('../../../assets/images/home/p1.png')
    },

]