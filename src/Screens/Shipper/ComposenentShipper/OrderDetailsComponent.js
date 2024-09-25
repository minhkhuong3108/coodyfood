import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {appColor} from '../../../constants/appColor';
import {appInfor} from '../../../constants/appInfor';
import TextComponent from '../../../components/TextComponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import Check from './CheckComponent';
import Info4txt from './Info4txtComponent';
import ButtonComponent from '../../../components/ButtonComponent';

const OrderDetailsComponent = props => {
  const sheetRef = useRef(null);
  const snapPoints = ['20%', '90%'];
  const [item1, setItem1] = useState(false);
  const [item2, setItem2] = useState(false);
  const [item3, setItem3] = useState(false);
  const [item4, setItem4] = useState(false);
  const Data = data;
  console.log(appInfor.sizes.height);
  const renderitem = item => {
    const {id, name, quantity, note} = item;
    return (
      <View style={styles.item}>
        <View style={styles.imgitem}>
          <Image
            style={{flex: 1}}
            source={{
              uri: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318386/Rectangle_175_xzn14n.jpg',
            }}
          />
        </View>
        <View style={styles.detail2}>
          <TextComponent
            text={'Bánh Pizza Margherita'}
            fontFamily={fontFamilies.bold}
          />
          <TextComponent
            text={'Số lượng 1'}
            styles={{maxHeight: '50%'}}
            fontsize={13}
            color={appColor.subText}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={styles.star}
              source={require('../../../assets/images/shipper/note.png')}
            />
            <TextComponent text={' ' + 'Nướng chín vừa'} fontsize={11} />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <BottomSheet ref={sheetRef} snapPoints={snapPoints} index={0}>
        <BottomSheetScrollView>
          <View style={styles.info1}>
            <View style={styles.img}>
              <Image
                style={{flex: 1}}
                source={{
                  uri: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318386/Rectangle_175_xzn14n.jpg',
                }}
              />
            </View>
            <View style={styles.detail1}>
              <TextComponent
                text={'Đồ Ăn Chay Thanh Đạm'}
                fontFamily={fontFamilies.bold}
              />
              <TextComponent
                text={
                  'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh '
                }
                styles={{maxHeight: '50%'}}
                fontsize={13}
                color={appColor.subText}
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextComponent text={'Đánh giá: ' + '4.6 '} fontsize={13} />
                <Image
                  style={styles.star}
                  source={require('../../../assets/images/shipper/star.png')}
                />
              </View>
            </View>
          </View>
          <View style={styles.info2}>
            <TextComponent
              text={'Danh sách món'}
              styles={{marginLeft: '6%'}}
              fontFamily={fontFamilies.bold}
              fontsize={20}
            />
            <FlatList
              data={Data}
              renderItem={renderitem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.flatlist}
              scrollEnabled={false}
            />
          </View>
          <View style={styles.info3}>
            <Image
              style={styles.bodership}
              source={require('../../../assets/images/shipper/Frame_11.png')}
            />
            <View style={styles.statusship}>
              <TextComponent text={'Shipper đã đến nhà hàng'} />
              <TextComponent text={'Shipper đã lấy món ăn'} />
              <TextComponent text={'Shipper đã đến nơi giao'} />
              <TextComponent text={'Đơn hàng hoàn tất'} />
            </View>
            <View style={styles.check}>
              <Check height={'6.5%'} start={true} checked={true} />
              <Check height={'8.5%'} start={true} checked={false} />
              <Check height={'10.5%'} start={false} checked={false} />
              <Check height={'12.5%'} start={false} checked={false} />
            </View>
          </View>
          <View style={styles.info4}>
            <TextComponent
              text={'Tóm tắt'}
              fontsize={20}
              fontFamily={fontFamilies.bold}
              color={appColor.primary}
            />
            <Info4txt text={'Giá tiền lấy đồ'} price={'0'} />
            <Info4txt text={'Phí giao hàng'} price={'31,500'} />
            <Info4txt text={'Thu tiền khách hàng'} price={'0'} />
            <Info4txt text={'Thu nhập'} price={'31,500'} />
          </View>
          <View style={[styles.info4, {marginTop: '4%', gap: 22}]}>
            <View style={[styles.button, {backgroundColor: appColor.primary}]}>
              <TextComponent
                text={'Đã đến nhà hàng'}
                color={appColor.white}
                fontFamily={fontFamilies.bold}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: appColor.white}]}>
              <TextComponent text={'Nhà Hàng Đóng Cửa/Hết Món'} />
            </TouchableOpacity>
            <View style={styles.customer}>
              <View style={styles.imgcustomer}>
                <Image
                  style={{flex: 1}}
                  source={{
                    uri: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318386/Rectangle_175_xzn14n.jpg',
                  }}
                />
              </View>
              <View style={styles.namecustomer}>
                <TextComponent text={'Nguyễn Thị A'} />
                <TextComponent text={'Khách hàng'} />
              </View>
              <View style={styles.callandmessboder}>
                <TouchableOpacity style={styles.callandmess}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={require('../../../assets/images/shipper/call.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.callandmess}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={require('../../../assets/images/shipper/message.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default OrderDetailsComponent;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  info1: {
    width: '86%',
    minHeight: 123,
    maxHeight: 143,
    backgroundColor: appColor.white,
    elevation: 10,
    alignSelf: 'center',
    borderRadius: 15,
    padding: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail1: {
    justifyContent: 'space-between',
    width: '70%',
  },
  detail2: {
    justifyContent: 'space-between',
    width: '80%',
    height: '90%',
  },
  img: {
    width: 87,
    aspectRatio: 1,
    borderRadius: 15,
    marginRight: '2%',
  },
  star: {width: '4%', aspectRatio: 1},
  info2: {
    marginTop: '3%',
  },
  info3: {
    flexDirection: 'row',
    paddingTop: '4%',
    paddingBottom: '4%',
    marginLeft: '6%',
    marginRight: '6%',
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
  },
  info4: {
    margin: '6%',
  },
  bodership: {
    width: '7.7%',
    height: '100%',
    resizeMode: 'contain',
  },
  statusship: {
    gap: '70%',
    marginLeft: '3%',
  },
  check: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  item: {
    width: '100%',
    minHeight: 85,
    maxHeight: 105,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: appColor.white,
    elevation: 8,
    borderRadius: 10,
    padding: '3%',
  },
  imgitem: {
    width: 65,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: '5%',
    backgroundColor: 'pink',
  },
  flatlist: {
    gap: 15,
    width: '100%',
    height: 'auto',
    paddingLeft: '6%',
    paddingRight: '6%',
    paddingBottom: '4%',
    paddingTop: '4%',
  },
  button: {
    width: '100%',
    height: 51,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  customer: {
    width: '100%',
    height: 104,
    backgroundColor: appColor.white,
    elevation: 8,
    padding: '3%',
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: appColor.gray,
  },
  namecustomer: {
    width: '60%',
    flexShrink: 2,
    justifyContent: 'center',
    gap: 5,
  },
  callandmessboder: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  callandmess: {
    width: 45,
    aspectRatio: 1,
    borderRadius: 10,
  },
  imgcustomer: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 15,
    marginRight: '2%',
  },
});
const data = [
  {
    id: 1,
    status: 'Bánh Pizza Margherita',
    quantity: 1,
    note: 'Nướng chín vừa',
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318386/Rectangle_175_xzn14n.jpg',
  },
  {
    id: 2,
    status: 'Bánh Pizza Margherita',
    quantity: 1,
    note: 'Nướng cháy khét lẹt',
    img: 'https://res.cloudinary.com/djywo5wza/image/upload/v1726318386/Rectangle_175_xzn14n.jpg',
  },
];
