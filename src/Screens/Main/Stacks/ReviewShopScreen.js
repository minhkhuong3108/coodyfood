import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import LineComponent from '../../../components/LineComponent'
import { globalStyle } from '../../../styles/globalStyle'
import { appColor } from '../../../constants/appColor'
import { fontFamilies } from '../../../constants/fontFamilies'
import ReviewList from '../../../components/ReviewList'
import AxiosInstance from '../../../helpers/AxiosInstance'
import LoadingModal from '../../../modal/LoadingModal'


const ReviewShopScreen = ({ navigation, route }) => {
    const { id } = route.params

    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const getReviewShop = async () => {
        try {
            setIsLoading(true)
            const respnse = await AxiosInstance().get(`/productReviews/shop/${id}`)
            console.log('respnse', respnse.data);
            setData(respnse.data)
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getReviewShop()
    }, [])

    return (
        <ContainerComponent isScroll styles={globalStyle.container}>
            <HeaderComponent isback={true} text={'Đánh giá cửa hàng'} />
            <RowComponent styles={[styles.containerRate, globalStyle.shawdow]} justifyContent={'space-between'}>
                <View >
                    <RowComponent>
                        <TextComponent text={'4.5'} fontsize={30} />
                        <SpaceComponent width={7} />
                        <Image source={require('../../../assets/images/rateShop/starLarge.png')} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <TextComponent text={10 + ' Đánh giá'} fontsize={12} color={appColor.subText} />
                </View>
                <View>
                    <RowComponent>
                        <TextComponent text={5} color={appColor.subText} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`(5 đánh giá)`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <RowComponent>
                        <TextComponent text={5} color={appColor.subText} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`(5 đánh giá)`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <RowComponent>
                        <TextComponent text={5} color={appColor.subText} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`(5 đánh giá)`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <RowComponent>
                        <TextComponent text={5} color={appColor.subText} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`(5 đánh giá)`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <RowComponent>
                        <TextComponent text={5} color={appColor.subText} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`(5 đánh giá)`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                </View>
            </RowComponent>
            <SpaceComponent height={30} />
            <LineComponent />
            <SpaceComponent height={20} />
            <TextComponent text={'Đánh giá'} fontsize={18} fontFamily={fontFamilies.bold} />
            <SpaceComponent height={20} />
            <FlatList
                scrollEnabled={false}
                data={data}
                renderItem={({ item }) => <ReviewList item={item} />}
                keyExtractor={item => item._id}
            />
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    )
}

export default ReviewShopScreen

const styles = StyleSheet.create({
    containerRate: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 20
    }
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