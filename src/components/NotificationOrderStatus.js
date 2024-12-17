import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { appColor } from '../constants/appColor';


export const NotificationOrderStatus = async (order) => {
    const channelId = await notifee.createChannel({
        id: 'high-priority',
        name: 'High Priority Channel',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
    });
    await notifee.displayNotification({
        title: 'Thông báo đơn hàng',
        body: `Trạng thái đơn hàng: ${order.status}`,
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
