import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import SpaceComponent from '../../../components/SpaceComponent'
import TextComponent from '../../../components/TextComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { globalStyle } from '../../../styles/globalStyle'
import { appColor } from '../../../constants/appColor'

const SuccessPaymentScreen = ({ navigation }) => {
    return (
        <ContainerComponent styles={[globalStyle.container, styles.container]} >
            <Image source={require('../../../assets/images/payment/success.png')} />
            <SpaceComponent height={30} />
            <TextComponent text={'Thanh toán thành công'} fontsize={25} />
            <SpaceComponent height={30} />
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