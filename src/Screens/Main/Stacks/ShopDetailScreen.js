import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { act, useState } from 'react'
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

const ShopDetailScreen = ({ navigation }) => {
    const [popularFood, setPopularFood] = useState(POPULARFOOD)
    const [category, setCategory] = useState(CATEGORY)
    const [selectedCategory, setSelectedCategory] = useState(category[0]._id)

    const formatSold = (sold) => {
        if (sold < 1000) return sold.toString();
        if (sold < 1000000) return (sold / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return (sold / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    };

    const renderPopularFood = ({ item }) => {
        const { name, price, sold, image } = item
        return (
            <TouchableOpacity style={styles.containerPopularFood} onPress={() => navigation.navigate('Product')}>
                <ImageBackground source={image} style={styles.imgProduct}>
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
            <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setSelectedCategory(_id)}>
                <TextComponent text={name} fontsize={14} styles={_id == selectedCategory && styles.activeCategory}
                    color={_id == selectedCategory ? appColor.primary : appColor.text} />
            </TouchableOpacity>
        )
    }
    return (
        <ContainerComponent styles={{ flex: 1, backgroundColor: appColor.white }} isScroll>
            <ImageBackground style={styles.imageBackground} source={require('../../../assets/images/shopDetail/p1.png')}>
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
            </ImageBackground>
            <SpaceComponent height={20} />
            <ContainerComponent styles={[globalStyle.container, { paddingTop: 0 }]}>
                <RowComponent justifyContent={'space-between'}>
                    <View>
                        <TextComponent text={'Nhà hàng'} fontsize={18} fontFamily={fontFamilies.bold} />
                        <SpaceComponent height={15} />
                        <RowComponent>
                            <Image source={require('../../../assets/images/shopDetail/star.png')} />
                            <TextComponent text={'4.5'} fontsize={14} styles={{ marginHorizontal: 5 }} />
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
                        data={category}
                        renderItem={renderCategory}
                        keyExtractor={item => item._id}
                    />
                </View>
                <SpaceComponent height={20} />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={popularFood}
                    renderItem={({ item }) => <ShopAndProductComponent item={item} />}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                />
            </ContainerComponent>
        </ContainerComponent>
    )
}

export default ShopDetailScreen

const styles = StyleSheet.create({
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
        image: require('../../../assets/images/shopDetail/p2.png'),
        oldPrice: 50
    },
    {
        id: 2,
        name: 'Berry Toast',
        price: 40,
        sold: 1040,
        image: require('../../../assets/images/shopDetail/p2.png'),
        oldPrice: 50
    },
    {
        id: 3,
        name: 'Berry Toast',
        price: 40,
        sold: 1755,
        image: require('../../../assets/images/shopDetail/p2.png'),
        oldPrice: 50
    },
]

var CATEGORY = [
    {
        _id: 1,
        name: 'Tất cả',
    },
    {
        _id: 2,
        name: 'Món chính',
    },
    {
        _id: 3,
        name: 'Món phụ',
    },
    {
        _id: 4,
        name: 'Đồ uống',
    }
]