import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import { globalStyle } from '../../../styles/globalStyle'
import SpaceComponent from '../../../components/SpaceComponent'
import TextComponent from '../../../components/TextComponent'
import ButtonComponent from '../../../components/ButtonComponent'
import { appColor } from '../../../constants/appColor'
import RowComponent from '../../../components/RowComponent'

const FailedPaymentScreen = ({ navigation, route }) => {
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
      <RowComponent justifyContent={'space-between'} width={'100%'}>
        <ButtonComponent width={'45%'} text={'Xem đơn hàng'} onPress={() => navigation.navigate('Order')}
          color={appColor.white} fontsize={14} />
        <ButtonComponent width={'45%'} text={'Tiếp tục mua sắm'} onPress={() => navigation.navigate('Home')}
          color={appColor.text} backgroundColor={appColor.white} fontsize={14} />
      </RowComponent>
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