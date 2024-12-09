import {View, Button} from 'react-native';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { appColor } from '../constants/appColor';

export const showNotification = async () => {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'notitication',
    name: 'Notification Channel',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Thông báo',
    body: 'Bạn có tin nhắn từ tài xế',
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
};
