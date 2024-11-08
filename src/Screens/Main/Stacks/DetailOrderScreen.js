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
import { formatDate } from '../../../components/format/FormatDate'

const DetailOrderScreen = ({ navigation, route }) => {
  const { item } = route.params
  const products = item.items
  const shop = item.shopOwner
  const user = item.user
  const address = item.shippingAddress
  const status = item.status
  console.log('item', item);

  // const [products, setProducts] = useState(PRODUCTS)
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
      <ShopAndProductComponent type={'shop'} item={shop && shop} order />
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
            <TextComponent width={280} text={shop.address}
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
            <TextComponent width={280} text={address.address}
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
        products && products.map((item, index) => (
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
        <TextComponent text={user.name} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'SĐT người nhận'} fontsize={14} />
        <TextComponent text={user.phone} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'Thời gian đặt hàng'} fontsize={14} />
        <TextComponent text={formatDate(item.orderDate)} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'Mã đơn hàng'} fontsize={14} />
        <TextComponent text={item._id} fontsize={14} />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent justifyContent={'space-between'} >
        <TextComponent text={'Tạm tính'} fontsize={14} />
        <TextComponent text={formatPrice(item.totalPrice)} fontsize={14} />
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
        <ButtonComponent
          text={status == 'Đã đánh giá đơn hàng' ? 'Đã đánh giá' :
            status == 'Đơn hàng đã được giao hoàn tất' ? 'Đánh giá' : 'Đã hủy'}
          backgroundColor={appColor.white}
          width={'48%'} height={51} borderColor={appColor.white}
          color={status == 'Đơn hàng đã được giao hoàn tất' ? appColor.text : appColor.subText}
          onPress={() => navigation.navigate('Rating', { order_id: item._id })}
          disabled={status == 'Đơn hàng đã được giao hoàn tất' ? false : true}
          styles={status == 'Đơn hàng đã được giao hoàn tất' ? null : styles.btnDisabled} />
        <ButtonComponent text={'Đặt lại'} color={appColor.white} width={'48%'} height={51}
          onPress={() => navigation.navigate('CheckOut', { data: item })} />
      </RowComponent>
      <SpaceComponent height={70} />
    </ContainerComponent>
  )
}

export default DetailOrderScreen

const styles = StyleSheet.create({
  btnDisabled: {
    opacity: 0.8,
    // backgroundColor: appColor.opacity,
  },
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