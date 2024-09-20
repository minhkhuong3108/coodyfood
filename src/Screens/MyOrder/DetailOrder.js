import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import ContainerComponent from '../../components/ContainerComponent';
import Header from '../../components/HeaderComponent';
import {appColor} from '../../constants/appColor';
import {appInfor} from '../../constants/appInfor';
import TextComponent from '../../components/TextComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import FromToComponent from '../../components/MyOrder/FromToComponent';
import {FlatList} from 'react-native-gesture-handler';
import OrderSummaryItem from '../../components/MyOrder/OrderSummaryItem';
import ButtonComponent from '../../components/ButtonComponent';
import {useRoute} from '@react-navigation/native';
import HeaderComponent from '../../components/HeaderComponent';
import { globalStyle } from '../../styles/globalStyle';

const DetailOrder = () => {
  const route = useRoute(); // Sử dụng useRoute để lấy route
  const {orderData} = route.params; // Lấy orderData từ params
  const renderItem = ({item}) => {
    //renderitem_flatlist
    const {id, count, name, price} = item;
    return (
      <View style={styles.ordersummary}>
        <View style={{flexDirection: 'row', gap: 35}}>
          <TextComponent text={count} />
          <TextComponent text={name} />
        </View>
        <TextComponent text={price} />
      </View>
    );
  };
  return (
    <ContainerComponent styles={globalStyle.container}>
      {/* header chi tiet */}
      <HeaderComponent isback={true} text={'Chi tiết đơn hàng'} />
      {/* header body */}
      <View >
        {/* ảnh_tên quán_ ngày đặt*/}
        <View style={styles.nameimgdate}>
          {/*ảnh*/}
          <View>
            <View style={styles.img}>
              <Image style={{flex: 1}} source={{uri: orderData.img}} />
            </View>
          </View>
          {/*đặt hàng lúc + thời gian*/}
          <View style={styles.namedate}>
            <TextComponent
              text={orderData.name}
              fontFamily={fontFamilies.bold}
              styles={styles.name}
            />
            <View>
              <TextComponent text={'Đã đặt hàng lúc: '} fontsize={14} />
              <TextComponent
                text={orderData.date}
                color={appColor.lightgray}
                fontsize={12}
              />
            </View>
          </View>
        </View>
        {/*từ nhà hàng đến nơi nhận hàng*/}
        <View style={[styles.fromto, {gap: appInfor.sizes.height * 0.03}]}>
          <FromToComponent
            text1={'Từ '}
            color={appColor.bluee}
            text2={': ' + 'abc'}
          />
          <FromToComponent
            text1={'Đến '}
            color={appColor.primary}
            text2={': ' + 'abc'}
          />
        </View>
        {/*tóm tắt đơn hàng*/}
        <View
          style={[styles.fromto, {marginBottom: appInfor.sizes.width * 0.04}]}>
          <TextComponent
            text={'Tóm tắt đơn hàng'}
            fontFamily={fontFamilies.bold}
          />
          <FlatList
            data={orderData.order}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{paddingBottom: '5%'}}
          />
          <OrderSummaryItem title={'Tổng tạm tính: '} price={'111đ'} />
          <OrderSummaryItem title={'Phí giao hàng: '} price={'111đ'} />
        </View>
        <OrderSummaryItem title={'Tổng cộng: '} price={'222đ'} isbold={true} />
      </View>
      {/*nút đặt lại món*/}
      <View style={styles.footer}>
        <ButtonComponent text={'Đặt lại món'} color={appColor.white} />
      </View>
    </ContainerComponent>
  );
};

export default DetailOrder;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.white,
  },
  img: {
    width: appInfor.sizes.width * 0.215,
    height: appInfor.sizes.height * 0.1,
    borderRadius: 10,
  },
  // body: {
  //   margin: appInfor.sizes.width * 0.05,
  // },
  name: {
    width: '94%',
  },
  namedate: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameimgdate: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    paddingBottom: '5%',
    gap: 15,
    borderColor: '#CED7DF',
  },
  fromto: {
    paddingTop: appInfor.sizes.width * 0.04,
    paddingBottom: appInfor.sizes.width * 0.04,
    borderBottomWidth: 0.5,
    borderColor: '#CED7DF',
  },
  ordersummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '3%',
  },
  footer: {
    margin: appInfor.sizes.width * 0.05,
    flex: 1,
    justifyContent: 'flex-end',
  },
});
