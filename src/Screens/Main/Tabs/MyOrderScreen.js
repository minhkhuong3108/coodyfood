import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

import TextComponent from '../../../components/TextComponent';
import Header from '../../../components/HeaderComponent';
import ContainerComponent from '../../../components/ContainerComponent';
import { appColor } from '../../../constants/appColor';
import { appInfor } from '../../../constants/appInfor';
import { fontFamilies } from '../../../constants/fontFamilies';
import ButtonComponent from '../../../components/ButtonComponent';
import OrderComponent from '../../../components/MyOrder/OrderComponent';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import HeaderComponent from '../../../components/HeaderComponent';
import { globalStyle } from '../../../styles/globalStyle';
import RowComponent from '../../../components/RowComponent';
import SpaceComponent from '../../../components/SpaceComponent';
import AxiosInstance from '../../../helpers/AxiosInstance';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { formatDate } from '../../../components/format/FormatDate';
import LoadingModal from '../../../modal/LoadingModal';
import { Dropdown } from 'react-native-element-dropdown'
import LineComponent from '../../../components/LineComponent';
import { formatPrice } from '../../../components/format/FomatPrice';
import { getSocket } from '../../../socket/socket';
import { CallConfig } from '../../Call/Callconfig';

const MyOrderScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.login)
  const [data, setData] = useState([]);
  const [order, setOrder] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('Chưa giải quyết');
  const [isLoading, setIsLoading] = useState(false);
  const transx = useSharedValue(0);
  const [valueDrop, setValueDrop] = useState(status[0].value)

  useEffect(() => {
    const socketInstance = getSocket()
    socketInstance.on('order_status', (data) => {
      getOrder()
    })
  }, [])

  const handleSelectOrder = orderType => {
    setSelectedOrder(orderType);
  };
  //animation style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: -6,
      zIndex: 1,
      transform: [{ translateX: transx.value }],
      width: '33%',
      height: 2,
      backgroundColor: appColor.primary,
      marginVertical: 5,
      borderRadius: 10,
    };
  });
  //animation
  useEffect(() => {
    if (selectedOrder == 'Đang giao hàng') {
      transx.value = withTiming(appInfor.sizes.width * 0.31, { duration: 300 });
    }
    else if (selectedOrder == 'Lịch sử') {
      transx.value = withTiming(appInfor.sizes.width * 0.62, { duration: 300 });
    } else {
      transx.value = withTiming(0, { duration: 300 });
    }
  }, [selectedOrder]);

  console.log('selectedOrder', selectedOrder);

  const filterCart = () => {
    if (selectedOrder == 'Chưa giải quyết') {
      getOrderWattting()
    }
    else if (selectedOrder == 'Đang giao hàng') {
      getOrderShipping()
    } else {
      getOrderFinished()
    }
  }
  //lọc data tương ứng với status đã giao hay đang giao
  useEffect(() => {
    filterCart()
  }, [selectedOrder, order]);

  useFocusEffect(
    useCallback(() => {
      getOrder()
      filterCart()
    }, [selectedOrder])
  );

  useEffect(() => {
    filterCart()
  }, [valueDrop]);


  const getOrder = async () => {
    try {
      setIsLoading(true)
      const response = await AxiosInstance().get(`/orders/orders-by-user/${user._id}`,);
      // console.log('response', response);
      setOrder(response.data);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false)
    }
  };

  const getOrderWattting = async () => {
    try {
      if (order) {
        const result = order.filter(item => item.status === 'Chưa giải quyết' ||
          item.status === 'Chờ thanh toán' ||
          item.status === 'Tìm tài xế'||
          item.status === 'Đang đến nhà hàng'||
          item.status === 'Tài xế đã đến nhà hàng')
        // console.log('result', result);
        setData(result)
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  const getOrderShipping = async () => {
    try {
      if (order) {
        const result = order.filter(item => item.status === 'Đang giao hàng'||
          item.status === 'Shipper đã đến điểm giao hàng'
        )
        // console.log('result', result);
        setData(result)
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  const getOrderFinished = async () => {
    try {
      if (order) {
        const result = order.filter(item => {
          if (valueDrop == 'all') {
            return item.status === 'Đơn hàng đã được giao hoàn tất' ||
              item.status === 'Người dùng đã hủy đơn' ||
              item.status === 'Shipper đã hủy đơn' ||
              item.status === 'Nhà hàng đã hủy đơn'
          } else if (valueDrop == 'delivered') {
            return item.status === 'Đơn hàng đã được giao hoàn tất'
          } else if (valueDrop == 'rated') {
            return item.statusReview === true
          } else if (valueDrop == 'cancel') {
            return item.status === 'Người dùng đã hủy đơn' ||
              item.status === 'Shipper đã hủy đơn' ||
              item.status === 'Nhà hàng đã hủy đơn'
          }
          // valueDrop == 'rated' && item.status === 'Đơn hàng đã được giao hoàn tất' ||
          // item.status === 'Đã đánh giá đơn hàng' ||
          // item.status === 'Người dùng đã hủy đơn' ||
          // item.status === 'Shipper đã hủy đơn' ||
          // item.status === 'Nhà hàng đã hủy đơn'
        })
        // console.log('result', result);
        setData(result)
      }
    } catch (error) {
      console.log('error', error);
    }
  }



  const rendreitem = ({ item }) => {
    const { _id, status, totalPrice } = item;
    const products = item.items
    const { orderDate, paymentMethod } = item
    const { name, address, images, rating } = item.shopOwner

    // const totalQuantity = item.reduce((acc, cur) => acc + cur.count, 0);
    // console.log(totalQuantity);
    return (
      <TouchableOpacity
        key={_id}
        style={styles.item}
        activeOpacity={status == 'đã giao' ? 1 : 0.7}
        onPress={
          () => {
            if (selectedOrder == 'Chưa giải quyết' || selectedOrder == 'Đang giao hàng') {
              navigation.navigate('CheckOrder', { item: item });
            }else if(selectedOrder == 'Lịch sử'){
              navigation.navigate('DetailOrder', { item: item });
            }
          }
        }>
        <RowComponent noAlign >
          {images && <Image source={{ uri: images[0] }} style={styles.imgShop} />}
          <SpaceComponent width={10} />
          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <RowComponent justifyContent={'space-between'} noAlign>
              <TextComponent numberOfLines={2} ellipsizeMode={'tail'} text={name} fontFamilies={fontFamilies.bold} width={appInfor.sizes.width * 0.45} />
              <TextComponent text={formatPrice(totalPrice)} fontsize={14} color={appColor.primary} fontFamily={fontFamilies.bold} />
            </RowComponent>

            <TextComponent text={address} fontsize={12} color={appColor.subText} styles={{ marginVertical: 10 }} />

            <RowComponent justifyContent={'space-between'} noAlign>
              <TextComponent text={formatDate(orderDate)} width={appInfor.sizes.width * 0.3} fontsize={14} color={appColor.subText} />

              {
                selectedOrder == 'Lịch sử' ?
                  <TextComponent text={`${
                    status == 'Đơn hàng đã được giao hoàn tất' ? 'Đã giao hàng' : 'Đã hủy'}`}
                    color={status == 'Đơn hàng đã được giao hoàn tất' ?
                      appColor.green :
                      status == 'Đã đánh giá đơn hàng' ? appColor.yellow : appColor.primary}
                    fontFamily={fontFamilies.bold} /> :
                  <TextComponent text={`${paymentMethod}${status === 'Chờ thanh toán' ? ' (Chờ thanh toán)' : ''}`} fontsize={14} fontFamily={fontFamilies.bold} />
              }
            </RowComponent>
            <SpaceComponent height={10} />
            {selectedOrder != 'Lịch sử' && <TextComponent text={`${status}`} fontsize={14} color={appColor.primary} />}
          </View>
        </RowComponent>

        {/* nút đặt hàng lại_xem chi tiết */}
        {selectedOrder == 'Lịch sử' && (
          <RowComponent justifyContent={'space-between'} styles={{ width: '100%' }}>
            <ButtonComponent
              width={appInfor.sizes.width * 0.3}
              height={appInfor.sizes.height * 0.05}
              text={'Đặt hàng lại'}
              color={appColor.white}
              onPress={() => navigation.navigate('CheckOut', { data: item })} />
            <ButtonComponent
              width={appInfor.sizes.width * 0.3}
              height={appInfor.sizes.height * 0.05}
              text={'Xem chi tiết'}
              color={appColor.primary}
              backgroundColor={appColor.white}
              onPress={() => {
                navigation.navigate('DetailOrder', { item: item });
              }}
            />
          </RowComponent>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <ContainerComponent styles={globalStyle.container}>
      {/* header đơn hàng của tôi */}
      {/* <HeaderComponent text={'Đơn hàng của tôi'} />
      <SpaceComponent height={10} /> */}
      {/* body*/}
      <View style={{ flex: 1 }}>
        {/* đã giao- đang giao */}
        <View style={styles.orders}>
          <Animated.View style={animatedStyle} />
          <OrderComponent
            order={'Chưa giải quyết'}
            selectedOrder={selectedOrder}
            handleSelectOrder={handleSelectOrder}
          />
          <OrderComponent
            order={'Đang giao hàng'}
            selectedOrder={selectedOrder}
            handleSelectOrder={handleSelectOrder}
          />
          <OrderComponent
            order={'Lịch sử'}
            selectedOrder={selectedOrder}
            handleSelectOrder={handleSelectOrder}
          />
        </View>
        {selectedOrder == 'Lịch sử' &&
          <View>
            <SpaceComponent height={20} />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={{ tintColor: 'white' }}
              data={status}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={status[0].label}
              value={valueDrop}
              onChange={item => {
                setValueDrop(item.value);
              }}
            />
            <SpaceComponent height={10} />
            <LineComponent />
          </View>
        }
        {/* flatlist */}
        {data.length == 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../../assets/images/myorder/order.png')} />
            <SpaceComponent height={20} />
            <TextComponent text={'Hiện tại bạn không có đơn hàng nào.'} textAlign={'center'} />
            <SpaceComponent height={20} />
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={rendreitem}
          keyExtractor={item => item._id}
        />
      </View>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default MyOrderScreen;
const styles = StyleSheet.create({
  selectedTextStyle: {
    color: appColor.white,
    fontFamily: fontFamilies.bold,
  },
  placeholder: {
    fontFamily: fontFamilies.bold,
    color: appColor.white,
  },
  dropdown: {
    backgroundColor: appColor.primary,
    padding: 13,
    width: '38%',
    borderRadius: 10,
  },
  imgShop: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  orders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#CED7DF',
  },
  order: {
    flexShrink: 1,
    width: '100%',
    alignItems: 'center',
    padding: '3%',
  },
  item: {
    gap: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: appColor.gray,
  },

});
// const DATA = [
//   {
//     id: 1,
//     status: 'đã giao',
//     name: 'Quán A',
//     date: '01 thg 01, 00:00',
//     price: '999.999đ',
//     img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726317280/Rectangle_175_mcixkk.png',
//     order: [
//       { id: 1, count: 1, name: 'lục trà', price: '111.111.111đ' },
//       { id: 2, count: 2, name: 'lục trà', price: '1.111đ' },
//     ],
//     payment: 'PayOS'
//   },
//   {
//     id: 2,
//     status: 'đang giao',
//     name: 'Quán B',
//     time: '18',
//     img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318386/Rectangle_175_xzn14n.jpg',
//     date: 'Đơn hàng của bạn đã được nhận để giao hàng',
//     price: '99.999.999đ',
//     order: [
//       { id: 1, count: 5, name: 'lục trà táo', price: '111.111.111đ' },
//       { id: 2, count: 10, name: 'lục trà cam', price: '1.111đ' },
//     ],
//     payment: 'ZaloPay'
//   },
//   {
//     id: 3,
//     status: 'đã giao',
//     name: 'Quán Cdgdfhf-fsf gfdg gfdg',
//     date: '01 thg 01, 00:00',
//     img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318392/Rectangle_175_1_rspy6t.jpg',
//     price: '9.999.999đ',
//     order: [{ id: 1, count: 10, name: 'lục trà mạn', price: '111.111.111đ' }],
//     payment: 'Tiền mặt'
//   },
//   {
//     id: 4,
//     name: 'Quán GG',
//     date: '01 thg 01, 00:00',
//     img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318392/Rectangle_175_1_rspy6t.jpg',
//     price: '9.999.999đ',
//     order: [{ id: 1, count: 5, name: 'lục trà táo', price: '111.111.111đ' },
//     { id: 2, count: 10, name: 'lục trà cam', price: '1.111đ' },],
//   },
//   {
//     id: 5,
//     name: 'Quán W',
//     date: '01 thg 01, 00:00',
//     img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318392/Rectangle_175_1_rspy6t.jpg',
//     price: '9.999.999đ',
//     order: [{ id: 1, count: 10, name: 'lục trà mạn', price: '111.111.111đ' }],
//   },
// ];

const status = [
  {
    label: 'Tất cả',
    value: 'all'
  },
  {
    label: 'Đã giao',
    value: 'delivered'
  },
  {
    label: 'Đánh giá',
    value: 'rated'
  },
  {
    label: 'Đã hủy',
    value: 'cancel'
  }
]
