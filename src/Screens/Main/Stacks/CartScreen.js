import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import { globalStyle } from '../../../styles/globalStyle'
import RowComponent from '../../../components/RowComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import TextComponent from '../../../components/TextComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { fontFamilies } from '../../../constants/fontFamilies'
import { appColor } from '../../../constants/appColor'
import AxiosInstance from '../../../helpers/AxiosInstance'
import { useSelector } from 'react-redux'
import LoadingModal from '../../../modal/LoadingModal'
import { appInfor } from '../../../constants/appInfor'
import { formatPrice } from '../../../components/format/FomatPrice'
import AlertChoiceModal from '../../../modal/AlertChoiceModal'

const CartScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.login)
    const [cart, setCart] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [visible, setVisible] = useState(false)

    const getCart = async () => {
        try {
            setIsLoading(true)
            const response = await AxiosInstance().get(`/carts/${user._id}`)
            console.log('cart', response.data);
            if (response.data != null) {
                setCart(response.data)
            } else {
                setCart([])
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteCart = async () => {
        setVisible(false)
        try {
            setIsLoading(true)
            const response = await AxiosInstance().delete(`/carts/${user._id}`)
            if (response.status === true) {
                setCart([])
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }
    const handleDeleteItem = async (shopId) => {
        try {
            setIsLoading(true)
            const response = await AxiosInstance().delete(`/carts/delete/${user._id}/${shopId}`)
            if (response.status === true) {
                getCart()
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCart()
    }, [])

    const renderItem = ({ item }) => {
        const { shopId, shopImage, shopName, shopAddress, totalPrice, totalItem, totalQuantity } = item
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Shop', { id: shopId })} >
                <RowComponent noAlign >
                    {shopImage && <Image source={{ uri: shopImage[0] }} style={styles.imgShop} />}
                    <SpaceComponent width={10} />
                    <View style={{ justifyContent: 'space-between', flex: 1 }}>
                        <RowComponent justifyContent={'space-between'} noAlign>
                            <TextComponent numberOfLines={2} ellipsizeMode={'tail'}
                                text={shopName} fontFamilies={fontFamilies.bold} width={appInfor.sizes.width * 0.45} />
                            <ButtonComponent type={'link'} image={require('../../../assets/images/myorder/close.png')}
                                onPress={() => handleDeleteItem(shopId)} />
                        </RowComponent>
                        <TextComponent text={shopAddress} fontsize={14} color={appColor.subText} />
                        <RowComponent justifyContent={'space-between'} noAlign>
                            <TextComponent text={`${formatPrice(totalPrice)}`} color={appColor.primary} fontFamily={fontFamilies.bold} />
                            <TextComponent text={totalItem + ' sản phẩm'} />
                            {/* <TextComponent text={totalQuantity + ' sản phẩm'} /> */}
                        </RowComponent>
                    </View>

                </RowComponent>
            </TouchableOpacity>
        )
    }
    return (
        <ContainerComponent styles={globalStyle.container} isScroll>
            <HeaderComponent text={'Giỏ hàng'} isback imgRight={require('../../../assets/images/cart/trash.png')}
                onPress={() => setVisible(true)} />
            {
                cart.length === 0 &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <SpaceComponent height={20} />
                    <Image source={require('../../../assets/images/cart/noCart.png')} />
                    <SpaceComponent height={20} />
                    <TextComponent text={'Hiện bạn không có sản phẩm trong giỏ hàng.'} textAlign={'center'} />
                    <SpaceComponent height={20} />
                </View>
            }
            <FlatList
                scrollEnabled={false}
                data={cart}
                renderItem={renderItem}
                keyExtractor={item => item.shopId}
            />
            <LoadingModal visible={isLoading} />
            <AlertChoiceModal
                visible={visible}
                title={'Xóa giỏ hàng'}
                description={'Bạn có chắc chắn muốn xóa giỏ hàng không?'}
                onClose={() => setVisible(false)}
                onPress={handleDeleteCart} />
        </ContainerComponent>
    )
}

export default CartScreen

const styles = StyleSheet.create({
    imgShop: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    item: {
        gap: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: appColor.gray,
    },
})