import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'
import AxiosInstance from '../../../helpers/AxiosInstance'
import { globalStyle } from '../../../styles/globalStyle'

const ListSearchScreen = ({ navigation, route }) => {
    const { type, category, shopId } = route.params
    const [shops, setShops] = useState([])

    const getShopsByCategory = async () => {
        try {
            const response = await AxiosInstance().get(`/shopCategories/shop/${category}`)
            console.log('response', response.data);
            setShops(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const getShopsById = async () => {
        try {
            const response = await AxiosInstance().get(`/shopOwner/${shopId}`)
            console.log('response', response.data);
            setShops([response.data])
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (type == 'category') {
            getShopsByCategory()
        } else {
            getShopsById()
        }
    }, [])

    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={'Danh sách tìm kiếm'} isback />
            <FlatList
                data={shops}
                renderItem={({ item }) => <ShopAndProductComponent type={'shop'} item={item} />}
            />
        </ContainerComponent>
    )
}

export default ListSearchScreen

const styles = StyleSheet.create({})