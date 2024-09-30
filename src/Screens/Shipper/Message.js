import {View, Text, StyleSheet, Image, FlatList, TextInput} from 'react-native';
import React from 'react';
import {appColor} from '../../constants/appColor';
import HeaderComponent from '../../components/HeaderComponent';
import TextComponent from './ComposenentShipper/TextComponent';

const Message = () => {
  const Data = data;
  const shipper = Data[0].name;
  const renderItem = ({item}) => {
    const {id, text, time, name} = item;
    return (
      <View
        style={[
          styles.chat,
          {flexDirection: name == shipper ? 'row-reverse' : 'row'},
        ]}>
        <Image
          style={styles.img}
          source={{
            uri: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318840/Rectangle_201_ltuozm.jpg',
          }}
        />
        <View
          style={[
            styles.text,
            {
              backgroundColor:
                name == shipper ? appColor.gray : appColor.primary,
            },
          ]}>
          <TextComponent
            text={text}
            fontsize={14}
            color={name == shipper ? appColor.text : appColor.white}
          />
          <TextComponent
            text={time}
            fontsize={12}
            color={name == shipper ? appColor.text : appColor.white}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent text={'Tên khách hàng'} isback={true} />
      <FlatList
        data={Data[0].chat[0].text}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatlist}
      />
      <View style={styles.input}>
        <Image
          style={[styles.icon, {width: '8%'}]}
          source={require('../../assets/images/shipper/smile.png')}
        />
        <TextInput
          style={styles.textinput}
          placeholder=" Nhập tin nhắn của bạn vào đây......."
          placeholderTextColor={appColor.subText}
          color={appColor.text}
        />
        <Image
          style={[styles.icon, {width: '14%'}]}
          source={require('../../assets/images/shipper/send.png')}
        />
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
    padding: '6%',
  },
  chat: {
    flexShrink: 1,
    gap: 10,
    justifyContent: 'flex-start',
  },
  img: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  text: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: '4%',
  },
  flatlist: {
    flex: 1,
    gap: 38,
  },
  input: {
    flex: 0.12,
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
  },
  textinput: {
    width: '78%',
    padding: '2%',
  },
});

const data = [
  {
    name: 'shippervip',
    chat: [
      {
        customer: 'Anh long',
        text: [
          {
            id: 1,
            name: 'Anh Long',
            text: 'Chào bạn, bạn có khỏe không?aaaaaaaaaaaaaaaa',
            time: '99:98',
          },
          {
            id: 2,
            name: 'shippervip',
            text: 'Mình khỏe, cảm ơn bạn! Bạn thì sao?',
            time: '99:99',
          },
          {
            id: 3,
            name: 'shippervip',
            text: 'hi?',
            time: '99:99',
          },
        ],
      },
    ],
  },
];
