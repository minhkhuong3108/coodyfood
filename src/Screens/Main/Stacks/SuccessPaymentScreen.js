import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import TextComponent from '../../../components/TextComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { globalStyle } from '../../../styles/globalStyle'
import { appColor } from '../../../constants/appColor'
import AxiosInstance from '../../../helpers/AxiosInstance'

const SuccessPaymentScreen = ({ navigation, route }) => {
    const { orderId, paymentMethod } = route.params
    console.log('paymentMethod', paymentMethod);
    console.log('orderId', orderId);



    const updateOrder = async () => {
        try {
            await AxiosInstance().put(`/orders/Success-Payment/${orderId}`)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (paymentMethod == 'PayOS') {
            updateOrder()
        }
    }, [])
    return (
        <ContainerComponent styles={[globalStyle.container, styles.container]} >
            <Image source={require('../../../assets/images/payment/success.png')} />
            <SpaceComponent height={30} />
            <TextComponent text={'Thanh toán thành công'} fontsize={25} />
            <SpaceComponent height={10} />
            <TextComponent
                text={'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. \n Chúc bạn 1 ngày tốt lành!'} textAlign={'center'}
                fontsize={16} color={appColor.subText} />
            <SpaceComponent height={40} />
            <ButtonComponent text={'Quay lại trang chủ'} onPress={() => navigation.navigate('Home')} color={appColor.white} />
        </ContainerComponent>
    )
}

export default SuccessPaymentScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})