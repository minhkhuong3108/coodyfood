import { FlatList, Image, ImageBackground, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { act, useCallback, useEffect, useRef, useState } from 'react'
import ButtonComponent from '../../../components/ButtonComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import TextComponent from '../../../components/TextComponent'
import { fontFamilies } from '../../../constants/fontFamilies'
import RowComponent from '../../../components/RowComponent'
import { appColor } from '../../../constants/appColor'
import ContainerComponent from '../../../components/ContainerComponent'
import { globalStyle } from '../../../styles/globalStyle'
import LineComponent from '../../../components/LineComponent'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import AxiosInstance from '../../../helpers/AxiosInstance'
import { formatRating } from '../../../components/format/FormatRate'
import { formatSold } from '../../../components/format/FormatSold'
import { useSelector } from 'react-redux'
import LoadingModal from '../../../modal/LoadingModal'
import { formatPrice } from '../../../components/format/FomatPrice'
import { calculateTravelTime, haversineDistance } from '../../../components/CaculateDistanceShop'
import { formatDistance } from '../../../components/format/FormatDistance'
import formatTime from '../../../components/format/FormatTime'
import { useFocusEffect } from '@react-navigation/native'
import AlertNoChoiceModal from '../../../modal/AlertNoChoiceModal'
import ChangeQuantityModal from '../../../modal/ChangeQuantityModal'

const ShopDetailScreen = ({ navigation, route }) => {
    const { id } = route.params
    console.log('id', id);

    const { user } = useSelector(state => state.login)
    const { userLocation } = useSelector(state => state.userLocation)
    const [productPopular, setproductPopular] = useState([])
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [data, setData] = useState()
    const [cart, setCart] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [shopDetail, setShopDetail] = useState({})
    const [isFavorite, setIsFavorite] = useState(false)
    const [distance, setDistance] = useState(null)
    const [time, setTime] = useState(null)
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [visibleQuantity, setVisibleQuantity] = useState(false)
    const [quantity, setQuantity] = useState('')
    const [currentItem, setCurrentItem] = useState(null); // State để lưu trữ item hiện tại
    // console.log('shopDetail', shopDetail);
    console.log('selectedCategory', selectedCategory);

    console.log('cart', cart);




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


    const getShopDetail = async () => {
        try {
            const response = await AxiosInstance().get(`/shopOwner/${id}`)
            setShopDetail(response.data)
        } catch (error) {
            console.log('error', error);
        }
    }

    const calculateDistanceToShop = shopLocation => {
        if (userLocation) {
            const distance = haversineDistance(userLocation, shopLocation);
            const minutes = calculateTravelTime(distance, 5);
            return setDistance(distance), setTime(minutes);
        }
        return null;
    };

    useEffect(() => {
        calculateDistanceToShop([shopDetail.latitude, shopDetail.longitude]);
    }, [shopDetail, userLocation]);

    const getCategoriesProduct = async () => {
        try {
            const response = await AxiosInstance().get(`/productCategories/shopOwner/${id}`)
            setCategory(response.data)
        } catch (error) {
            console.log('error', error);
        }
    }
    const getCart = async () => {
        setIsLoading(true);
        try {
            const response = await AxiosInstance().get(`/carts/${user._id}/${id}`)
            console.log('getcart', response.data);
            // console.log('response.data == null', response.data == null);
            if (response.status == true && response.data.carts != null) {
                console.log('response.data', response.data);

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

    const getShopFavorite = async () => {
        try {
            const response = await AxiosInstance().get(`/favorites/shop/${id}`)
            if (response.data.length > 0) {
                setIsFavorite(true)
            }

        } catch (error) {
            console.log('error', error);
        }
    }

    const handleShopFavorite = async () => {
        const data = {
            userId: user._id,
            shopOwnerId: id
        }
        try {
            setIsLoading(true);
            const response = isFavorite
                ? await AxiosInstance().delete('/favorites/delete', { data })
                : await AxiosInstance().post('/favorites/add', data)
            if (response.status == true) {
                ToastAndroid.show(isFavorite ? 'Đã xóa khỏi shop yêu thích' : 'Đã thêm vào shop yêu thích', ToastAndroid.SHORT)
                setIsFavorite(!isFavorite)
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAddToCart = async (item) => {
        const data = {
            user: user._id,
            shopOwner: id,
            products: item._id,
        }
        try {
            const response = await AxiosInstance().post('/carts/add', data)
            console.log('addcart', response.data);
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
    const getProductsByCategory = async () => {
        try {
            setIsLoading(true);
            const response = await AxiosInstance().get(`/products/category/${selectedCategory}`)
            // const sortedProducts = response.data.sort((a, b) => b.soldOut - a.soldOut);
            setProducts(response.data)
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoading(false);
        }
    }

    const getProductByShop = async () => {
        try {
            const response = await AxiosInstance().get(`/products/shopOwner/${id}`)
            setproductPopular(response.data)
        } catch (error) {
            console.log('error', error);
        }
    }

    const handleChangeQuantityProduct = async (item) => {
        const cartItem = cart && cart.find(cartItem => cartItem._id === item._id);
        // const quantity = cartItem && cartItem.quantity;
        setVisibleQuantity(false)
        const data = {
            user: user._id,
            shopOwner: id,
            product: item._id,
            quantity: parseInt(quantity)
        }
        setIsLoading(true);
        try {
            const response = await AxiosInstance().put('/carts/update', data)
            console.log('change', response.data);
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
        } finally {
            setIsLoading(false);
        }
    }

    const handleReduceProduct = async (item) => {
        const cartItem = cart && cart.find(cartItem => cartItem._id === item._id);
        const quantity = cartItem && cartItem.quantity;
        const data = {
            user: user._id,
            shopOwner: id,
            products: item._id,
            // quantity: quantity - 1
        }
        setIsLoading(true);
        try {
            const response = await AxiosInstance().put('/carts/delete', data)
            console.log('tru', response.data);

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
        } finally {
            setIsLoading(false);
        }
    }

    const handleShopClose = () => {
        setVisible(false)
        setVisible2(false)
        navigation.navigate('Home')
    }


    useEffect(() => {
        if (category.length > 0) {
            setSelectedCategory(category[0]._id);
        }
    }, [category]);

    useFocusEffect(
        useCallback(() => {
            if (selectedCategory) {
                getProductsByCategory();
            }
        }, [selectedCategory])
    );




    const { name, images, rating, sold, price, countReview } = shopDetail

    const isProductInCart = (productId) => {
        return cart && cart.some(item => item._id === productId);
    };

    const renderItem = ({ item }) => {
        const inCart = isProductInCart(item._id);
        const cartItem = cart && cart.find(cartItem => cartItem._id == item._id)
        const quantity = cartItem && cartItem.quantity
        return (
            <ShopAndProductComponent
                onPress={() => navigation.navigate('Product',
                    { id: item._id, inCart, shopOwnerId: id })}
                item={item}
                onPressAdd={() => handleAddToCart(item)}
                inCart={inCart}
                onPressReduce={() => handleReduceProduct(item)}
                onPressIncrease={() => handleAddToCart(item)}
                quantity={quantity} />
        )
    }

    const renderPopularFood = ({ item }) => {
        const { name, price, soldOut, images } = item
        return (
            <TouchableOpacity style={styles.containerPopularFood} onPress={() => navigation.navigate('Product', { id: item._id, shopOwnerId: id })}>
                <ImageBackground source={{ uri: images[0] }} style={styles.imgProduct}>
                    <View style={styles.viewSold}>
                        <TextComponent text={`${formatSold(soldOut)} đã bán`} color={appColor.white} fontsize={10} />
                    </View>
                </ImageBackground>
                <SpaceComponent width={15} />
                <View style={{ flex: 1 }}>
                    <TextComponent text={name} fontsize={14} ellipsizeMode={'tail'} numberOfLines={1} />
                    <SpaceComponent height={30} />
                    <RowComponent justifyContent={'space-between'}>
                        {price && <TextComponent text={`${formatPrice(price)}`} color={appColor.primary} />}
                        <ButtonComponent type={'link'} styles={styles.btnAdd} image={require('../../../assets/images/shopDetail/add.png')}
                            onPress={() => handleAddToCart(item)} />
                    </RowComponent>
                </View>
            </TouchableOpacity>
        )
    }

    const renderCategory = ({ item, index }) => {
        const { _id, name, image } = item
        return (
            <TouchableOpacity style={[{ marginRight: 40 }, index == category.length - 1 && globalStyle.itemLast]} onPress={() => setSelectedCategory(_id)}>
                <TextComponent text={name} fontsize={14} styles={_id == selectedCategory && styles.activeCategory}
                    color={_id == selectedCategory ? appColor.primary : appColor.text} />
            </TouchableOpacity >
        )
    }

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setIsLoading(true);
                await Promise.all([getShopDetail(), getCart(), getShopFavorite(), getCategoriesProduct(), getProductByShop(),]);
                setIsLoading(false);
            };
            fetchData();
        }, [])
    )

    return (
        <ContainerComponent styles={{ flex: 1, backgroundColor: appColor.white }}>
            <ContainerComponent styles={{ flex: 1, backgroundColor: appColor.white }} isScroll>
                {images && <ImageBackground style={styles.imageBackground} source={{ uri: images[0] }}>
                    <ButtonComponent
                        image={require('../../../assets/images/shopDetail/back.png')}
                        styles={styles.btnBack}
                        type={'link'}
                        onPress={() => navigation.goBack()}
                    />
                </ImageBackground>}
                <SpaceComponent height={20} />
                <ContainerComponent styles={[globalStyle.container, { paddingTop: 0 }]}>
                    <RowComponent justifyContent={'space-between'}>
                        <View>
                            <TextComponent text={name} fontsize={18} fontFamily={fontFamilies.bold}
                                numberOfLines={1} ellipsizeMode={'tail'} styles={{ paddingRight: 20 }} />
                            <SpaceComponent height={15} />
                            <RowComponent button onPress={() => navigation.navigate('ReviewShop', { item: shopDetail })}>
                                <Image source={require('../../../assets/images/shopDetail/star.png')} />
                                {rating && <TextComponent text={formatRating(rating)} fontsize={14} styles={{ marginHorizontal: 5 }} />}
                                <TextComponent text={`(${countReview} đánh giá)`} fontsize={12} color={appColor.subText} />
                            </RowComponent>
                            <SpaceComponent height={15} />
                            <RowComponent>
                                <RowComponent>
                                    <Image source={require('../../../assets/images/shopDetail/location.png')} />
                                    <SpaceComponent width={10} />
                                    <TextComponent text={formatDistance(distance)} fontsize={14} />
                                </RowComponent>
                                <SpaceComponent width={20} />
                                <RowComponent>
                                    <Image source={require('../../../assets/images/shopDetail/time.png')} />
                                    <SpaceComponent width={10} />
                                    <TextComponent text={`${time} phút`} fontsize={14} />
                                </RowComponent>
                            </RowComponent>
                        </View>
                        <ButtonComponent
                            type={'link'}
                            image={isFavorite ? require('../../../assets/images/shopDetail/favorited.png') :
                                require('../../../assets/images/shopDetail/favorite.png')}
                            onPress={handleShopFavorite}

                        />
                    </RowComponent>
                    <SpaceComponent height={20} />
                    <LineComponent />
                    <SpaceComponent height={20} />
                    <TextComponent text={'Món phổ biến'} fontsize={18} />
                    <SpaceComponent height={20} />
                    <View>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={productPopular}
                            renderItem={renderPopularFood}
                            keyExtractor={item => item._id}
                        />
                    </View>
                    <SpaceComponent height={20} />
                    <View>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            // contentContainerStyle={{width:'100%',justifyContent:'center'}}
                            data={category}
                            renderItem={renderCategory}
                            keyExtractor={item => item._id}
                        />
                    </View>
                    <SpaceComponent height={20} />
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={products}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        scrollEnabled={false}
                    />
                    <SpaceComponent height={60} />
                </ContainerComponent>
            </ContainerComponent>
            {cart && data && <RowComponent onPress={handleOpenBottomSheet}
                activeOpacity={1} button justifyContent={'space-between'} styles={styles.containerCart}>
                <View style={styles.viewCart}>
                    <View style={styles.viewQuantity}>
                        {data.totalItem && <TextComponent text={data.totalItem} color={appColor.white} fontsize={10} />}
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
                    <ButtonComponent type={'link'} text={'Xóa '} color={appColor.white} />
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
                                setQuantity('')
                            }} />
                    }
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </BottomSheet>}
            <LoadingModal visible={isLoading} />
            <AlertNoChoiceModal visible={visible}
                title={'Thông báo'}
                description={'Nhà hàng này hiện đang đóng cửa. Vui lòng chọn sản phẩm khác.'}
                noImg
                onPress={handleShopClose}
            />
            <AlertNoChoiceModal visible={visible2}
                title={'Thông báo'}
                description={'Nhà hàng này hiện ngưng hoạt động. Vui lòng chọn sản phẩm khác.'}
                noImg
                onPress={handleShopClose}
            />
            <ChangeQuantityModal visible={visibleQuantity}
                value={quantity}
                onChangeText={text => setQuantity(text)}
                title={'Số lượng'}
                onClose={() => setVisibleQuantity(false)}
                onPress={() => handleChangeQuantityProduct(currentItem)} />
        </ContainerComponent>
    )
}

export default ShopDetailScreen

const styles = StyleSheet.create({
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
    activeCategory: {
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: appColor.primary
    },
    viewSold: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: appColor.secondary,
        padding: 5,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgProduct: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    containerPopularFood: {
        width: 278,
        backgroundColor: appColor.white,
        borderRadius: 10,
        shadowColor: 'rgba(0,0,0,0.5)',
        elevation: 4,
        borderWidth: 1,
        borderColor: appColor.gray,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        marginRight: 20,
        marginBottom: 10,
    },
    btnAdd: {
        width: 25,
        height: 25,
        backgroundColor: appColor.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBackground: {
        width: '100%',
        height: 233
    },
    containerHead: {
        position: 'absolute',
        top: 50,
        left: 24,
        right: 24,
        zIndex: 1,
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

var POPULARFOOD = [
    {
        id: 1,
        name: 'Berry Toast',
        price: 40,
        sold: 999,
        images: ['https://mcdonalds.vn/uploads/2018/food/burgers/xbigmac_bb.png.pagespeed.ic.t-4L-nzxfN.webp'],
        oldPrice: 50
    },
    {
        id: 2,
        name: 'Berry Toast',
        price: 40,
        sold: 1040,
        images: ['https://mcdonalds.vn/uploads/2018/food/burgers/xbigmac_bb.png.pagespeed.ic.t-4L-nzxfN.webp'],
        oldPrice: 50
    },

    {
        id: 3,
        name: 'Berry Toast',
        price: 40,
        sold: 1755,
        images: ['https://mcdonalds.vn/uploads/2018/food/burgers/xbigmac_bb.png.pagespeed.ic.t-4L-nzxfN.webp'],
        oldPrice: 50
    },

]
