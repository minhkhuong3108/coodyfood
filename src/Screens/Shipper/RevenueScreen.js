import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import ContainerComponent from '../../components/ContainerComponent';
import HeaderComponent from '../../components/HeaderComponent';
import {globalStyle} from '../../styles/globalStyle';
import {Dropdown} from 'react-native-element-dropdown';
import {appColor} from '../../constants/appColor';
import {fontFamilies} from '../../constants/fontFamilies';
import TextComponent from '../../components/TextComponent';
import Info4txtComponent from './ComposenentShipper/Info4txtComponent';

const RevenueScreen = () => {
  const [value, setValue] = useState(null);
  const date = [
    {label: 'Theo ngày', value: '1'},
    {label: 'Theo tuần', value: '2'},
    {label: 'Theo tháng', value: '3'},
    {label: 'Tuỳ chọn ngày', value: '4'},
  ];

  return (
    <ContainerComponent styles={globalStyle.container}>
      <HeaderComponent text={'Doanh thu'} isback />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        iconStyle={{tintColor: 'white'}}
        data={date}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={date[0].label}
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
      />
      <View style={styles.revenue}>
        <View style={styles.boxed}>
          <View style={styles.wallanddate}>
            <Image
              style={styles.img}
              source={require('../../assets/images/shipper/wallet.png')}
            />
            <TextComponent
              text={'29/8/2024'}
              fontsize={18}
              fontFamily={fontFamilies.bold}
            />
          </View>
          <Info4txtComponent
            color1={appColor.subText}
            fontsize={14}
            text={'Số đơn:'}
            price={999999999999}
          />
          <Info4txtComponent
            color1={appColor.subText}
            fontsize={14}
            text={'Tổng thu nhập:'}
            price={999999999999 + ' đ'}
          />
          <Info4txtComponent
            color1={appColor.subText}
            fontsize={14}
            text={'Nhận tiền mặt:'}
            price={999999999999 + ' đ'}
          />
          <Info4txtComponent
            color1={appColor.subText}
            fontsize={14}
            text={'Nhận vào app:'}
            price={999999999999 + ' đ'}
          />
        </View>
      </View>
    </ContainerComponent>
  );
};

export default RevenueScreen;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: appColor.primary,
    padding: 13,
    width: '38%',
    borderRadius: 10,
  },
  placeholder: {
    fontFamily: fontFamilies.bold,
    color: appColor.white,
  },
  revenue: {
    marginTop: '4%',
    flexShrink: 1,
    height: 212,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: appColor.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxed: {
    width: '83%',
    height: 175,
    borderWidth: 1,
    backgroundColor: appColor.white,
    borderColor: appColor.gray,
    elevation: 8,
    borderRadius: 20,
    paddingLeft: '4%',
    paddingRight: '4%',
  },
  img: {
    flexShrink: 0.3,
    flexGrow: 0.2,
    resizeMode: 'contain',
    marginRight: 12,
  },
  wallanddate: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
