import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderComponent from '../../../components/HeaderComponent';
import TextComponent from '../../../components/TextComponent';
import {getSocket} from '../../../socket/socket';
import {appColor} from '../../../constants/appColor';

const Message = ({route}) => {
  const {items} = route.params;
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    console.log(items);
    // Kết nối socket
    const socketInstance = getSocket();
    // Lấy dữ liệu từ localStorage khi component được khởi tạo
    fetchMessages();
    // Lắng nghe socket
    socketInstance.on('receive_message', dataGot => {
      setMessageList(oldMsgs => {
        const newMsgs = [...oldMsgs, dataGot];
        setMessageList(newMsgs);
        return newMsgs;
      });
    });
  }, []);

  const fetchMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('messageList');
      if (storedMessages) {
        setMessageList(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Lỗi khi fetching messages từ AsyncStorage:', error);
    }
  };
  useEffect(() => {
    if (messageList) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messageList]);

  //gửi tin lên socket room
  const handleSend = () => {
    const socketInstance = getSocket();
    const roomID = items._id;
    if (message) {
      const data = {
        time: Date.now(),
        name: items.user.name,
        text: message,
        image: items.user.image,
      };
      //gửi tin
      socketInstance.emit('send_message', {roomID, data});
      setMessage('');
    } else {
      console.log('message trống');
    }
  };

  //item flatlist
  const renderItem = ({item}) => {
    const {text, time, name, image} = item;
    console.log(image)
    const date = new Date(time);
    return (
      <View
        style={[
          styles.chat,
          {flexDirection: name == items.user.name ? 'row-reverse' : 'row'},
        ]}>
        <View style={styles.imgitem}>
          <Image
            style={{flex: 1}}
            source={{
              uri:
                image && image.length > 1
                  ? image
                  : 'https://res.cloudinary.com/djywo5wza/image/upload/v1729757743/clone_viiphm.png',
            }}
          />
        </View>
        <View
          style={[
            styles.text,
            {
              backgroundColor:
                name == items.user.name ? appColor.gray : appColor.primary,
            },
          ]}>
          <TextComponent
            text={text}
            fontsize={14}
            color={name == items.user.name ? appColor.text : appColor.white}
          />
          <TextComponent
            text={date.getHours() + ':' + date.getMinutes()}
            fontsize={12}
            color={name == items.user.name ? appColor.text : appColor.white}
          />
        </View>
      </View>
    );
  };
  //
  return (
    <View style={styles.container}>
      <HeaderComponent text={items.shipper.name} isback={true} />
      <FlatList
        ref={flatListRef}
        data={messageList}
        renderItem={renderItem}
        keyExtractor={item => item.time}
      />
      <View style={styles.input}>
        <TextInput
          style={styles.textinput}
          value={message}
          onChangeText={text => {
            setMessage(text);
          }}
          placeholder=" Nhập tin nhắn của bạn vào đây......."
          placeholderTextColor={appColor.subText}
          color={appColor.text}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.icon, {width: '14%'}]}
          onPress={() => {
            handleSend();
          }}>
          <Image
            style={{width: '60%', resizeMode: 'contain'}}
            source={require('../../../assets/images/shipper/send.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Message;
const styles = StyleSheet.create({
  container: {
    paddingTop: '12%',
    flex: 1,
    backgroundColor: appColor.white,
    paddingLeft: '6%',
    paddingRight: '6%',
    paddingBottom: '3%',
  },
  chat: {
    flexShrink: 1,
    gap: 10,
    justifyContent: 'flex-start',
    marginBottom: '5%',
  },
  text: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: '4%',
  },
  flatlist: {
    flex: 1,
    gap: 38,
    backgroundColor: 'pink',
  },
  input: {
    height: 70,
    borderTopWidth: 1,
    borderColor: appColor.input,
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2%',
  },
  icon: {
    flexGrow: 1,
    aspectRatio: 1,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput: {
    width: '78%',
    padding: '2%',
  },
  imgitem: {
    width: 55,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: appColor.gray,
    overflow: 'hidden',
  },
});
