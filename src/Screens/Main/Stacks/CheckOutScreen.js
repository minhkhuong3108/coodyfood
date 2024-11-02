import {
  Alert,
  FlatList,
  Image,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ContainerComponent from '../../../components/ContainerComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import RowComponent from '../../../components/RowComponent';
import TextComponent from '../../../components/TextComponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import ButtonComponent from '../../../components/ButtonComponent';
import {appColor} from '../../../constants/appColor';
import SpaceComponent from '../../../components/SpaceComponent';
import {globalStyle} from '../../../styles/globalStyle';
import OrderItem from '../../../components/OrderItem';
import LineComponent from '../../../components/LineComponent';
import NoteModel from '../../../modal/NoteModel';
import AlertModel from '../../../modal/AlertModel';
import AlertChoiceModal from '../../../modal/AlertChoiceModal';
import AxiosInstance from '../../../helpers/AxiosInstance';
import axios from 'axios';
import moment from 'moment';
import crypto from 'crypto-js';
import LoadingModal from '../../../modal/LoadingModal';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {appInfor} from '../../../constants/appInfor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatPrice} from '../../../components/format/FomatPrice';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const CheckOutScreen = ({navigation, route}) => {
  const {data, sale} = route.params;
  const {user} = useSelector(state => state.login);
  const [voucher, setVoucher] = useState(0);
  const [order, setOrder] = useState();
  const [indexPay, setIndexPay] = useState(2);
  const [visible, setVisible] = useState(false);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({});
  const snapPoint = ['50%'];
  const bottomSheetRef = useRef(null);
  // console.log('indexPay', indexPay);
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  // console.log('currentAddress', currentAddress);
  // console.log('paymentMethod', paymentMethod);
  // console.log('data', data);

  const {name, _id} = data.shopOwner;
  const totalPrice = data.totalPrice;
  const total = totalPrice - voucher;

  //TEST(phí giao hàng)
  const shippingfee = '15000';
  
  const handleOpenBottomSheet = index => {
    setSelectedOrderIndex(index);
    setNote(order[index].note || '');
    bottomSheetRef.current?.expand();
  };
  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(props => (
    <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
  ));
  const handleNote = () => {
    const updatedOrder = order.map((item, index) => {
      if (index === selectedOrderIndex) {
        return {...item, note: note};
      }
      return item;
    });
    setOrder(updatedOrder);
    bottomSheetRef.current?.close();
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
        let callback_url = `coodyfood://success-payment`;
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
          callback_url,
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
        const result = await addOrder();
        const urlPayOS = 'https://api-merchant.payos.vn/v2/payment-requests';
        const body = {
          orderCode: Number(String(Date.now()).slice(-6)),
          amount: 2000,
          description: 'VQRIO123',
          items: order,
          cancelUrl: 'coodyfood://fail-payment', // URL khi thanh toán thất bại
          returnUrl: `coodyfood://success-payment?paymentMethod=PayOS&orderId=${result._id}`, // URL khi thanh toán thành công
          // "expiredAt": 1696559798,
        };

        const sortedData = `amount=${body.amount}&cancelUrl=${body.cancelUrl}&description=${body.description}&orderCode=${body.orderCode}&returnUrl=${body.returnUrl}`;

        // Checksum key từ Kênh thanh toán
        const checksumKey =
          'afbd4ad1e5f608bba26bc0dd6b0e256b7424b91d955bf3dc9f470483f05a1200'; // Thay YOUR_CHECKSUM_KEY bằng checksum key thực tế của bạn

        // Tạo chữ ký HMAC_SHA256
        const signature = crypto.HmacSHA256(sortedData, checksumKey).toString();

        try {
          const response = await axios.post(
            urlPayOS,
            {
              ...body,
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
        addOrder();
        // setIsLoading(false)
        // navigation.navigate('SuccessPayment')
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const loadCurrentAddress = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@current_address');
      if (jsonValue != null) {
        setCurrentAddress(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.log('Error loading current address:', error);
    }
  };

  const addOrder = async () => {
    const body = {
      userId: user._id,
      order: order,
      shippingAddressId: currentAddress._id,
      paymentMethod,
      shopOwner: data.shopOwner._id,
      totalPrice,
      shippingfee: shippingfee, //test
    };
    setIsLoading(true);
    try {
      const response = await AxiosInstance().post('/orders/add-order', body);
      console.log('response', response);
      if (response.status == true) {
        ToastAndroid.show('Đặt hàng thành công', ToastAndroid.SHORT);
        // navigation.navigate('Home')
        const result = response.data;
        return result;
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOrder(data.products || data.items);
  }, []);

  useEffect(() => {
    if (sale) {
      setVoucher(sale);
    }
  }, [sale]);

  useFocusEffect(
    useCallback(() => {
      loadCurrentAddress(); // Load địa chỉ hiện tại từ AsyncStorage
    }, []),
  );
  // console.log('order', order);

  return (
    <ContainerComponent styles={{flex: 1}}>
      <ContainerComponent styles={globalStyle.container} isScroll={true}>
        <HeaderComponent text="Thanh toán" isback />
        <View style={[styles.containerAddress, globalStyle.shawdow]}>
          <RowComponent justifyContent={'space-between'}>
            <TextComponent
              text={'Địa chỉ giao hàng'}
              fontsize={14}
              fontFamily={fontFamilies.bold}
            />
            <ButtonComponent
              type={'link'}
              text={'Sửa'}
              color={appColor.primary}
              fontsize={14}
              onPress={() => navigation.navigate('Address')}
            />
          </RowComponent>
          <SpaceComponent height={10} />
          <TextComponent
            text={`${currentAddress.name} | ${currentAddress.phone}`}
            fontsize={12}
          />
          <SpaceComponent height={10} />
          <TextComponent
            text={currentAddress.address}
            fontsize={12}
            width={280}
          />
        </View>
        <SpaceComponent height={15} />
        <RowComponent justifyContent={'space-between'}>
          <TextComponent
            text={'Sản phẩm'}
            fontsize={20}
            fontFamily={fontFamilies.bold}
          />
          <ButtonComponent
            width={132}
            height={30}
            borderColor={appColor.subText}
            backgroundColor={appColor.white}
            text={'Thêm voucher'}
            fontsize={11}
            onPress={() =>
              navigation.navigate('TicketSale', {
                totalPrice: data.totalPrice,
                data,
              })
            }
          />
        </RowComponent>
        <SpaceComponent height={20} />
        <RowComponent justifyContent={'space-between'}>
          <TextComponent
            text={name}
            fontsize={14}
            fontFamily={fontFamilies.bold}
          />
          <ButtonComponent
            type={'link'}
            text={'Thêm món'}
            fontsize={14}
            color={appColor.primary}
            onPress={() => navigation.navigate('Shop', {id: _id})}
          />
        </RowComponent>
        <SpaceComponent height={10} />
        {order &&
          order.map((item, index) => (
            <OrderItem
              key={index}
              item={item}
              onpress={() => handleOpenBottomSheet(index)}
              textNote={item.note}
            />
          ))}
        <LineComponent />
        <SpaceComponent height={15} />
        <TextComponent
          text={'Phương thức thanh toán'}
          fontsize={20}
          fontFamily={fontFamilies.bold}
        />
        <SpaceComponent height={15} />
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
        <SpaceComponent height={10} />
        <LineComponent />
        <SpaceComponent height={10} />
        <RowComponent justifyContent={'space-between'}>
          <TextComponent text={'Tổng cộng'} fontsize={16} />
          <TextComponent
            text={`${formatPrice(totalPrice)}`}
            fontsize={16}
            fontFamily={fontFamilies.bold}
          />
        </RowComponent>
        <SpaceComponent height={10} />
        <RowComponent justifyContent={'space-between'}>
          <TextComponent text={'Mã khuyến mãi'} fontsize={16} />
          <TextComponent
            text={formatPrice(voucher)}
            fontsize={16}
            fontFamily={fontFamilies.bold}
          />
        </RowComponent>
        <SpaceComponent height={10} />
        <RowComponent justifyContent={'space-between'}>
          <TextComponent
            text={'Phí giao hàng'}
            fontsize={16}
            color={appColor.green}
          />
          <TextComponent
            text={formatPrice(shippingfee)}
            fontsize={16}
            fontFamily={fontFamilies.bold}
            color={appColor.green}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <LineComponent />
        <SpaceComponent height={20} />
        <RowComponent justifyContent={'space-between'}>
          <TextComponent
            text={'Tổng tiền'}
            fontsize={18}
            fontFamily={fontFamilies.bold}
          />
          <TextComponent
            text={formatPrice(total)}
            fontsize={14}
            fontFamily={fontFamilies.bold}
          />
        </RowComponent>
        <SpaceComponent height={15} />
        <ButtonComponent
          text={'Đặt hàng'}
          height={60}
          color={appColor.white}
          onPress={handlePayment}
        />
        <SpaceComponent height={70} />
        {/* <AlertChoiceModal visible={visible} title={'Xác nhận'} onClose={() => setVisible(false)} /> */}
        {/* <AlertModel visible={visible} title={'Thành công'} fail onRequestClose={() => setVisible(false)}  description={'Thanh toán thành công'} /> */}
      </ContainerComponent>
      <BottomSheet
        enablePanDownToClose
        ref={bottomSheetRef}
        snapPoints={snapPoint}
        backdropComponent={renderBackdrop}
        handleComponent={null}
        index={-1}>
        <RowComponent
          styles={styles.headerBottomSheet}
          justifyContent={'space-between'}>
          <ButtonComponent
            type={'link'}
            text={'Đóng'}
            color={appColor.white}
            onPress={handleCloseBottomSheet}
          />
          <TextComponent text={'Ghi chú'} color={appColor.white} />
          <ButtonComponent
            type={'link'}
            text={'Xong'}
            color={appColor.white}
            onPress={handleNote}
          />
        </RowComponent>
        <SpaceComponent height={20} />
        <View style={{paddingHorizontal: 16}}>
          <TextComponent text={'Thêm ghi chú:'} />
          <SpaceComponent height={20} />
          <TextInput
            placeholder={'Nhập ghi chú...'}
            style={styles.inputNote}
            value={note}
            onChangeText={text => setNote(text)}
          />
        </View>
      </BottomSheet>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default CheckOutScreen;

const styles = StyleSheet.create({
  inputNote: {
    height: 140,
    borderRadius: 10,
    backgroundColor: appColor.opacity,
    paddingHorizontal: 16,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  headerBottomSheet: {
    backgroundColor: appColor.primary,
    height: 50,
    paddingHorizontal: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
  containerAddress: {
    padding: 15,
    backgroundColor: appColor.opacity,
    borderRadius: 10,
  },
});

var ORDER = [
  {
    _id: 1,
    name: 'Cơm gà',
    price: 250,
    quantity: 1,
    sold: 999,
    image: require('../../../assets/images/checkout/p1.png'),
    // note: 'Không ớt'
  },
  {
    _id: 2,
    name: 'Cơm bò',
    price: 250,
    quantity: 2,
    sold: 999,
    image: require('../../../assets/images/checkout/p1.png'),
    // note: 'Không ớt'
  },
];
