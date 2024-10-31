import { FlatList, Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import { globalStyle } from '../../../styles/globalStyle'
import { useSelector } from 'react-redux'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'
import { useFocusEffect } from '@react-navigation/native'
import AxiosInstance from '../../../helpers/AxiosInstance'
import LoadingModal from '../../../modal/LoadingModal'
import TextComponent from '../../../components/TextComponent'
import { appColor } from '../../../constants/appColor'
import SpaceComponent from '../../../components/SpaceComponent'

const FavoriteScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.login)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getFavorite = async () => {
        try {
            setIsLoading(true)
            const response = await AxiosInstance().get(`/favorites/user/${user._id}`)
            setData(response.data)
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveShopFavorite = async (shop_id) => {
        const data = {
            userId: user._id,
            shopOwnerId: shop_id
        }
        try {
            const response = await AxiosInstance().delete(`/favorites/delete`, { data })
            if (response.status == true) {
                ToastAndroid.show('Xóa khỏi shop yêu thích thành công', ToastAndroid.SHORT)
                getFavorite()
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getFavorite()
        }, [])
    )

    return (
        <ContainerComponent styles={globalStyle.container}>
            <HeaderComponent text={'Yêu thích'} />
            {data.length <= 0 &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../../assets/images/favorite/heart.png')} />
                    <SpaceComponent height={30} />
                    <TextComponent text={'Chưa có shop yêu thích'} color={appColor.subText} fontsize={18} />
                </View>
            }
            <FlatList
                data={data}
                renderItem={({ item }) =>
                    <ShopAndProductComponent item={item.shopOwner} favorite type={'shop'}
                        onPressFavorite={() => handleRemoveShopFavorite(item.shopOwner._id)}
                        onPress={() => navigation.navigate('Shop', { id: item.shopOwner._id })} />}
                keyExtractor={item => item._id}
            />
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    )
}

export default FavoriteScreen

const styles = StyleSheet.create({})