import {
  FlatList,
  Image,
  Linking,
  NativeModules,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContainerComponent from '../../../components/ContainerComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import TextComponent from '../../../components/TextComponent';
import { fontFamilies } from '../../../constants/fontFamilies';
import { appColor } from '../../../constants/appColor';
import SpaceComponent from '../../../components/SpaceComponent';
import { globalStyle } from '../../../styles/globalStyle';
import RowComponent from '../../../components/RowComponent';
import OrderItem from '../../../components/OrderItem';
import ButtonComponent from '../../../components/ButtonComponent';
import LineComponent from '../../../components/LineComponent';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import AxiosInstance from '../../../helpers/AxiosInstance';
import LoadingModal from '../../../modal/LoadingModal';
import moment from 'moment';
import crypto from 'crypto-js';
import axios from 'axios';
import { getSocket } from '../../../socket/socket';
import AlertChoiceModal from '../../../modal/AlertChoiceModal';
import { CallConfig } from '../../Call/Callconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { formatPrice } from '../../../components/format/FomatPrice';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { Removemess } from '../../../components/Removemess';
import { showNotification } from '../../../components/Notification';
import { useSelector } from 'react-redux';

const CheckOrderScreen = ({ navigation, route }) => {
  const { item } = route.params;
  const { user } = useSelector(state => state.login);
  const [order, setOrder] = useState(item.items);
  const [imagePayment, setImagePayment] = useState('');
  const [indexPay, setIndexPay] = useState(2);
  const [shipper, setShipper] = useState(item.shipper);
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(item.status);
  const [visible, setVisible] = useState(false);
  const isInMessageScreenRef = useRef(false);
  const voucher = item.voucher != null ? item.voucher.discountAmount : 0;
  const totalPrice = item.totalPrice - item.shippingfee + voucher;
  const priceZaloPay = item.totalPrice;


  const snapPoint = ['50%'];
  const bottomSheetRef = useRef(null);
  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(props => (
    <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
  ));
  //

  const getOrderDetail = async () => {
    try {
      setIsLoading(true)
      const response = await AxiosInstance().get(`/orders/${item._id}`,);
      console.log('response', response.data.status);
      setOrderStatus(response.data.status);
      setOrder(response.data.items);
      setShipper(response.data.shipper);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false)
    }
  };
  console.log('order', order);

  useEffect(() => {
    if (shipper) {
      item.shipper = shipper
    }
  }, [shipper])

  //khi tu component khac tro ve
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      isInMessageScreenRef.current = false
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // console.log(item)
    // Kết nối socket
    const socketInstance = getSocket();
    // Tham gia room
    socketInstance.emit('join_room', item._id);
    //xoá receive_message cũ và Lắng nghe mới 
    socketInstance.off('receive_message')
    try {
      socketInstance.on('receive_message', async data => {
        // Lấy tin nhắn hiện tại từ AsyncStorage
        const storedMessages = await AsyncStorage.getItem('messageList');
        const messageList = storedMessages ? JSON.parse(storedMessages) : [];

        // Thêm tin nhắn mới vào danh sách
        const newMessageList = [...messageList, data];

        // Lưu danh sách mới vào AsyncStorage
        await AsyncStorage.setItem(
          'messageList',
          JSON.stringify(newMessageList),
        );
        if (user.name != data.name && !isInMessageScreenRef.current) {
          await showNotification()
        }
      });
      socketInstance.on('order_status', (order) => {
        getOrderDetail()

      })
    } catch (error) {
      console.log(error);
    }
    //kiểm tra  socket hoàn thành đơn hay chưa
    socketInstance.on('order_completed', data => {
      // console.log(data)
      if (data.orderId == item._id) {
        const socketInstance = getSocket();
        Removemess()
        socketInstance.off('receive_message');
        socketInstance.off('order_completed');
        socketInstance.off('receive_message')
      }
    })

  }, []);

  const options = [
    {
      name: 'ZaloPay',
      image: require('../../../assets/images/checkout/zalo.png'),
    },
    {
      name: 'PayOS',
      image: require('../../../assets/images/checkout/payos.png'),
    },
    {
      name: 'Tiền mặt',
      image: require('../../../assets/images/checkout/cash.png'),
    },
  ];

  const getPayment = () => {
    if (item.paymentMethod == 'ZaloPay') {
      setImagePayment(require('../../../assets/images/checkout/zalo.png'));
    } else if (item.paymentMethod == 'PayOS') {
      setImagePayment(require('../../../assets/images/checkout/payos.png'));
    } else {
      setImagePayment(require('../../../assets/images/checkout/cash.png'));
    }
  };

  const parseQueryParams = (url) => {
    const queryParams = {};
    const [_, queryString] = url.split('?'); // Lấy phần sau dấu '?'
    const pairs = queryString.split('&'); // Tách từng cặp key=value

    pairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      queryParams[key] = decodeURIComponent(value); // Giải mã các ký tự đặc biệt
    });

    return queryParams;
  };

  const handlePayment = async () => {
    try {
      if (indexPay == 0) {
        setIsLoading(true);
        const config = {
          appid: 2554,
          key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
          key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
          endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
        };
        const transID = Math.floor(Math.random() * 1000000);
        let appid = config.appid;
        let app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
        let amount = priceZaloPay;
        let appuser = 'ZaloPayDemo';
        let apptime = Date.now();
        let embeddata = '{}';
        let item = '[]';
        let description = 'Merchant description for order #' + app_trans_id;
        let hmacInput =
          appid +
          '|' +
          app_trans_id +
          '|' +
          appuser +
          '|' +
          amount +
          '|' +
          apptime +
          '|' +
          embeddata +
          '|' +
          item;
        let mac = crypto.HmacSHA256(hmacInput, config.key1).toString();
        const order = {
          app_id: appid,
          app_trans_id: app_trans_id,
          app_user: appuser,
          amount: amount,
          app_time: apptime,
          item: item,
          embed_data: embeddata,
          description: description,
          mac: mac,
        };

        const handleLinking = async (event) => {
          const url = event.url;
          console.log('Received URL:', url);

          const params = parseQueryParams(url);
          console.log('Parsed params:', params);

          const { code } = params;

          if (code === '1') {
            const result2 = await updatedOrder();
            if (result2) {
              navigation.navigate('SuccessPayment');
            } else {
              ToastAndroid.show('Thanh toán thất bại', ToastAndroid.SHORT);
            }
          } else {
            navigation.navigate('FailPayment');
          }

          subscription.remove() // Hủy listener sau khi xử lý
        };

        const subscription = Linking.addListener('url', handleLinking);

        const response = await axios.post(config.endpoint, order);
        setIsLoading(false);
        // Handle response from server
        const result = response.data;
        if (result.return_code == 1) {
          var ZaloPay = NativeModules.PayZaloBridge;
          ZaloPay.payOrder(result.zp_trans_token);
        } else if (result.return_code == -1) {
          var ZaloPay = NativeModules.PayZaloBridge;
          ZaloPay.installApp();
        } else {
          Alert.alert('Error', 'Failed  to create order');
        }
      } else if (indexPay == 1) {
        // Handle payment with PayOS
        setIsLoading(true);
        const urlPayOS = 'https://api-merchant.payos.vn/v2/payment-requests';
        const data = {
          orderCode: Number(String(Date.now()).slice(-6)),
          amount: 2000,
          description: 'VQRIO123',
          items: order,
          cancelUrl: 'coodyfood://fail-payment', // URL khi thanh toán thất bại
          returnUrl: `coodyfood://success-payment?paymentMethod=PayOS&orderId=${item._id}`, // URL khi thanh toán thành công
          // "expiredAt": 1696559798,
        };

        const sortedData = `amount=${data.amount}&cancelUrl=${data.cancelUrl}&description=${data.description}&orderCode=${data.orderCode}&returnUrl=${data.returnUrl}`;

        // Checksum key từ Kênh thanh toán
        const checksumKey =
          'afbd4ad1e5f608bba26bc0dd6b0e256b7424b91d955bf3dc9f470483f05a1200'; // Thay YOUR_CHECKSUM_KEY bằng checksum key thực tế của bạn

        // Tạo chữ ký HMAC_SHA256
        const signature = crypto.HmacSHA256(sortedData, checksumKey).toString();

        try {
          const response = await axios.post(
            urlPayOS,
            {
              ...data,
              signature,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-client-id': 'd5aadfd7-2a34-43e0-9cbb-e580f986f144',
                'x-api-key': 'd3e8013a-1db0-429a-9159-36c152d26782',
              },
            },
          );
          // console.log('response', response.data);
          setIsLoading(false);
          const checkoutUrl = response.data.data.checkoutUrl;
          if (checkoutUrl) {
            navigation.navigate('PayOS', { checkoutUrl });
          }
        } catch (error) {
          console.log(error);
        }
      } else if (indexPay == 2) {
        const result = await updatedOrder();
        if (result) {
          ToastAndroid.show('Thanh toán thành công', ToastAndroid.SHORT);
          navigation.navigate('Order');
        } else {
          ToastAndroid.show('Thanh toán thất bại', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const updatedOrder = async () => {
    try {
      setIsLoading(true);
      const response = await AxiosInstance().put(
        `/orders/Success-Payment/${item._id}`, { paymentMethod }
      );
      if (response.status == true) {
        // navigation.navigate('SuccessPayment');
        return response.data;
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setVisible(false);
    try {
      setIsLoading(true);
      const response = await AxiosInstance().patch(`/orders/customerCancel/${item._id}`);
      console.log('response', response);
      if (response.status == true) {
        ToastAndroid.show('Hủy đơn hàng thành công', ToastAndroid.SHORT);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPayment();
    const socket = getSocket();
    socket.on('order_status', (order) => {
      setOrderStatus(order.status)
    })
    return () => {
      socket.off('order_status');
    };
  }, [item.paymentMethod, item._id]);


  return (
    <ContainerComponent styles={{ flex: 1, backgroundColor: appColor.white }}>
      <ContainerComponent styles={globalStyle.container} isScroll>
        <HeaderComponent text={'Đơn hàng chi tiết'} isback />
        {orderStatus == 'Tìm tài xế' || orderStatus == 'Chờ thanh toán' || orderStatus == 'Đang xử lý' ? (
          <View style={[styles.viewWait, globalStyle.shawdow]}>
            <TextComponent
              text={'Đang xử lý đơn hàng của bạn...'}
              fontsize={22}
              fontFamily={fontFamilies.bold}
              color={appColor.primary}
              textAlign={'center'}
            />
            <SpaceComponent height={10} />
            <TextComponent
              text={'Vui lòng chờ trong giây lát'}
              color={appColor.subText}
              textAlign={'center'}
            />
          </View>
        ) : (
          <RowComponent
            justifyContent={'space-between'}
            styles={[styles.viewShipper, globalStyle.shawdow]}>
            <RowComponent>
              <View style={styles.imgShipper}>
                {item.shipper && <Image
                  style={{ flex: 1 }}
                  source={{
                    uri:
                      item.shipper.image
                        ? item.shipper.image[0]
                        : 'https://res.cloudinary.com/djywo5wza/image/upload/v1729757743/clone_viiphm.png',
                  }}
                />}
              </View>
              <SpaceComponent width={10} />
              <View>
                {item.shipper && <TextComponent text={item.shipper.name} fontsize={16} />}
                <SpaceComponent height={20} />
                <RowComponent>
                  <TextComponent text={`Đánh giá: 5 `} fontsize={14} />
                  <Image
                    source={require('../../../assets/images/checkOrder/star.png')}
                  />
                </RowComponent>
              </View>
            </RowComponent>
            <RowComponent>
              {item.shipper && <ZegoSendCallInvitationButton
                invitees={[
                  //{userID: Order.user.phone, userName: Order.user.name},
                  { userID: item.shipper.phone, userName: item.shipper.name },
                ]}
                width={45}
                height={45}
                backgroundColor={'#EF2E2E'}
                icon={require('../../../assets/images/shipper/callicon.png')}
                borderRadius={10}
                isVideoCall={false}
                resourceID={'zego_data'}
              />}
              <View style={{ marginRight: 15 }} />
              <ButtonComponent
                type={'link'}
                image={require('../../../assets/images/checkOrder/chat.png')}
                onPress={() => { navigation.navigate("Message", { items: item }); isInMessageScreenRef.current = true }}
              />
            </RowComponent>
          </RowComponent>
        )}

        <SpaceComponent height={20} />
        <TextComponent
          text={orderStatus}
          color={appColor.primary}
          fontsize={20}
          textAlign={'center'}
          fontFamily={fontFamilies.semiBold}
        />
        <SpaceComponent height={20} />
        <View style={[styles.viewAddress, globalStyle.shawdow]}>
          <RowComponent>
            <Image
              source={require('../../../assets/images/checkOrder/shop.png')}
            />
            <SpaceComponent width={15} />
            <View>
              <TextComponent
                text={'Địa chỉ nhà hàng'}
                fontFamily={fontFamilies.bold}
              />
              <SpaceComponent height={5} />
              <TextComponent
                width={280}
                text={item.shopOwner.address}
                fontsize={12}
                color={appColor.subText}
              />
            </View>
          </RowComponent>
          <SpaceComponent height={10} />
          <RowComponent>
            <Image
              source={require('../../../assets/images/checkOrder/home.png')}
            />
            <SpaceComponent width={15} />
            <View>
              <TextComponent
                text={'Địa chỉ đặt hàng'}
                fontFamily={fontFamilies.bold}
              />
              <SpaceComponent height={5} />
              <TextComponent
                width={280}
                text={item.shippingAddress.address}
                fontsize={12}
                color={appColor.subText}
              />
            </View>
          </RowComponent>
        </View>
        <SpaceComponent height={20} />
        <View style={[styles.viewProduct, globalStyle.shawdow]}>
          <TextComponent
            text={'Danh sách món'}
            fontsize={20}
            fontFamily={fontFamilies.bold}
          />
          <SpaceComponent height={20} />
          <FlatList
            scrollEnabled={false}
            data={order}
            renderItem={({ item }) => <OrderItem noTouch item={item} />}
            keyExtractor={item => item._id}
          />
        </View>
        <SpaceComponent height={10} />
        <RowComponent
          justifyContent={'space-between'}
          styles={[styles.viewPay, globalStyle.shawdow]}>
          <TextComponent
            text={'Phương thức thanh toán'}
            fontsize={14}
            fontFamily={fontFamilies.bold}
          />
          <RowComponent>
            <TextComponent
              text={item.paymentMethod}
              fontsize={14}
              fontFamily={fontFamilies.bold}
            />
            <SpaceComponent width={4} />
            {imagePayment && <Image source={imagePayment} />}
          </RowComponent>
        </RowComponent>
        <SpaceComponent height={10} />
        {orderStatus == 'Chờ thanh toán' ? (
          <RowComponent justifyContent={'space-between'}>
            <ButtonComponent
              text={'HỦY ĐƠN HÀNG'}
              backgroundColor={appColor.white}
              borderColor={appColor.white}
              onPress={() => setVisible(item.shipper ? false : true)}
              width={'48%'}
            />
            <ButtonComponent
              text={'THANH TOÁN'}
              color={appColor.white}
              width={'48%'}
              onPress={handleOpenBottomSheet}
            />
          </RowComponent>
        ) : (
          <ButtonComponent
            text={'HỦY ĐƠN HÀNG'}
            color={appColor.white}
            styles={{ opacity: item.shipper ? 0.5 : 1 }}
            onPress={() => setVisible(item.shipper ? false : true)}
            disabled={item.shipper ? true : false}
          />
        )}
        <SpaceComponent height={10} />
        <View style={[styles.viewPrice, globalStyle.shawdow]}>
          <TextComponent
            text={'Tóm tắt thanh toán'}
            fontFamily={fontFamilies.bold}
          />
          <SpaceComponent height={15} />
          <View style={{ paddingHorizontal: 10 }}>
            <RowComponent justifyContent={'space-between'}>
              <TextComponent text={'Tạm tính'} />
              <TextComponent text={formatPrice(totalPrice)} />
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent justifyContent={'space-between'}>
              <TextComponent text={'Phí giao hàng'} />
              <TextComponent text={formatPrice(item.shippingfee)} />
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent justifyContent={'space-between'}>
              <TextComponent text={'Mã giảm giá'} />
              <TextComponent text={item.voucher ? formatPrice(voucher) : '0đ'} />
            </RowComponent>
          </View>
          <SpaceComponent height={15} />
          <LineComponent />
          <SpaceComponent height={10} />
          <RowComponent justifyContent={'space-between'}>
            <TextComponent
              text={'Tổng cộng'}
              fontsize={18}
              fontFamily={fontFamilies.bold}
            />
            <TextComponent
              text={formatPrice(item.totalPrice)}
              fontsize={18}
              fontFamily={fontFamilies.bold}
            />
          </RowComponent>
        </View>
        <SpaceComponent height={70} />
      </ContainerComponent>
      <BottomSheet
        enablePanDownToClose
        ref={bottomSheetRef}
        snapPoints={snapPoint}
        backdropComponent={renderBackdrop}
        index={-1}>
        <ContainerComponent styles={styles.btsContainer}>
          <TextComponent
            text={'Chọn phương thức thanh toán'}
            fontsize={18}
            fontFamily={fontFamilies.bold}
          />
          <SpaceComponent height={20} />
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.btnRow}
              onPress={() => {
                setIndexPay(index), setPaymentMethod(item.name);
              }}>
              <View
                style={[
                  styles.circleContainer,
                  index == indexPay && styles.activeCircleContainer,
                ]}>
                <View
                  style={[
                    styles.circle,
                    index == indexPay && styles.activeCircle,
                  ]}
                />
              </View>
              <SpaceComponent width={20} />
              <Image source={item.image} />
              <SpaceComponent width={10} />
              <TextComponent text={item.name} />
            </TouchableOpacity>
          ))}
          <SpaceComponent height={20} />
          <LineComponent />
          <SpaceComponent height={20} />
          <RowComponent justifyContent={'space-between'}>
            <TextComponent
              text={'Tổng cộng'}
              fontsize={18}
              fontFamily={fontFamilies.bold}
            />
            <TextComponent
              text={formatPrice(item.totalPrice)}
              fontsize={18}
              fontFamily={fontFamilies.bold}
            />
          </RowComponent>
          <SpaceComponent height={40} />
          <ButtonComponent
            text={'Đặt hàng'}
            onPress={handlePayment}
            color={appColor.white}
          />
        </ContainerComponent>
      </BottomSheet>
      <LoadingModal visible={isLoading} />
      <AlertChoiceModal
        title={'Hủy đơn hàng'}
        description={'Bạn có chắc chắn muốn hủy đơn hàng này không?'}
        visible={visible}
        onPress={handleCancelOrder}
        onClose={() => setVisible(false)}
      />
    </ContainerComponent>
  );
};

export default CheckOrderScreen;

const styles = StyleSheet.create({
  btsContainer: {
    backgroundColor: appColor.white,
    paddingHorizontal: 16,
  },
  activeCircleContainer: {
    borderColor: appColor.primary,
  },
  circleContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: appColor.subText,
    backgroundColor: appColor.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: appColor.primary,
    borderColor: appColor.primary,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: appColor.white,
    backgroundColor: appColor.white,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imgShipper: {
    width: 85,
    height: 85,
    borderRadius: 10,
    backgroundColor: appColor.gray,
    overflow: 'hidden',
  },
  viewShipper: {
    width: '100%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: appColor.white,
  },
  viewPrice: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: appColor.white,
  },
  viewPay: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: appColor.white,
  },
  viewProduct: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: appColor.white,
  },
  viewAddress: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: appColor.white,
  },
  viewWait: {
    width: '100%',
    padding: 20,
    backgroundColor: appColor.white,
    borderRadius: 15,
  },
});
