import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ContainerComponent from '../../../components/ContainerComponent';
import { appColor } from '../../../constants/appColor';
import { appInfor } from '../../../constants/appInfor';
import InputIn4 from '../../../components/Profile/InputIn4';
import TextComponent from '../../../components/TextComponent';
import { fontFamilies } from '../../../constants/fontFamilies';
import DateTimePicker from '@react-native-community/datetimepicker';
import ButtonComponent from '../../../components/ButtonComponent';
import { validateEmail, validatePhone } from '../../../utils/Validators';
import HeaderComponent from '../../../components/HeaderComponent';
import { globalStyle } from '../../../styles/globalStyle';
import { useDispatch, useSelector } from 'react-redux';
import AxiosInstance from '../../../helpers/AxiosInstance';
import { updateProfile } from '../../../Redux/API/UserAPI';
import LoadingModal from '../../../modal/LoadingModal';

const EditProfile = ({ navigation }) => {
  const { user, status, error } = useSelector(state => state.login);
  const [name, setName] = useState(user.name ?? null);
  const [email, setEmail] = useState(user.email ?? null);
  const [phone, setPhone] = useState(user.phone ?? null);
  const [correct, setCorrect] = useState(true);
  const [date, setDate] = useState(user.date ?? null);
  const [showPicker, setshowPicker] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  //hàm xử lí khi DateTimePicker đc bật
  const handleDateChange = (event, selectedDate) => {
    if (event.type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);
    }
    setshowPicker(false);
  };
  useEffect(() => {
    if (!name || !email || !phone) {
      setCorrect(false);
    } else {
      setCorrect(true);
    }
  }, [name, email, phone, date]);

  //check phone
  const checkPhone = data => {
    return validatePhone(data) ? null : 'Số điện thoại không hợp lệ';
  };
  //check email
  const checkEmail = data => {
    return validateEmail(data) ? null : 'Email không hợp lệ';
  };

  const handleUpdate = () => {
    const data =
    {
      data: {
        name,
        email,
        phone,
      },
      id: user._id
    }
    try {
      dispatch(updateProfile(data));
      setHasUpdated(true);
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    if (hasUpdated) {
      if (status === 'loading') {
        setIsLoading(true);
      }
      else if (status === 'success') {
        setIsLoading(false);
        ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
        navigation.goBack();
      }
      else if (status === 'failed') {
        setIsLoading(false);
        ToastAndroid.show('Cập nhật thất bại', ToastAndroid.SHORT);
      }
    }
  }, [status, error, hasUpdated]);
  return (
    <ContainerComponent styles={globalStyle.container}>
      <HeaderComponent text={'Chỉnh sửa hồ sơ'} isback={true} />
      {/*avatar*/}
      <ScrollView scrollEnabled={false}>
        <View style={styles.body1}>
          <TouchableOpacity style={{ flexDirection: 'row-reverse' }}>
            <Image
              style={styles.camera}
              source={require('../../../assets/images/profile/camera.png')}
            />
            <View style={styles.boximg}>
              <Image
                style={{ flex: 1 }}
                source={{
                  uri: user.image,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/*họ tên -> địa chỉ*/}
        <View style={styles.body2}>
          <InputIn4
            text={'Họ và tên'}
            value={name}
            onChangeText={text => {
              setName(text);
            }}
            error={name ? null : 'Đây là thông tin bắt buộc'}
          />
          <InputIn4
            text={'Email'}
            value={email}
            onChangeText={text => {
              setEmail(text);
            }}
            error={email ? checkEmail(email) : 'Đây là thông tin bắt buộc'}
          />
          <InputIn4
            text={'Số điện thoại'}
            value={phone}
            onChangeText={text => {
              setPhone(text);
            }}
            error={phone ? checkPhone(phone) : 'Đây là thông tin bắt buộc'}
          />
          <View style={{ paddingBottom: '5%' }}>
            <TextComponent text={'Ngày sinh'} fontFamily={fontFamilies.bold} />
            <TouchableOpacity
              onPress={() => {
                setshowPicker(true);
              }}
              style={styles.inputdate}
              activeOpacity={0.5}>
              <TextComponent
                fontFamily={fontFamilies.regular}
                fontsize={14}
                text={date ? date.toLocaleDateString('vi-VN') : '--/--/----'}
              />
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                mode={'date'}
                value={date || new Date()}
                onChange={handleDateChange}
              />
            )}
          </View>
        </View>
      </ScrollView>
      {/*nút cập nhật*/}
      <View style={styles.footer}>
        <ButtonComponent
          text={'Cập nhật'}
          color={appColor.white}
          styles={{ opacity: correct ? 1 : 0.5 }}
          onPress={handleUpdate}
        />
      </View>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  body1: {
    alignItems: 'center',
    padding: '3%',
    paddingBottom: '2%',
  },
  boximg: {
    width: appInfor.sizes.width * 0.2,
    aspectRatio: 1,
    borderRadius: 99,
    overflow: 'hidden',
  },
  camera: {
    position: 'absolute',
    zIndex: 1,
    right: '-2%',
    resizeMode: 'contain',
    width: '8%',
  },
  body2: {
    paddingTop: '5%',
  },
  inputdate: {
    borderBottomWidth: 1,
    borderColor: '#CED7DF',
    paddingTop: '4%',
    paddingBottom: '4%',
  },
  footer: {
    padding: '2%',
  },
});
