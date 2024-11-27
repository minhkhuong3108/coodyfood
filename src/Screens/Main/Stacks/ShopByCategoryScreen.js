import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import { globalStyle } from '../../../styles/globalStyle'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'
import AxiosInstance from '../../../helpers/AxiosInstance'
import TextComponent from '../../../components/TextComponent'

const ShopByCategoryScreen = ({ navigation, route }) => {
    const { item } = route.params
    const [shops, setShops] = useState(null)
    console.log('item', item);

    const getShopByCategory = async () => {
        try {
            const response = await AxiosInstance().get(`/shopCategories/shop/${item._id}`)
            setShops(response.data)
        } catch (error) {
            console.log('error', error);
        }
    }

    useEffect(() => {
        getShopByCategory()
    }, [])

    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={item.name} isback />
           {shops? <FlatList
                data={shops}
                renderItem={({ item }) => <ShopAndProductComponent item={item} type={'shop'} order onPress={() => navigation.navigate('Shop', { id: item._id })} />}
                keyExtractor={(item, index) => index.toString()}
            />:
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <TextComponent text={'Danh mục này chưa có shop'}/>
            </View>
        }

        </ContainerComponent>
    )
}

export default ShopByCategoryScreen

const styles = StyleSheet.create({})