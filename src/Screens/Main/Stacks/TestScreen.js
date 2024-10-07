import React, { useState } from 'react';
import { Button, Alert, View, TextInput, NativeModules } from 'react-native';
import ZaloPay from '../../../utils/ZaloPay';
import ContainerComponent from '../../../components/ContainerComponent';
import AxiosInstance from '../../../helpers/AxiosInstance';
import { appColor } from '../../../constants/appColor';

const TestScreen = () => {
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', }}>
      <TextInput
        placeholder="Enter amount"
        value={money}
        onChangeText={setMoney}
      />
      <Button title="Pay" onPress={handlePayment} />
    </View>
  );
};

export default TestScreen;