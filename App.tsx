import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './src/Redux/Store'
import AppNavigation from './src/navigators/AppNavigation'
import MapScreen from './src/Screens/Main/Stacks/MapScreen'
import TestScreen from './src/Screens/Main/Stacks/TestScreen'
import ZaloPay from './src/utils/ZaloPay'
import { connectSocket, getSocket } from './src/socket/socket'
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { appColor } from './src/constants/appColor'
import { CallConfig, UnmountCall } from './src/Screens/Call/Callconfig'



// interface Order {
//   order: {
//     id: string;
//     status: string;
//     user: {
//       _id: string;
//       phone: string;
//       name: string;
//     };
//     shipper?: {
//       image: string[];
//     };
//   };
//   status: string;
//   // Các thuộc tính khác của đơn hàng
// }


const App = () => {
  // useEffect(() => {
  //   // Kết nối socket khi ứng dụng khởi động
  //   connectSocket();
  //   const socketInstance = getSocket();
  //   console.log('get');

  //   socketInstance.on('connect', () => {
  //     console.log('Socket connected');
  //   });


  //   notifee.requestPermission()
  //   // Lắng nghe sự kiện thay đổi trạng thái đơn hàng
  //   socketInstance.on('order_status', async (order: Order) => {
  //     console.log('Order status updated:', order)
  //     if (order.status == 'Tài xế đang đến nhà hàng') {
  //       CallConfig(order.order.user.phone, order.order.user.name, order.order.shipper?.image[0] ?? null)
  //     }
  //     if (order.order.user._id == user._id) {
  //       if (order.status == 'Tài xế đang đến nhà hàng') {
  //         UnmountCall();
  //         CallConfig(order.order.user.phone, order.order.user.name, order.order.shipper?.image[0] ?? null)
  //       }
  //       const channelId = await notifee.createChannel({
  //         id: 'high-priority',
  //         name: 'High Priority Channel',
  //         importance: AndroidImportance.HIGH,
  //         visibility: AndroidVisibility.PUBLIC,
  //       });
  //       await notifee.displayNotification({
  //         title: 'Thông báo đơn hàng',
  //         body: `Trạng thái đơn hàng: ${order.status}`,
  //         android: {
  //           channelId,
  //           smallIcon: 'ic_small_icon', // optional, defaults to 'ic_launcher'.
  //           color: appColor.primary,
  //           // pressAction is needed if you want the notification to open the app when pressed
  //           pressAction: {
  //             id: 'default',
  //           },
  //         },
  //       });
  //     }
  //   });
  // }, []);
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StatusBar barStyle="dark-content" backgroundColor='transparent' translucent />
          <AppNavigation />
        </PersistGate>
      </Provider>

    </>

  )
}

// const RootApp = () => (
//   <Provider store={store}>
//     <PersistGate persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>
// );

export default App

const styles = StyleSheet.create({})