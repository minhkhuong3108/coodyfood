import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

const ShopDetailScreen = ({ navigation, route }) => {
    const { id } = route.params
    const { user } = useSelector(state => state.login)
    const [popularFood, setPopularFood] = useState(POPULARFOOD)
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [data, setData] = useState()
    const [cart, setCart] = useState()
    const [isLoading, setIsLoading] = useState(false)

    // console.log('selectedCategory', selectedCategory);

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

    const [shopDetail, setShopDetail] = useState({})

    const getShopDetail = async () => {
        try {
            const response = await AxiosInstance().get(`/shopOwner/${id}`)
            setShopDetail(response.data)
        } catch (error) {
            console.log('error', error);
        }
    }

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
            console.log('getcart', response);
            // console.log('response.data == null', response.data == null);
            if (response.status == true && response.data != null) {
                setData(response.data)
                const product = response.data.products
                setCart(product)
            }
            if (response.status == true && response.data == null) {
                setData(null)
                setCart(null)
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
            console.log('response', response);
            if (response.status == true) {
                getCart()
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    const getProducts = async () => {
        try {
            const response = await AxiosInstance().get(`/products/category/${selectedCategory}`)
            setProducts(response.data)
        } catch (error) {
            console.log('error', error);
        }
    }

    const handleIncreaseProduct = async (item) => {
        const cartItem = cart && cart.find(cartItem => cartItem._id === item._id);
        const quantity = cartItem && cartItem.quantity;
        const data = {
            user: user._id,
            shopOwner: id,
            product: item._id,
            quantity: quantity + 1
        }
        setIsLoading(true);
        try {
            const response = await AxiosInstance().put('/carts/update', data)
            if (response.status == true) {
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
            product: item._id,
            // quantity: quantity - 1
        }
        setIsLoading(true);
        try {
            const response = await AxiosInstance().put('/carts/delete', data)
            if (response.status == true) {
                getCart()
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getShopDetail()
        getCart()
    }, [])

    useEffect(() => {
        if (shopDetail) {
            getCategoriesProduct()
        }
    }, [shopDetail])

    useEffect(() => {
        if (category.length > 0) {
            setSelectedCategory(category[0]._id);
            getProducts()
        }
    }, [category]);

    const { name, images, rating, distance, time, sold, price, oldPrice } = shopDetail

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
                onPressIncrease={() => handleIncreaseProduct(item)}
                quantity={quantity} />
        )
    }

    const renderPopularFood = ({ item }) => {
        const { name, price, sold, images } = item
        return (
            <TouchableOpacity style={styles.containerPopularFood} onPress={() => navigation.navigate('Product')}>
                <ImageBackground source={{ uri: images[0] }} style={styles.imgProduct}>
                    <View style={styles.viewSold}>
                        <TextComponent text={`${formatSold(sold)} đã bán`} color={appColor.white} fontsize={10} />
                    </View>
                </ImageBackground>
                <SpaceComponent width={15} />
                <View style={{ flex: 1 }}>
                    <TextComponent text={name} />
                    <SpaceComponent height={30} />
                    <RowComponent justifyContent={'space-between'}>
                        <TextComponent text={`${price}.000đ`} color={appColor.primary} />
                        <ButtonComponent type={'link'} styles={styles.btnAdd} image={require('../../../assets/images/shopDetail/add.png')} />
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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([getShopDetail(), getCart(), getCategoriesProduct(), getProducts()]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <ContainerComponent styles={{ flex: 1, backgroundColor: appColor.white }}>
            <ContainerComponent styles={{ flex: 1, backgroundColor: appColor.white }} isScroll>
                {images && <ImageBackground style={styles.imageBackground} source={{ uri: images[0] }}>
                    <RowComponent justifyContent={'space-between'} styles={styles.containerHead}>
                        <ButtonComponent
                            image={require('../../../assets/images/shopDetail/back.png')}
                            styles={styles.btnBack}
                            type={'link'}
                            onPress={() => navigation.goBack()}
                        />
                        <ButtonComponent
                            image={require('../../../assets/images/shopDetail/search.png')}
                            styles={styles.btnBack}
                            type={'link'}
                        />

                    </RowComponent>
                </ImageBackground>}
                <SpaceComponent height={20} />
                <ContainerComponent styles={[globalStyle.container, { paddingTop: 0 }]}>
                    <RowComponent justifyContent={'space-between'}>
                        <View>
                            <TextComponent text={name} fontsize={18} fontFamily={fontFamilies.bold} />
                            <SpaceComponent height={15} />
                            <RowComponent>
                                <Image source={require('../../../assets/images/shopDetail/star.png')} />
                                {rating && <TextComponent text={formatRating(rating)} fontsize={14} styles={{ marginHorizontal: 5 }} />}
                                <TextComponent text={'(99+ đánh giá)'} fontsize={12} color={appColor.subText} />
                            </RowComponent>
                            <SpaceComponent height={15} />
                            <RowComponent>
                                <RowComponent>
                                    <Image source={require('../../../assets/images/shopDetail/location.png')} />
                                    <SpaceComponent width={10} />
                                    <TextComponent text={`4.6 km`} fontsize={14} />
                                </RowComponent>
                                <SpaceComponent width={20} />
                                <RowComponent>
                                    <Image source={require('../../../assets/images/shopDetail/time.png')} />
                                    <SpaceComponent width={10} />
                                    <TextComponent text={`30 phút`} fontsize={14} />
                                </RowComponent>
                            </RowComponent>
                        </View>
                        <ButtonComponent
                            type={'link'}
                            image={require('../../../assets/images/shopDetail/no-favor.png')}
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
                            data={popularFood}
                            renderItem={renderPopularFood}
                            keyExtractor={item => item.id}
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
            {cart && <RowComponent onPress={handleOpenBottomSheet}
                activeOpacity={1} button justifyContent={'space-between'} styles={styles.containerCart}>
                <View style={styles.viewCart}>
                    <View style={styles.viewQuantity}>
                        <TextComponent text={data.totalItem} color={appColor.white} fontsize={10} />
                    </View>
                    <Image source={require('../../../assets/images/cart/cart.png')} />
                </View>
                <RowComponent>
                    <TextComponent text={data.totalPrice} />
                    <SpaceComponent width={10} />
                    <ButtonComponent text={'Giao hàng'} color={appColor.white} height={70} width={150} borderRadius={0}
                        onPress={() => navigation.navigate('CheckOut', { data })} />
                </RowComponent>
            </RowComponent>}
            <BottomSheet
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
                            onPressIncrease={() => handleIncreaseProduct(item)}
                            onPressReduce={() => handleReduceProduct(item)} />}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </BottomSheet>
            <LoadingModal visible={isLoading} />
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
