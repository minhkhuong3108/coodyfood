import { FlatList, Image, ImageBackground, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import { appColor } from '../../../constants/appColor'
import RowComponent from '../../../components/RowComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import TextComponent from '../../../components/TextComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import LineComponent from '../../../components/LineComponent'
import { fontFamilies } from '../../../constants/fontFamilies'
import { globalStyle } from '../../../styles/globalStyle'
import ReviewList from '../../../components/ReviewList'
import AxiosInstance from '../../../helpers/AxiosInstance'
import { formatPrice } from '../../../components/format/FomatPrice'
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'
import { useSelector } from 'react-redux'
import LoadingModal from '../../../modal/LoadingModal'
import ChangeQuantityModal from '../../../modal/ChangeQuantityModal'
import AlertChoiceModal from '../../../modal/AlertChoiceModal'

const ProductDetail = ({ navigation, route }) => {
    const { user } = useSelector(state => state.login)
    const { id, shopOwnerId } = route.params
    const [rate, setRate] = useState(null)
    const [product, setProduct] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({})
    const [cart, setCart] = useState([])
    const [visibleQuantity, setVisibleQuantity] = useState(false)
    const [visibleDelete, setVisibleDelete] = useState(false)
    const [quantityText, setQuantityText] = useState('')
    const [currentItem, setCurrentItem] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [note, setNote] = useState('');
    // console.log('product', product);



    const snapPoint = ['80%']
    const bottomSheetRef = useRef(null)
    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.expand()
    }
    const handleCloseBottomSheet = () => {
        bottomSheetRef.current?.close()
    }

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
        )
    )

    const snapPoint2 = ['50%']
    const bottomSheetRef2 = useRef(null)
    const handleOpenBottomSheet2 = (item) => {
        setSelectedProduct(item._id)
        setNote(item.note || '')
        bottomSheetRef2.current?.expand()
    }
    const handleCloseBottomSheet2 = () => {
        bottomSheetRef2.current?.close()
    }

    const renderBackdrop2 = useCallback(
        (props) => (
            <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
        )
    )

    const handleUpdateNote = async () => {
        if (!note) {
            handleCloseBottomSheet2()
            return
        }
        const body = {
            note,
        }
        try {
            const response = await AxiosInstance().put(`/carts/update-note/${data._id}/${selectedProduct}`, body)
            console.log('response', response);
            if (response.data) {
                ToastAndroid.show('Cập nhật ghi chú thành công', ToastAndroid.SHORT)
                handleCloseBottomSheet2()
                getCart()
            }
        } catch (error) {
            console.log('error', error);
        }
    }


    const getProduct = async () => {
        try {
            const response = await AxiosInstance().get(`/products/${id}`)
            // console.log('response', response.data);

            setProduct(response.data)
        } catch (error) {
            console.log('error', error);
        }
    }

    const getCart = async () => {
        setIsLoading(true);
        try {
            const response = await AxiosInstance().get(`/carts/${user._id}/${shopOwnerId}`)
            if (response.status == true && response.data.carts != null) {
                setData(response.data.carts)
                const product = response.data.carts.products
                setCart(product)
            }
            if (response.status == true && response.data.carts == null) {
                setData(null)
                setCart(null)
            }

        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoading(false);
        }
    }



    useEffect(() => {
        getProduct()
        getCart()
        getRate()
    }, [])

    const isProductInCart = (productId) => {
        return cart && cart.some(item => item._id === productId);
    };

    const inCart = isProductInCart(product._id);
    const cartItem = cart && cart.find(cartItem => cartItem._id == product._id)
    const quantity = cartItem && cartItem.quantity

    const handleAddToCart = async (item) => {
        const data = {
            user: user._id,
            shopOwner: shopOwnerId,
            products: item._id,
        }
        try {
            const response = await AxiosInstance().post('/carts/add', data)
            if (response.data.errors) {
                if (response.data.errors.status == 'Đóng cửa') {
                    setVisible(true)
                    return
                }
                if (response.data.errors.status == 'Ngưng hoạt động') {
                    setVisible2(true)
                    return
                }
                if (response.data.errors.status == 'Hết món') {
                    ToastAndroid.show('Sản phẩm đã hết món', ToastAndroid.SHORT)
                    getProductByShop()
                    getProductsByCategory()
                }
            }

            if (response.data.carts) {
                getCart()
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    const handleChangeQuantityProduct = async (item) => {
        // const cartItem = cart && cart.find(cartItem => cartItem._id === item._id);
        // const quantity = cartItem && cartItem.quantity;
        setVisibleQuantity(false)
        const data = {
            user: user._id,
            shopOwner: shopOwnerId,
            product: item._id,
            quantity: parseInt(quantityText)
        }
        setIsLoading(true);
        try {
            const response = await AxiosInstance().put('/carts/update', data)
            // console.log('change', response.data.carts);
            if (response.data.errors) {
                if (response.data.errors.status == 'Đóng cửa') {
                    setVisible(true)
                    return
                }
                if (response.data.errors.status == 'Ngưng hoạt động') {
                    setVisible2(true)
                    return
                }
                if (response.data.errors.status == 'Hết món') {
                    ToastAndroid.show('Sản phẩm đã hết món', ToastAndroid.SHORT)
                    navigation.goBack()
                }
            }
            if (response.data.carts) {
                getCart()
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleReduceProduct = async (item) => {
        const cartItem = cart && cart.find(cartItem => cartItem._id === item._id);
        const quantity = cartItem && cartItem.quantity;
        const data = {
            user: user._id,
            shopOwner: shopOwnerId,
            products: item._id,
            // quantity: quantity - 1
        }
        setIsLoading(true);
        try {
            const response = await AxiosInstance().put('/carts/delete', data)
            if (response.data.errors) {
                if (response.data.errors.status == 'Đóng cửa') {
                    setVisible(true)
                    return
                }
                if (response.data.errors.status == 'Ngưng hoạt động') {
                    setVisible2(true)
                    return
                }
                if (response.data.errors.status == 'Hết món') {
                    ToastAndroid.show('Sản phẩm đã hết món', ToastAndroid.SHORT)
                }
            }

            if (response.data.carts) {
                getCart()
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteCart = async () => {
        try {
            const response = await AxiosInstance().delete(
                `/carts/delete/${user._id}/${shopOwnerId}`,
            );
            if (response.status == true) {
                setVisibleDelete(false)
                getCart()
                handleCloseBottomSheet()
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const getRate = async () => {
        try {
            setIsLoading(true)
            const response = await AxiosInstance().get(`/productReviews/product/${id}`)
            // console.log('review', response.data);
            setRate(response.data)

        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ContainerComponent styles={{ flex: 1, backgroundColor: appColor.white }}>
            <ContainerComponent isScroll>
                {product.images && <ImageBackground style={styles.imageBackground} source={{ uri: product.images[0] }}>
                    <ButtonComponent
                        image={require('../../../assets/images/shopDetail/back.png')}
                        styles={styles.btnBack}
                        type={'link'}
                        onPress={() => navigation.goBack()}
                    />
                </ImageBackground>}
                <SpaceComponent height={15} />
                <ContainerComponent styles={[globalStyle.container, { paddingTop: 0 }]}>
                    {product.name && <TextComponent text={product.name} fontsize={18} />}
                    <SpaceComponent height={15} />
                    <TextComponent text={`${product.soldOut} đã bán | ${product.rating} đánh giá`} fontsize={12} color={appColor.subText} />
                    <SpaceComponent height={15} />
                    <RowComponent justifyContent={'space-between'}>
                        {product.price && <TextComponent text={formatPrice(product.price)} />}
                        {inCart ?
                            <RowComponent>
                                <TouchableOpacity onPress={() => handleReduceProduct(product)}>
                                    <Image source={require('../../../assets/images/home/reduce.png')} />
                                </TouchableOpacity>
                                <SpaceComponent width={5} />
                                <TextComponent text={quantity} fontsize={14} styles={{ marginHorizontal: 10 }}
                                />
                                <SpaceComponent width={5} />
                                <TouchableOpacity onPress={() => handleAddToCart(product)}>
                                    <Image source={require('../../../assets/images/home/add.png')} />
                                </TouchableOpacity>
                            </RowComponent> :
                            <TouchableOpacity onPress={() => handleAddToCart(product)}>
                                <Image source={require('../../../assets/images/home/add.png')} />
                            </TouchableOpacity>
                        }
                    </RowComponent>
                    <SpaceComponent height={20} />
                    <LineComponent />
                    <SpaceComponent height={20} />
                    <TextComponent text={'Đánh giá'} fontsize={18} fontFamily={fontFamilies.bold} />
                    <SpaceComponent height={20} />
                    {rate ? <FlatList
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        data={rate}
                        renderItem={({ item }) => <ReviewList item={item} />}
                        keyExtractor={item => item._id}
                    /> :
                        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <TextComponent text={'Chưa có đánh giá nào'} fontsize={18} color={appColor.subText} />
                        </View>
                    }
                </ContainerComponent>
            </ContainerComponent>
            {cart && data && <RowComponent onPress={handleOpenBottomSheet}
                activeOpacity={1} button justifyContent={'space-between'} styles={styles.containerCart}>
                <View style={styles.viewCart}>
                    <View style={styles.viewQuantity}>
                        <TextComponent text={data.totalItem} color={appColor.white} fontsize={10} />
                    </View>
                    <Image source={require('../../../assets/images/cart/cart.png')} />
                </View>
                <RowComponent>
                    {data.totalPrice && <TextComponent text={formatPrice(data.totalPrice)} />}
                    <SpaceComponent width={10} />
                    <ButtonComponent text={'Giao hàng'} color={appColor.white} height={70} width={150} borderRadius={0}
                        onPress={() => navigation.navigate('CheckOut', { data })} />
                </RowComponent>
            </RowComponent>}
            {data && <BottomSheet
                enablePanDownToClose
                ref={bottomSheetRef}
                snapPoints={snapPoint}
                backdropComponent={renderBackdrop}
                handleComponent={null}
                index={-1}
            >
                <RowComponent styles={styles.headerBottomSheet} justifyContent={'space-between'}>
                    <ButtonComponent type={'link'} text={'Xóa '} color={appColor.white} onPress={() => setVisibleDelete(true)} />
                    <TextComponent text={'Giỏ hàng'} color={appColor.white} />
                    <ButtonComponent type={'link'} text={'Đóng'} color={appColor.white} onPress={handleCloseBottomSheet} />
                </RowComponent>
                <SpaceComponent height={20} />
                <BottomSheetFlatList
                    showsVerticalScrollIndicator={false}
                    data={cart}
                    renderItem={({ item }) =>
                        <ShopAndProductComponent item={item} quantity={item.quantity} inCart
                            onPressIncrease={() => handleAddToCart(item)}
                            onPressReduce={() => handleReduceProduct(item)}
                            onPressQuantity={() => {
                                setCurrentItem(item)
                                setVisibleQuantity(true)
                                setQuantityText(`${item.quantity}`)
                            }}
                            noted
                            onPressNote={() => handleOpenBottomSheet2(item)}
                        />}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </BottomSheet>}
            <BottomSheet
                enablePanDownToClose
                ref={bottomSheetRef2}
                snapPoints={snapPoint2}
                backdropComponent={renderBackdrop2}
                handleComponent={null}
                index={-1}>
                <RowComponent
                    styles={styles.headerBottomSheet}
                    justifyContent={'space-between'}>
                    <ButtonComponent
                        type={'link'}
                        text={'Đóng'}
                        color={appColor.white}
                        onPress={handleCloseBottomSheet2}
                    />
                    <TextComponent text={'Ghi chú'} color={appColor.white} />
                    <ButtonComponent
                        type={'link'}
                        text={'Xong'}
                        color={appColor.white}
                        onPress={handleUpdateNote}
                    />
                </RowComponent>
                <SpaceComponent height={20} />
                <View style={{ paddingHorizontal: 16 }}>
                    <TextComponent text={'Thêm ghi chú:'} />
                    <SpaceComponent height={20} />
                    <TextInput
                        placeholder={'Nhập ghi chú...'}
                        style={styles.inputNote}
                        value={note}
                        onChangeText={text => setNote(text)}
                    />
                </View>
            </BottomSheet>
            <LoadingModal visible={isLoading} />
            <ChangeQuantityModal visible={visibleQuantity}
                value={quantityText}
                onChangeText={text => setQuantityText(text)}
                title={'Số lượng'}
                onClose={() => setVisibleQuantity(false)}
                onPress={() => handleChangeQuantityProduct(currentItem)} />
            <AlertChoiceModal visible={visibleDelete} onPress={handleDeleteCart}
                title={'Xóa giỏ hàng'}
                description={'Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng'}
                onClose={() => setVisibleDelete(false)} />
        </ContainerComponent>
    )
}

export default ProductDetail

const styles = StyleSheet.create({
    inputNote: {
        height: 140,
        borderRadius: 10,
        backgroundColor: appColor.opacity,
        paddingHorizontal: 16,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    headerBottomSheet: {
        backgroundColor: appColor.primary,
        height: 50,
        paddingHorizontal: 16,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    viewQuantity: {
        backgroundColor: appColor.primary,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20 / 2,
        position: 'absolute',
        top: -5,
        right: -5,
    },
    viewCart: {
        backgroundColor: '#F6F6F7',
        width: 55,
        height: 55,
        borderRadius: 55 / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerCart: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: appColor.white,
        paddingLeft: 16,
        zIndex: 1,
    },
    imgRate: {
        width: 100,
        height: 100,
        marginRight: 10
    },
    imgAvatar: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
    },
    containerRate: {
        flexDirection: 'row',
        marginBottom: 30
    },
    btnAdd: {
        backgroundColor: appColor.primary,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBackground: {
        width: '100%',
        height: 233
    },
    btnBack: {
        position: 'absolute',
        top: 50,
        left: 24,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
})

var RATE = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        rate: 4.5,
        comment: 'Sản phẩm rất tốt',
        images: [require('../../../assets/images/productDetail/p1.png'), require('../../../assets/images/productDetail/p1.png')],
        avatar: require('../../../assets/images/productDetail/avatar.png'),
        day: '26-05-2024'
    },
    {
        id: 2,
        name: 'Nguyễn Văn B',
        rate: 4.5,
        comment: 'Sản phẩm rất tốt',
        avatar: require('../../../assets/images/productDetail/avatar.png'),
        images: [require('../../../assets/images/productDetail/p1.png')],
        day: '26-05-2024'
    },
    {
        id: 3,
        name: 'Nguyễn Văn C',
        rate: 4.5,
        comment: 'Sản phẩm rất tốt',
        avatar: require('../../../assets/images/productDetail/avatar.png'),
        day: '26-05-2024'
    }
]