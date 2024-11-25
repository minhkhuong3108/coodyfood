import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ContainerComponent from '../../../components/ContainerComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import TextComponent from '../../../components/TextComponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import {appColor} from '../../../constants/appColor';
import SpaceComponent from '../../../components/SpaceComponent';
import {globalStyle} from '../../../styles/globalStyle';
import RowComponent from '../../../components/RowComponent';
import OrderItem from '../../../components/OrderItem';
import ButtonComponent from '../../../components/ButtonComponent';
import LineComponent from '../../../components/LineComponent';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import AxiosInstance from '../../../helpers/AxiosInstance';
import LoadingModal from '../../../modal/LoadingModal';
import moment from 'moment';
import crypto from 'crypto-js';
import axios from 'axios';
import {getSocket} from '../../../socket/socket';
import AlertChoiceModal from '../../../modal/AlertChoiceModal';
import {CallConfig} from '../../Call/Callconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {opacity} from 'react-native-reanimated/lib/typescript/Colors';

const CheckOrderScreen = ({navigation, route}) => {
  const {item} = route.params;
  console.log('item', item);
  const order = item.items;
  const [imagePayment, setImagePayment] = useState('');
  const [indexPay, setIndexPay] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(item.status);
  const [visible, setVisible] = useState(false);

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
  useEffect(() => {
    if (orderStatus == 'Đang giao hàng') {
      CallConfig(item.user.phone, item.user.name, item.shipper.image[0]);
    }
  }, [orderStatus]);

  useEffect(() => {
    console.log(item);
    // Kết nối socket
    const socketInstance = getSocket();
    // Tham gia room
    socketInstance.emit('join_room', item._id);
    // Lắng nghe socket tin nhắn và lưuu vào
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
      });
    } catch (error) {
      console.log(error);
    }
    //kiểm tra socket hoàn thành đơn hay chưa
    socketInstance.on('order_completed', data => {
      console.log(data);
      if (data.orderId == item._id) {
        const socketInstance = getSocket();
        removemessage();
        socketInstance.off('receive_message');
        socketInstance.off('order_completed');
      }
    });
  }, []);

  //xoá tin nhắn
  const removemessage = async () => {
    try {
      await AsyncStorage.removeItem('messageList');
      console.log('Đã xoá AsyncStorage tin nhắn!');
    } catch (error) {
      console.error('Lỗi khi xoá AsyncStorage tin nhắn:', error);
    }
  };

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
        let amount = 10000;
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

        const response = await axios.post(config.endpoint, order);
        setIsLoading(false);
        // Handle response from server
        const result = response.data;
        if (result.return_code == 1) {
          var ZaloPay = NativeModules.PayZaloBridge;
          ZaloPay.payOrder(result.zp_trans_token);
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
          console.log('response', response.data);
          setIsLoading(false);
          const checkoutUrl = response.data.data.checkoutUrl;
          if (checkoutUrl) {
            navigation.navigate('PayOS', {checkoutUrl});
          }
        } catch (error) {
          console.log(error);
        }
      } else if (indexPay == 2) {
        updatedOrder();
        // setIsLoading(false)
        // navigation.navigate('SuccessPayment')
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  console.log(item.shipper)
  const updatedOrder = async () => {
    try {
      setIsLoading(true);
      const response = await AxiosInstance().put(
        `/orders/Success-Payment/${item._id}`,
      );
      if (response.status == true) {
        navigation.navigate('SuccessPayment');
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
      const response = await AxiosInstance().patch(
        `/orders/customerCancel/${item._id}`,
      );
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
  };

  useEffect(() => {
    getPayment();
    const socket = getSocket();
    socket.on('order_status', order => {
      if (order.order._id === item._id) {
        setOrderStatus(order.status);
      }
    });
    return () => {
      socket.off('order_status');
    };
  }, [item.paymentMethod, item._id]);

  return (
    <ContainerComponent styles={{flex: 1, backgroundColor: appColor.white}}>
      <ContainerComponent styles={globalStyle.container} isScroll>
        <HeaderComponent text={'Đơn hàng chi tiết'} isback />
        {orderStatus !== 'Đang giao hàng' ? (
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
                <Image
                  style={{flex: 1}}
                  source={{
                    uri: item.shipper.image
                      ? item.shipper.image[0]
                      : 'https://res.cloudinary.com/djywo5wza/image/upload/v1729757743/clone_viiphm.png',
                  }}
                />
              </View>
              <SpaceComponent width={10} />
              <View>
                <TextComponent text={item.shipper.name} fontsize={18} />
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
              <ZegoSendCallInvitationButton
                invitees={[
                  //{userID: Order.user.phone, userName: Order.user.name},
                  {userID: item.shipper.phone, userName: item.shipper.name},
                ]}
                width={45}
                height={45}
                backgroundColor={'#EF2E2E'}
                icon={require('../../../assets/images/shipper/callicon.png')}
                borderRadius={10}
                isVideoCall={true}
                resourceID={'zego_data'}
              />
              <View style={{marginRight: 15}} />
              <ButtonComponent
                type={'link'}
                image={require('../../../assets/images/checkOrder/chat.png')}
                onPress={() => {
                  navigation.navigate('Message', {items: item});
                }}
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
            renderItem={({item}) => <OrderItem noTouch item={item} />}
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
            styles={{opacity: item.shipper ? 0.5 : 1}}
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
          <View style={{paddingHorizontal: 10}}>
            <RowComponent justifyContent={'space-between'}>
              <TextComponent text={'Tạm tính'} />
              <TextComponent text={item.totalPrice} />
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent justifyContent={'space-between'}>
              <TextComponent text={'Phí giao hàng'} />
              <TextComponent text={'50.000 đ'} />
            </RowComponent>
            <SpaceComponent height={10} />
            <RowComponent justifyContent={'space-between'}>
              <TextComponent text={'Mã giảm giá'} />
              <TextComponent text={'50.000 đ'} />
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
              text={'600.000 đ'}
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
              text={'600.000 đ'}
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
