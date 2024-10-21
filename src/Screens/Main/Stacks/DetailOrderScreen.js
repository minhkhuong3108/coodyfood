import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContainerComponent from '../../../components/ContainerComponent'
import HeaderComponent from '../../../components/HeaderComponent'
import ShopAndProductComponent from '../../../components/ShopAndProductComponent'
import { globalStyle } from '../../../styles/globalStyle'
import SpaceComponent from '../../../components/SpaceComponent'
import LineComponent from '../../../components/LineComponent'
import RowComponent from '../../../components/RowComponent'
import TextComponent from '../../../components/TextComponent'
import { appColor } from '../../../constants/appColor'
import { fontFamilies } from '../../../constants/fontFamilies'
import { formatPrice } from '../../../components/format/FomatPrice'
import ButtonComponent from '../../../components/ButtonComponent'

const DetailOrderScreen = () => {
  const item = ITEM
  const [products, setProducts] = useState(PRODUCTS)
  const [payment, setPayment] = useState('')
  const [images, setImages] = useState('')
  const handlePayment = () => {
    if (payment == 'zaloPay') {
      setImages(require('../../../assets/images/checkout/zalo.png'))
    }
    else if (payment == 'payos') {
      setImages(require('../../../assets/images/checkout/payos.png'))
    }
    else {
      setImages(require('../../../assets/images/checkout/cash.png'))
    }
  }
  useEffect(() => {
    handlePayment()
  }, [payment])
  return (
    <ContainerComponent styles={globalStyle.container} isScroll>
      <HeaderComponent text={'Đơn hàng chi tiết'} isback />
      <ShopAndProductComponent type={'shop'} item={item} order />
      <SpaceComponent height={10} />
      <LineComponent />
      <SpaceComponent height={25} />
      <View style={[styles.viewAddress, globalStyle.shawdow]}>
        <RowComponent>
          <Image source={require('../../../assets/images/checkOrder/shop.png')} />
          <SpaceComponent width={15} />
          <View>
            <TextComponent text={'Địa chỉ nhà hàng'} fontFamily={fontFamilies.bold} />
            <SpaceComponent height={5} />
            <TextComponent width={280} text={'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam '}
              fontsize={12} color={appColor.subText} />
          </View>
        </RowComponent>
        <SpaceComponent height={10} />
        <RowComponent>
          <Image source={require('../../../assets/images/checkOrder/home.png')} />
          <SpaceComponent width={15} />
          <View>
            <TextComponent text={'Địa chỉ đặt hàng'} fontFamily={fontFamilies.bold} />
            <SpaceComponent height={5} />
            <TextComponent width={280} text={'86 Đường Số 8, Phường 10, Gò Vấp, Thành phố Hồ Chí Minh '}
              fontsize={12} color={appColor.subText} />
          </View>
        </RowComponent>
      </View>
      <SpaceComponent height={25} />
      <LineComponent />
      <SpaceComponent height={20} />
      <TextComponent text={'Tóm tắt đơn hàng'} fontsize={14} fontFamily={fontFamilies.bold} />
      <SpaceComponent height={15} />
      {
        products.map((item, index) => (
          <RowComponent key={item._id}
            justifyContent={'space-between'} styles={{ marginBottom: 10 }}>
            <RowComponent>
              <TextComponent text={`${item.quantity}x`} fontsize={14} width={30} />
              <SpaceComponent width={40} />
              <TextComponent text={item.name} />
            </RowComponent>
            <TextComponent text={`${formatPrice(item.price)}`} fontsize={14} />
          </RowComponent>
        ))
      }
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'Tên ngưởi nhận'} fontsize={14} />
        <TextComponent text={'Nguyễn Văn A'} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'SĐT người nhận'} fontsize={14} />
        <TextComponent text={'0123456789'} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'Thời gian đặt hàng'} fontsize={14} />
        <TextComponent text={'11/2/2024'} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'Mã đơn hàng'} fontsize={14} />
        <TextComponent text={'123123121'} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'Tạm tính'} fontsize={14} />
        <TextComponent text={'200.000đ'} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'Phí giao hàng'} fontsize={14} />
        <TextComponent text={'20.000đ'} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <LineComponent />
      <SpaceComponent height={15} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'Tổng cộng'} fontsize={14} fontFamily={fontFamilies.bold} />
        <RowComponent>
          {images && <Image source={images} />}
          <SpaceComponent width={10} />
          <TextComponent text={'220.000đ'} fontsize={14} fontFamily={fontFamilies.bold} />
        </RowComponent>
      </RowComponent>
      <SpaceComponent height={20} />
      <RowComponent justifyContent={'space-between'}>
        <ButtonComponent text={'Đánh giá'} backgroundColor={appColor.white} width={'48%'} height={51} borderColor={appColor.white}/>
        <ButtonComponent text={'Đặt lại'} color={appColor.white} width={'48%'} height={51} />
      </RowComponent>
      <SpaceComponent height={70} />
    </ContainerComponent>
  )
}

export default DetailOrderScreen

const styles = StyleSheet.create({
  viewAddress: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: appColor.white
  },
})

var PRODUCTS = [
  {
    _id: 1,
    name: 'Product 1',
    price: 100,
    quantity: 1,
  },
  {
    _id: 2,
    name: 'Product 2',
    price: 200,
    quantity: 2,
  }
]

var ITEM = {
  _id: 1,
  name: 'Shop 1',
  address: '123 Phạm Văn Đồng, Thủ Đức, Hồ Chí Minh',
  phone: '0123456789',
  rating: 4,
  images: ['https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fdelivery-system-v2%2F03-04-2022-Image%2F20100005_2.jpg&w=1920&q=75'],
}