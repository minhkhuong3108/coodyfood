/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';

AppRegistry.registerComponent(appName, () => App);

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.PRESS) {
        // Handle the press action
        console.log('Notification press action received:', pressAction.id);
        // You can navigate to a specific screen or perform any other action here
    }
});
