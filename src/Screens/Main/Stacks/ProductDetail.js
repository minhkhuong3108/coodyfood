import { FlatList, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
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

const ProductDetail = ({ navigation }) => {
    const [rate, setRate] = useState(RATE)

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
            <SpaceComponent height={15} />
            <ContainerComponent styles={[globalStyle.container, { paddingTop: 0 }]}>
                <TextComponent text={'Product Detail'} fontsize={18} />
                <SpaceComponent height={15} />
                <TextComponent text={'400 đã bán | 10 đánh giá'} fontsize={12} color={appColor.subText} />
                <SpaceComponent height={15} />
                <RowComponent justifyContent={'space-between'}>
                    <TextComponent text={'40.000đ'} />
                    <ButtonComponent type={'link'}
                        image={require('../../../assets/images/shopDetail/add.png')}
                        styles={styles.btnAdd}
                    />
                </RowComponent>
                <SpaceComponent height={20} />
                <LineComponent />
                <SpaceComponent height={20} />
                <TextComponent text={'Đánh giá'} fontsize={18} fontFamily={fontFamilies.bold} />
                <SpaceComponent height={20} />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    data={rate}
                    renderItem={({ item }) => <ReviewList item={item} />}
                    keyExtractor={item => item.id}
                />
            </ContainerComponent>
        </ContainerComponent>
    )
}

export default ProductDetail

const styles = StyleSheet.create({
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