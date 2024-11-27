import { Image, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import { globalStyle } from '../../../styles/globalStyle'
import HeaderComponent from '../../../components/HeaderComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import TextComponent from '../../../components/TextComponent'
import { appColor } from '../../../constants/appColor'
import RowComponent from '../../../components/RowComponent'
import { Rating } from 'react-native-ratings'
import ButtonComponent from '../../../components/ButtonComponent'
import { useSelector } from 'react-redux'
import AxiosInstance from '../../../helpers/AxiosInstance'
import LoadingModal from '../../../modal/LoadingModal'
import LineComponent from '../../../components/LineComponent'

const RatingShopScreen = ({ navigation, route }) => {
    const { item } = route.params
    const { user } = useSelector(state => state.login)
    const shopOwner = item.shopOwner
    const shipper = item.shipper
    const [isLoading, setIsLoading] = useState(false)
    console.log('user', user._id);



    const [ratingShop, setRatingShop] = useState(0)
    const [ratingShipper, setRatingShipper] = useState(0)
    const [commentShop, setCommentShop] = useState('')

    const handleAddRating = async () => {
        if (ratingShop == 0 || ratingShipper == 0) {
            ToastAndroid.show('Vui lòng đánh giá', ToastAndroid.SHORT)
            return
        }
        const dataShop = {
            order_id: item._id,
            user_id: user._id,
            rating: ratingShop,
            comment: commentShop,
            image: 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fdelivery-system-v2%2F03-04-2022-Image%2F10000010_2.jpg&w=1920&q=75'
        }
        const dataShipper = {
            order_id: item._id,
            user_id: user._id,
            shipper_id: shipper._id,
            rating: ratingShipper,
            comment: '',
            image: 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fdelivery-system-v2%2F03-04-2022-Image%2F10000010_2.jpg&w=1920&q=75'
        }
        try {
            setIsLoading(true)
            const [responseShipper, responseShop] = await Promise.all([
                AxiosInstance().post('/shipperReview/add', dataShipper),
                AxiosInstance().post('/productReviews/add', dataShop)
            ]);

            if (responseShipper.data && responseShop.data) {
                ToastAndroid.show('Đánh giá thành công', ToastAndroid.SHORT);
                navigation.navigate('Home');
            }
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Có lỗi xảy ra, vui lòng thử lại', ToastAndroid.SHORT);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ContainerComponent styles={[globalStyle.container]} isScroll>
            <HeaderComponent text={'Đánh giá'} isback />
            <View style={styles.container}>
                <Image source={{ uri: shipper.image[0] }} style={styles.img} />
                <SpaceComponent height={20} />
                <TextComponent text={shipper.name} fontsize={20} />
                <SpaceComponent height={10} />
                <TextComponent text={'Shipper'} fontsize={15} color={appColor.subText} />
                <SpaceComponent height={10} />
                <RowComponent>
                    <Image source={require('../../../assets/images/rating/success.png')} style={styles.imgSuccess} />
                    <SpaceComponent width={10} />
                    <TextComponent text={'Đơn hàng đã hoàn tất'} color={appColor.green} />
                </RowComponent>
                <SpaceComponent height={20} />
                <TextComponent text={'Mời bạn đánh giá shipper'} fontsize={18} />
                <SpaceComponent height={20} />
                <Rating
                    ratingCount={5}
                    startingValue={0}
                    imageSize={30}
                    onFinishRating={rating => setRatingShipper(rating)}
                />
            </View>
            <SpaceComponent height={40} />
            <LineComponent />
            <SpaceComponent height={40} />
            <View style={styles.container}>
                <Image source={{ uri: shopOwner.images[0] }} style={styles.img} />
                <SpaceComponent height={20} />
                <TextComponent text={shopOwner.name} fontsize={20} />
                <SpaceComponent height={10} />
                <TextComponent text={'Nhà hàng'} fontsize={15} color={appColor.subText} />
                <SpaceComponent height={10} />
                <RowComponent>
                    <Image source={require('../../../assets/images/rating/success.png')} style={styles.imgSuccess} />
                    <SpaceComponent width={10} />
                    <TextComponent text={'Đơn hàng đã hoàn tất'} color={appColor.green} />
                </RowComponent>
                <SpaceComponent height={30} />
                <TextComponent text={'Mời bạn đánh giá nhà hàng'} fontsize={18} />
                <SpaceComponent height={20} />
                <Rating
                    ratingCount={5}
                    startingValue={0}
                    imageSize={30}
                    onFinishRating={rating => setRatingShop(rating)}
                />
                <SpaceComponent height={20} />
                <View style={{ width: '100%' }}>
                    <TextInput value={commentShop}
                        onChangeText={text => setCommentShop(text)} placeholder={'Nhập bình luận'}
                        style={styles.input} textAlignVertical='top' multiline />
                    <ButtonComponent image={require('../../../assets/images/rating/camera.png')} type={'link'} styles={styles.btnCamera} />
                </View>
            </View>
            <SpaceComponent height={20} />
            <ButtonComponent text={'Gửi đánh giá'} color={appColor.white} onPress={handleAddRating} />
            <SpaceComponent height={70} />
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    )
}

export default RatingShopScreen

const styles = StyleSheet.create({
    btnCamera: {
        position: 'absolute',
        right: 10,
        bottom: 10
    },
    input: {
        height: 150,
        width: '100%',
        borderColor: appColor.gray,
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 16,
    },
    imgSuccess: {
        width: 20,
        height: 20
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    container: {
        flex: 1,
        alignItems: 'center'
    }
})