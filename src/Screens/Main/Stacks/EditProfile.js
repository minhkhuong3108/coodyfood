import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContainerComponent from '../../../components/ContainerComponent';
import {appColor} from '../../../constants/appColor';
import {appInfor} from '../../../constants/appInfor';
import InputIn4 from '../../../components/Profile/InputIn4';
import TextComponent from '../../../components/TextComponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import DateTimePicker from '@react-native-community/datetimepicker';
import ButtonComponent from '../../../components/ButtonComponent';
import {handleChangeText, validateEmail, validatePhone} from '../../../utils/Validators';
import HeaderComponent from '../../../components/HeaderComponent';
import {globalStyle} from '../../../styles/globalStyle';
import {useDispatch, useSelector} from 'react-redux';
import {updateProfile} from '../../../Redux/API/UserAPI';
import LoadingModal from '../../../modal/LoadingModal';
import SelectImage from '../../../components/SelectImage';
import {uploadImageToCloudinary} from '../../../components/UploadImage';

const EditProfile = ({navigation}) => {
  const {user, status, error} = useSelector(state => state.login);
  const [name, setName] = useState(user.name ?? null);
  const [email, setEmail] = useState(user.email ?? null);
  const [phone, setPhone] = useState(user.phone ?? null);
  const [avatar, setAvatar] = useState(user.image ?? null);
  const [correct, setCorrect] = useState(true);
  const [date, setDate] = useState(user.date ?? null);
  const [showPicker, setshowPicker] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [imagePath, setImagePath] = useState(null); //nhận ảnh khi vừa chọn từ thư viện or chụp
  const [isSheetOpen, setIsSheetOpen] = useState(false); //quản lí state khi nhấn vào avatar để chọn ảnh

  //set tạm thời ảnh đại diện
  useEffect(() => {
    if (imagePath) {
      setAvatar(imagePath.uri);
      console.log(avatar);
    }
  }, [imagePath]);

  //hàm xử lí khi DateTimePicker đc bật
  const handleDateChange = (event, selectedDate) => {
    if (event.type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);
    }
    setshowPicker(false);
  };

  //update
  const handleUpdate = async () => {
    const data = {
      data: {
        name,
        email,
        phone,
        image: await uploadImageToCloudinary(imagePath),
      },
      id: user._id,
    };
    try {
      dispatch(updateProfile(data));
      setHasUpdated(true);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (!name || !email || !phone || !validatePhone(phone)) {
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

  useEffect(() => {
    if (hasUpdated) {
      if (status === 'loading') {
        setIsLoading(true);
      } else if (status === 'success') {
        setIsLoading(false);
        ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
        navigation.goBack();
      } else if (status === 'failed') {
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
          <TouchableOpacity
            style={{flexDirection: 'row-reverse'}}
            onPress={() => {
              setIsSheetOpen(true);
            }}>
            <Image
              style={styles.camera}
              source={require('../../../assets/images/profile/camera.png')}
            />
            <View style={styles.boximg}>
              <Image
                style={{flex: 1}}
                source={{
                  uri: avatar,
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
            editable={false}
            opacity={0.5}
          />
          <InputIn4
            text={'Số điện thoại'}
            value={phone ? handleChangeText(phone) : phone}
            onChangeText={text => {
              setPhone(text);
            }}
            error={phone ? checkPhone(handleChangeText(phone)) : 'Đây là thông tin bắt buộc'}
            keyboardType={"numeric"}
          />
          <View style={{paddingBottom: '5%'}}>
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
          styles={{opacity: correct ? 1 : 0.5}}
          onPress={handleUpdate}
        />
      </View>
      <LoadingModal visible={isLoading} />
      {isSheetOpen && (
        <SelectImage
          setImagePath={setImagePath}
          setIsSheetOpen={setIsSheetOpen}
        />
      )}
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
    width: appInfor.sizes.width * 0.26,
    aspectRatio: 1,
    borderRadius: 99,
    overflow: 'hidden',
  },
  camera: {
    position: 'absolute',
    zIndex: 1,
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
