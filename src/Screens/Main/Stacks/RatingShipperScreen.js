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

const RatingScreen = ({ navigation, route }) => {
    const { order_id } = route.params
    const { user } = useSelector(state => state.login)
    console.log('order_id', order_id);
    console.log('user', user._id);



    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const handleAddRating = async () => {
        const data = {
            order_id,
            user_id: user._id,
            rating: ratingShop,
            comment: commentShop,
            image: 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fdelivery-system-v2%2F03-04-2022-Image%2F10000010_2.jpg&w=1920&q=75'
        }
        try {
            const response = await AxiosInstance().post('/productReviews/add', data)
            if (response.data) {
                ToastAndroid.show('Đánh giá thành công', ToastAndroid.SHORT)
                navigation.navigate('Home')
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ContainerComponent styles={[globalStyle.container]} isScroll>
            <HeaderComponent text={'Đánh giá'} isback />
            <View style={styles.container}>
                <Image source={require('../../../assets/images/home/avatar.png')} style={styles.img} />
                <SpaceComponent height={20} />
                <TextComponent text={'Nguyễn Văn A'} fontsize={20} />
                <SpaceComponent height={10} />
                <TextComponent text={'Tài xế'} fontsize={15} color={appColor.subText} />
                <SpaceComponent height={10} />
                <RowComponent>
                    <Image source={require('../../../assets/images/rating/success.png')} style={styles.imgSuccess} />
                    <SpaceComponent width={10} />
                    <TextComponent text={'Đơn hàng đã hoàn tất'} color={appColor.green} />
                </RowComponent>
                <SpaceComponent height={30} />
                <TextComponent text={'Mời bạn đánh giá tài xế'} fontsize={18} />
                <SpaceComponent height={20} />
                <Rating
                    ratingCount={5}
                    startingValue={0}
                    imageSize={30}
                    onFinishRating={rating => setRatingShipper(rating)}
                />
                <SpaceComponent height={20} />
                {/* <View style={{ width: '100%' }}>
                    <TextInput value={commentShipper}
                        onChangeText={text => setCommentShipper(text)} placeholder={'Nhập bình luận'}
                        style={styles.input} textAlignVertical='top' multiline />
                    <ButtonComponent image={require('../../../assets/images/rating/camera.png')} type={'link'} styles={styles.btnCamera} />
                </View> */}
            </View>
            <SpaceComponent height={50} />
            <View style={styles.container}>
                <Image source={require('../../../assets/images/home/avatar.png')} style={styles.img} />
                <SpaceComponent height={20} />
                <TextComponent text={'Nguyễn Văn A'} fontsize={20} />
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
        </ContainerComponent>
    )
}

export default RatingScreen

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