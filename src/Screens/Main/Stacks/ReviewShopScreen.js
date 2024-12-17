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
import { formatRating } from '../../../components/format/FormatRate'


const ReviewShopScreen = ({ navigation, route }) => {
    const { item } = route.params

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [count5, setCount5] = useState(0)
    const [count4, setCount4] = useState(0)
    const [count3, setCount3] = useState(0)
    const [count2, setCount2] = useState(0)
    const [count1, setCount1] = useState(0)



    const getReviewShop = async () => {
        try {
            setIsLoading(true)
            const respnse = await AxiosInstance().get(`/productReviews/shop/${item._id}`)
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

    useEffect(() => {
        if (data.length > 0) {
            let count5 = 0, count4 = 0, count3 = 0, count2 = 0, count1 = 0;
            data.forEach(review => {
                switch (review.rating) {
                    case 5:
                        count5++;
                        break;
                    case 4:
                        count4++;
                        break;
                    case 3:
                        count3++;
                        break;
                    case 2:
                        count2++;
                        break;
                    case 1:
                        count1++;
                        break;
                    default:
                        break;
                }
            });
            setCount5(count5);
            setCount4(count4);
            setCount3(count3);
            setCount2(count2);
            setCount1(count1);
        }
    }, [data]);

    return (
        <ContainerComponent isScroll styles={globalStyle.container}>
            <HeaderComponent isback={true} text={'Đánh giá cửa hàng'} />
            <RowComponent styles={[styles.containerRate, globalStyle.shawdow]} justifyContent={'space-between'}>
                <View >
                    <RowComponent>
                        <TextComponent text={`${formatRating(item.rating)}`} fontsize={30} />
                        <SpaceComponent width={7} />
                        <Image source={require('../../../assets/images/rateShop/starLarge.png')} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <TextComponent text={item.countReview + ' Đánh giá'} fontsize={12} color={appColor.subText} />
                </View>
                <View>
                    <RowComponent>
                        <TextComponent text={5} color={appColor.subText} width={10} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`${count5} đánh giá`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <RowComponent>
                        <TextComponent text={4} color={appColor.subText} width={10} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`${count4} đánh giá`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <RowComponent>
                        <TextComponent text={3} color={appColor.subText} width={10} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`${count3} đánh giá`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <RowComponent>
                        <TextComponent text={2} color={appColor.subText} width={10} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`${count2} đánh giá`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                    <SpaceComponent height={5} />
                    <RowComponent>
                        <TextComponent text={1} color={appColor.subText} width={10} />
                        <SpaceComponent width={5} />
                        <Image source={require('../../../assets/images/rateShop/starSmall.png')} />
                        <SpaceComponent width={5} />
                        <TextComponent text={`${count1} đánh giá`} color={appColor.subText} fontsize={12} />
                    </RowComponent>
                </View>
            </RowComponent>
            <SpaceComponent height={30} />
            <LineComponent />
            <SpaceComponent height={20} />
            <TextComponent text={'Đánh giá'} fontsize={18} fontFamily={fontFamilies.bold} />
            <SpaceComponent height={20} />
            {data.length > 0 ? <FlatList
                scrollEnabled={false}
                data={data}
                renderItem={({ item }) => <ReviewList item={item} />}
                keyExtractor={item => item._id}
            /> :
                <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent text={'Chưa có đánh giá nào'} color={appColor.subText}/>
                </View>

            }
            <SpaceComponent height={60} />
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
