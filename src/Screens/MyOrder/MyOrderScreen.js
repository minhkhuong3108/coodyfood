@ -1,260 +0,0 @@
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import TextComponent from '../../components/TextComponent';
import Header from '../../components/HeaderComponent';
import ContainerComponent from '../../components/ContainerComponent';
import { appColor } from '../../constants/appColor';
import { appInfor } from '../../constants/appInfor';
import { fontFamilies } from '../../constants/fontFamilies';
import ButtonComponent from '../../components/ButtonComponent';
import OrderComponent from '../../components/MyOrder/OrderComponent';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import HeaderComponent from '../../components/HeaderComponent';
import { globalStyle } from '../../styles/globalStyle';
import RowComponent from '../../components/RowComponent';
import SpaceComponent from '../../components/SpaceComponent';

const MyOrder = ({ navigation }) => {
  const [Data, setData] = useState(data);
  const [selectedOrder, setSelectedOrder] = useState('shipping');
  const transx = useSharedValue(0);
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
    if (selectedOrder == 'delivered') {
      transx.value = withTiming(appInfor.sizes.width * 0.31, { duration: 300 });
    }
    else if (selectedOrder == 'cart') {
      transx.value = withTiming(appInfor.sizes.width * 0.62, { duration: 300 });
    } else {
      transx.value = withTiming(0, { duration: 300 });
    }
  }, [selectedOrder]);
  //lọc data tương ứng với status đã giao hay đang giao
  useEffect(() => {
    const filteredData = data.filter(item => {
      if (selectedOrder === 'delivered') {
        return item.status === 'đã giao';
      } else if (selectedOrder === 'shipping') {
        return item.status === 'đang giao';
      }
      else if (selectedOrder === 'cart') {
        return !item.payment;
      }
      return false;
    });
    setData(filteredData);
  }, [selectedOrder]);

  const rendreitem = ({ item }) => {
    const { id, status, name, date, price, time, img, payment } = item;
    const totalQuantity = item.order.reduce((acc, cur) => acc + cur.count, 0);
    console.log(totalQuantity);

    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={status == 'đã giao' ? 1 : 0.7}>
        <RowComponent noAlign >
          <Image source={{ uri: img }} style={styles.imgShop} />
          <SpaceComponent width={10} />
          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <RowComponent justifyContent={'space-between'} noAlign>
              <TextComponent numberOfLines={2} ellipsizeMode={'tail'} text={name} fontFamilies={fontFamilies.bold} width={appInfor.sizes.width * 0.45} />
              {payment ? <TextComponent text={price} fontsize={14} color={appColor.primary} fontFamily={fontFamilies.bold} /> :
                <ButtonComponent type={'link'} image={require('../../assets/images/myorder/close.png')}/>
              }
            </RowComponent>
            {time && (
              <RowComponent>
                <Image source={require('../../assets/images/myorder/clock.png')} 
                style={{ width: 20, height: 20, marginVertical: 5 }} />
                <SpaceComponent width={5} />
                <TextComponent text={time + ' phút'} fontsize={14} color={appColor.subText} />
              </RowComponent>
            )}
            <RowComponent justifyContent={'space-between'} noAlign>
              {payment ? <TextComponent text={date} width={appInfor.sizes.width * 0.5} fontsize={14} color={appColor.subText} /> :
                <TextComponent text={price} color={appColor.primary} fontFamily={fontFamilies.bold} />
              }
              {
                payment ?
                  <TextComponent text={payment} fontsize={14} fontFamily={fontFamilies.bold} /> :
                  <TextComponent text={totalQuantity + ' sản phẩm'} />
              }
            </RowComponent>
          </View>

        </RowComponent>

        {/* nút đặt hàng lại_xem chi tiết */}
        {status == 'đã giao' && (
          <RowComponent justifyContent={'space-between'} styles={{ width: '100%' }}>
            <ButtonComponent
              width={appInfor.sizes.width * 0.3}
              height={appInfor.sizes.height * 0.05}
              text={'Đặt hàng lại'}
              color={appColor.white} />
            <ButtonComponent
              width={appInfor.sizes.width * 0.3}
              height={appInfor.sizes.height * 0.05}
              text={'Xem chi tiết'}
              color={appColor.primary}
              backgroundColor={appColor.white}
              onPress={() => {
                navigation.navigate('DetailOrder', { orderData: item });
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
      <HeaderComponent isback={true} text={'Đơn hàng của tôi'} />
      {/* body*/}
      <View >
        {/* đã giao- đang giao */}
        <View style={styles.orders}>
          <Animated.View style={animatedStyle} />
          <OrderComponent
            order={'shipping'}
            selectedOrder={selectedOrder}
            handleSelectOrder={handleSelectOrder}
          />
          <OrderComponent
            order={'delivered'}
            selectedOrder={selectedOrder}
            handleSelectOrder={handleSelectOrder}
          />
          <OrderComponent
            order={'cart'}
            selectedOrder={selectedOrder}
            handleSelectOrder={handleSelectOrder}
          />
        </View>
        {/* flatlist */}
        <FlatList
          data={Data}
          renderItem={rendreitem}
          keyExtractor={item => item.id}
        />
      </View>
    </ContainerComponent>
  );
};

export default MyOrder;
const styles = StyleSheet.create({
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
const data = [
  {
    id: 1,
    status: 'đã giao',
    name: 'Quán A',
    date: '01 thg 01, 00:00',
    price: '999.999đ',
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726317280/Rectangle_175_mcixkk.png',
    order: [
      { id: 1, count: 1, name: 'lục trà', price: '111.111.111đ' },
      { id: 2, count: 2, name: 'lục trà', price: '1.111đ' },
    ],
    payment: 'PayOS'
  },
  {
    id: 2,
    status: 'đang giao',
    name: 'Quán B',
    time: '18',
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318386/Rectangle_175_xzn14n.jpg',
    date: 'Đơn hàng của bạn đã được nhận để giao hàng',
    price: '99.999.999đ',
    order: [
      { id: 1, count: 5, name: 'lục trà táo', price: '111.111.111đ' },
      { id: 2, count: 10, name: 'lục trà cam', price: '1.111đ' },
    ],
    payment: 'ZaloPay'
  },
  {
    id: 3,
    status: 'đã giao',
    name: 'Quán Cdgdfhf-fsf gfdg gfdg',
    date: '01 thg 01, 00:00',
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318392/Rectangle_175_1_rspy6t.jpg',
    price: '9.999.999đ',
    order: [{ id: 1, count: 10, name: 'lục trà mạn', price: '111.111.111đ' }],
    payment: 'Tiền mặt'
  },
  {
    id: 4,
    name: 'Quán GG',
    date: '01 thg 01, 00:00',
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318392/Rectangle_175_1_rspy6t.jpg',
    price: '9.999.999đ',
    order: [{ id: 1, count: 5, name: 'lục trà táo', price: '111.111.111đ' },
    { id: 2, count: 10, name: 'lục trà cam', price: '1.111đ' },],
  },
  {
    id: 5,
    name: 'Quán W',
    date: '01 thg 01, 00:00',
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318392/Rectangle_175_1_rspy6t.jpg',
    price: '9.999.999đ',
    order: [{ id: 1, count: 10, name: 'lục trà mạn', price: '111.111.111đ' }],
  },
];