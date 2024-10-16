import ZegoUIKitPrebuiltCallService, {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoSendCallInvitationButton,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';

//call config
export const CallConfig = async (userID, userName) => {
  console.log(userID, userName);
  try {
    await ZegoUIKitPrebuiltCallService.init(
      785543570,
      'c3d0338ceef0dd5036a0aefc0a2d31818597e77598a1d3c60bed8d7d912e0b5e',
      userID,
      userName,
      [ZIM, ZPNs],
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.mp3',
          outgoingCallFileName: 'zego_incoming.mp3',
        },
        androidNotificationConfig: {
          channelID: 'ZegoUIKit',
          channelName: 'ZegoUIKit',
        },
        waitingPageConfig: {
          //backgroundColor: appColor.gray,
          avatarBuilder: invitee => {
            return (
              <View style={{width: 100, height: 100}}>
                <Image
                  style={{width: '100%', height: '100%', borderRadius: 99}}
                  resizeMode="cover"
                  source={{
                    uri: `https://res.cloudinary.com/djywo5wza/image/upload/v1726318840/Rectangle_201_ltuozm.jpg`,
                  }}
                />
              </View>
            );
          },
        },
      },
    );
    console.log('Đã bật Keepcall');
  } catch (error) {
    console.error('Khởi tạo không thành công: ' + error.message);
  }
};
