import AsyncStorage from "@react-native-async-storage/async-storage";

export const Removemess = async () => {
  try {
    await AsyncStorage.removeItem('messageList');
    console.log('Đã xoá AsyncStorage tin nhắn!');
  } catch (error) {
    console.error('Lỗi khi xoá AsyncStorage tin nhắn:', error);
  }
};
