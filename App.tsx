import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './src/Redux/Store'
import AppNavigation from './src/navigators/AppNavigation'
import MapScreen from './src/Screens/Main/Stacks/MapScreen'
import TestScreen from './src/Screens/Main/Stacks/TestScreen'
import ZaloPay from './src/utils/ZaloPay'
import { connectSocket, getSocket } from './src/socket/socket'
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { appColor } from './src/constants/appColor'

interface Order {
  order: {
    id: string;
    status: string;
  };
  // Các thuộc tính khác của đơn hàng
}

const App = () => {
  useEffect(() => {
    // Kết nối socket khi ứng dụng khởi động
    connectSocket();

    const socketInstance = getSocket();
    console.log('get');

    socketInstance.on('connect', () => {
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    notifee.requestPermission()
    // Lắng nghe sự kiện thay đổi trạng thái đơn hàng
    socketInstance.on('order_status', async (order: Order) => {
      console.log('Order status updated:', order);
      const channelId = await notifee.createChannel({
        id: 'high-priority',
        name: 'High Priority Channel',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      });
      await notifee.displayNotification({
        title: 'Thông báo đơn hàng',
        body: `Trạng thái đơn hàng: ${order.order.status}`,
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
    });


    return () => {
      socketInstance.off('order_status');
    };
  }, []);
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StatusBar barStyle="dark-content" backgroundColor='transparent' translucent />
          <AppNavigation />
          {/* <MapScreen /> */}
          {/* <ZaloPay /> */}
          {/* <TestScreen /> */}
        </PersistGate>
      </Provider>

    </>

  )
}

export default App

const styles = StyleSheet.create({})