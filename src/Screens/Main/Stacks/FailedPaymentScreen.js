import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import { globalStyle } from '../../../styles/globalStyle'
import SpaceComponent from '../../../components/SpaceComponent'
import TextComponent from '../../../components/TextComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { appColor } from '../../../constants/appColor'

const FailedPaymentScreen = ({navigation}) => {
  return (
    <ContainerComponent styles={[globalStyle.container, styles.container]} >
      <Image source={require('../../../assets/images/payment/failed.png')} />
      <SpaceComponent height={30} />
      <TextComponent text={'Thanh toán thất bại'} fontsize={25} />
      <SpaceComponent height={10} />
      <TextComponent
        text={'Vui lòng kiểm tra lại thông tin và thử lại.'} textAlign={'center'}
        fontsize={16} color={appColor.subText} />
      <SpaceComponent height={40} />
      <ButtonComponent text={'Quay lại trang chủ'} onPress={() => navigation.navigate('Home')} color={appColor.white} />
    </ContainerComponent>
  )
}

export default FailedPaymentScreen

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})