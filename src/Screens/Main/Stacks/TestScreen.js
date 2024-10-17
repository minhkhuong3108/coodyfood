import React, { useEffect, useState } from 'react';
import { Button, Alert, View, TextInput, NativeModules, Linking } from 'react-native';
import ZaloPay from '../../../utils/ZaloPay';
import ContainerComponent from '../../../components/ContainerComponent';
import AxiosInstance from '../../../helpers/AxiosInstance';
import { appColor } from '../../../constants/appColor';
import notifee, { AndroidImportance, AndroidVisibility, EventType } from '@notifee/react-native';
import axios from 'axios';
import crypto from 'crypto-js'
import WebView from 'react-native-webview';
import SpaceComponent from '../../../components/SpaceComponent';


const TestScreen = ({ navigation }) => {
  const [token, setToken] = useState('');
  // const handlePay = async () => {
  //   try {
  //     const amount = 100000; // Số tiền thanh toán
  //     const description = 'Thanh toán đơn hàng';
  //     const order = await ZaloPay.createOrder(amount, description);

  //     // Gọi SDK ZaloPay để thực hiện thanh toán
  //     ZaloPay.payOrder(order.zptranstoken);

  //     Alert.alert('Order created', `Order ID: ${order.app_trans_id}`);
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to create order');
  //   }
  // };

  // return (
  //   <View style={{flex:1,justifyContent:'center'}}>
  //     <Button title="Pay with ZaloPay" onPress={handlePay} />
  //   </View>
  // );
  const [money, setMoney] = useState('');
  const [returncode, setReturnCode] = useState('');


  const handlePayment = async () => {
    try {
      const response = await AxiosInstance().post('/orders/order-zalopay', { money });
      // Handle response from server
      console.log('response', response.data);
      const result = response.data;
      setToken(result.zp_trans_token)
      setReturnCode(result.return_code)
      if (returncode === 1) {
        const ZaloPay = NativeModules.PayZaloBridge;
        ZaloPay.payOrder(token)
      } else {
        Alert.alert('Error', 'Failed  to create order');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [status, setStatus] = useState(0)
  const handlePushNotification = async () => {
    notifee.requestPermission()
    const channelId = await notifee.createChannel({
      id: 'high-priority',
      name: 'High Priority Channel',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });

    if (status == 1) {
      await notifee.displayNotification({
        id: '123',
        title: 'Thông báo',
        body: 'Shipper đã nhận đơn hàng của bạn',
        android: {
          channelId,
          smallIcon: 'ic_small_icon', // optional, defaults to 'ic_launcher'.
          color: appColor.primary,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
        },
      });
    } else if (status == 2) {
      await notifee.displayNotification({
        id: '123',
        title: 'Thông báo',
        body: 'Shipper đã giao hàng thành công',
        android: {
          channelId,
          smallIcon: 'ic_small_icon', // optional, defaults to 'ic_launcher'.
          color: appColor.primary,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  }

  const [checkoutUrl, setCheckoutUrl] = useState('');

  const urlPayOS = 'https://api-merchant.payos.vn/v2/payment-requests'

  const handlePayOS = async () => {
    const data = {
      "orderCode": 1,
      "amount": 1,
      "description": "VQRIO123",
      "buyerName": "Nguyen Van A",
      "buyerEmail": "buyer-email@gmail.com",
      "buyerPhone": "090xxxxxxx",
      "buyerAddress": "số nhà, đường, phường, tỉnh hoặc thành phố",
      "items": [
        {
          "name": "Iphone",
          "quantity": 2,
          "price": 28000000
        }
      ],
      "cancelUrl": "coodyfood://app/notify", // URL khi thanh toán thất bại
      "returnUrl": "coodyfood://app/home",
      // "expiredAt": 1696559798,
      "signature": "string"
    }

    const sortedData = `amount=${data.amount}&cancelUrl=${data.cancelUrl}&description=${data.description}&orderCode=${data.orderCode}&returnUrl=${data.returnUrl}`;

    // Checksum key từ Kênh thanh toán
    const checksumKey = 'afbd4ad1e5f608bba26bc0dd6b0e256b7424b91d955bf3dc9f470483f05a1200'; // Thay YOUR_CHECKSUM_KEY bằng checksum key thực tế của bạn

    // Tạo chữ ký HMAC_SHA256
    const signature = crypto.HmacSHA256(sortedData, checksumKey).toString();

    try {
      const response = await axios.post(urlPayOS, {
        ...data,
        signature
      },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-client-id': 'd5aadfd7-2a34-43e0-9cbb-e580f986f144',
            'x-api-key': 'd3e8013a-1db0-429a-9159-36c152d26782'
          }
        }

      )
      console.log('response', response.data);


    } catch (error) {
      console.log(error);

    }
  }


  return (
    <View style={{ flex: 1, justifyContent: 'center', }}>
      <SpaceComponent height={50} />
      {/* <TextInput
        placeholder="Enter amount"
        value={money}
        onChangeText={setMoney}
      /> */}
      {/* <Button title="Pay" onPress={handlePayment} /> */}
      {/* <Button title="Push Notification" onPress={handlePushNotification} />
      <Button title="Shipper nhận đơn" onPress={() => setStatus(1)} />
      <Button title="Shipper giao hàng" onPress={() => setStatus(2)} /> */}
      <Button title="PayOS" onPress={() => Linking.openURL('coodyfood://product')} />

      <WebView source={{ uri: 'https://pay.payos.vn/web/8b94aa93e80a49cd8f5f25dcd4c2b9e9' }} />

    </View>
  );
};

export default TestScreen;