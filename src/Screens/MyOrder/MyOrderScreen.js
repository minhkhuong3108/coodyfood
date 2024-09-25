import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextComponent from '../../components/TextComponent';
import ContainerComponent from '../../components/ContainerComponent';
import {appColor} from '../../constants/appColor';
import {appInfor} from '../../constants/appInfor';
import {fontFamilies} from '../../constants/fontFamilies';
import ButtonComponent from '../../components/ButtonComponent';
import OrderComponent from '../../components/MyOrder/OrderComponent';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import HeaderComponent from '../../components/HeaderComponent';
import { globalStyle } from '../../styles/globalStyle';

const MyOrderScreen = ({navigation}) => {
  const [Data, setData] = useState(data);
  const [selectedOrder, setSelectedOrder] = useState('delivered');
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
      transform: [{translateX: transx.value}],
      width: '50%',
      height: 2,
      backgroundColor: appColor.primary,
      marginVertical: 5,
      borderRadius: 10,
    };
  });
  //animation
  useEffect(() => {
    if (selectedOrder == 'shipping') {
      transx.value = withTiming(appInfor.sizes.width * 0.45, {duration: 300});
    } else {
      transx.value = withTiming(0, {duration: 300});
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
      return false;
    });
    setData(filteredData);
  }, [selectedOrder]);

  const rendreitem = ({item}) => {
    const {id, status, name, date, price, time, img, paymenttype} = item;
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={status == 'đã giao' ? 1 : 0.7}>
        <View style={{flexDirection: 'row'}}>
          {/* ảnh*/}
          <View style={styles.img}>
            <Image style={{flex: 1}} source={{uri: img}} />
          </View>
          {/* tên_ngày_giá_thời gian */}
          <View style={styles.namedateprice}>
            {/* tên_giá */}
            <View style={styles.nameandprice}>
              <View>
                <TextComponent
                  styles={styles.name}
                  text={name}
                  fontFamily={fontFamilies.bold}
                />
                {/* thời gian */}
                {time && (
                  <View style={styles.clocktime}>
                    <Image
                      style={styles.clock}
                      source={require('../../assets/images/myorder/clock.png')}
                    />
                    <TextComponent text={time + ' phút'} fontsize={14} />
                  </View>
                )}
              </View>
              <TextComponent text={price} fontFamily={fontFamilies.bold} />
            </View>
            {/* ngày */}
            <View style={styles.datepayment}>
              <TextComponent
                styles={styles.date}
                text={date}
                color={appColor.lightgray}
                fontsize={14}
              />
              <TextComponent
                styles={styles.date}
                text={paymenttype}
                color={appColor.text}
                fontFamily={fontFamilies.bold}
                fontsize={14}
              />
            </View>
          </View>
        </View>
        {/* nút đặt hàng lại_xem chi tiết */}
        {status == 'đã giao' && (
          <View style={styles.button}>
            <ButtonComponent
              width={appInfor.sizes.width * 0.3}
              height={appInfor.sizes.height * 0.05}
              text={'Đặt hàng lại'}
              color={appColor.white}></ButtonComponent>
            <ButtonComponent
              width={appInfor.sizes.width * 0.3}
              height={appInfor.sizes.height * 0.05}
              text={'Xem chi tiết'}
              color={appColor.primary}
              backgroundColor={appColor.white}
              onPress={() => {
                navigation.navigate('DetailOrder', {orderData: item});
              }}
            />
          </View>
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
            order={'delivered'}
            selectedOrder={selectedOrder}
            handleSelectOrder={handleSelectOrder}
          />
          <OrderComponent
            order={'shipping'}
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

export default MyOrderScreen;
const styles = StyleSheet.create({
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
    gap: 10,
    marginTop: 15,
    padding: '2%',
    paddingBottom: '6%',
    borderBottomWidth: 1,
    borderColor: '#CED7DF',
  },
  nameandprice: {
    width: appInfor.sizes.width * 0.62,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    width: appInfor.sizes.width * 0.215,
    height: appInfor.sizes.height * 0.1,
    borderRadius: 10,
  },
  button: {
    marginTop: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  namedateprice: {
    marginLeft: '3%',
    marginRight: '3%',
    justifyContent: 'space-between',
  },
  name: {
    width: appInfor.sizes.width * 0.35,
  },
  clocktime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  clock: {
    width: appInfor.sizes.width * 0.035,
    resizeMode: 'contain',
  },
  datepayment: {
    flexDirection: 'row',
    width: appInfor.sizes.width * 0.62,
    justifyContent: 'space-between',
  },
  date: {
    maxWidth: appInfor.sizes.width * 0.62,
  },
});
const data = [
  {
    id: 1,
    status: 'đã giao',
    name: 'Quán A',
    date: '2024-9-15 (13:44)',
    price: '999.999đ',
    paymenttype: 'ZaloPay',
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726317280/Rectangle_175_mcixkk.png',
    order: [
      {id: 1, count: '156x', name: 'lục trà', price: '111.111.111đ'},
      {id: 2, count: '156x', name: 'lục trà', price: '1.111đ'},
    ],
  },
  {
    id: 2,
    status: 'đang giao',
    name: 'Quán B',
    time: '18',
    paymenttype: null,
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318386/Rectangle_175_xzn14n.jpg',
    date: 'Đơn hàng của bạn đã được nhận để giao hàng',
    price: '99.999.999đ',
    order: [
      {id: 1, count: '156x', name: 'lục trà táo', price: '111.111.111đ'},
      {id: 2, count: '156x', name: 'lục trà cam', price: '1.111đ'},
    ],
  },
  {
    id: 3,
    status: 'đã giao',
    name: 'Quán Cdgdfhf-fsf gfdg gfdg',
    date: '2024-9-16 (13:44)',
    paymenttype: 'ZaloPay',
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318392/Rectangle_175_1_rspy6t.jpg',
    price: '9.999.999đ',
    order: [{id: 1, count: '156x', name: 'lục trà mạn', price: '111.111.111đ'}],
  },
];
