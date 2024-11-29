import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'
import AxiosInstance from '../../../helpers/AxiosInstance'
import { globalStyle } from '../../../styles/globalStyle'
import SpaceComponent from '../../../components/SpaceComponent'
import RowComponent from '../../../components/RowComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import SearchComponent from '../../../components/SearchComponent'
import { useFocusEffect } from '@react-navigation/native'

const ListSearchScreen = ({ navigation, route }) => {
    // const { type, category, shopId, name } = route.params
    const {shop,name} = route.params

    const [shops, setShops] = useState([])
    console.log('shops', shop);


    // const getShopsByCategory = async () => {
    //     try {
    //         const response = await AxiosInstance().get(`/shopCategories/shop/${category}`)
    //         setShops(response.data)
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // const getShopsById = async () => {
    //     try {
    //         const response = await AxiosInstance().get(`/shopOwner/${shopId}`)
    //         setShops([response.data])
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // useFocusEffect(
    //     useCallback(() => {
    //         if (type == 'category') {
    //             getShopsByCategory()
    //         } else {
    //             getShopsById()
    //         }
    //     }, [type, category, shopId])
    // )

    return (
        <ContainerComponent styles={globalStyle.container}>
            <RowComponent>
                <ButtonComponent
                    image={require('../../../assets/images/home/back.png')}
                    type={'link'}
                    onPress={() => navigation.navigate('Home')}
                />
                <SpaceComponent width={10} />
                <SearchComponent placeholder={'Tìm kiếm'} value={name} onPress={() => navigation.push('Search', { name })} />
            </RowComponent>
            <SpaceComponent height={20} />
            <FlatList
                data={shop}
                renderItem={({ item }) => <ShopAndProductComponent type={'shop'} item={item} />}
            />
        </ContainerComponent>
    )
}

export default ListSearchScreen

const styles = StyleSheet.create({})