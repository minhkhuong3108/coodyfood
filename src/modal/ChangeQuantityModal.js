import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import SpaceComponent from '../components/SpaceComponent'
import RowComponent from '../components/RowComponent'
import ButtonComponent from '../components/ButtonComponent'
import { fontFamilies } from '../constants/fontFamilies'
import { appColor } from '../constants/appColor'
import TextComponent from '../components/TextComponent'

const ChangeQuantityModal = ({ title, onClose, visible, onPress, description, value, onChangeText }) => {
    return (
        <Modal visible={visible} transparent statusBarTranslucent onRequestClose={onClose} animationType='fade'>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.body} activeOpacity={1}>
                        <SpaceComponent height={40} />
                        <TextComponent text={title} fontsize={18} textAlign={'center'} />
                        <SpaceComponent height={20} />
                        <TextInput value={value} onChangeText={text => onChangeText(text)} style={styles.input} textAlign='center' keyboardType='numeric' />
                        <SpaceComponent height={30} />
                        <RowComponent justifyContent={'space-between'}>
                            <ButtonComponent text={'Hủy'} width={'48%'} backgroundColor={appColor.white}
                                borderColor={appColor.white}
                                height={51} onPress={onClose} />
                            <ButtonComponent text={'Xác nhận'} width={'48%'} backgroundColor={appColor.primary}
                                height={51} color={appColor.white} onPress={onPress} />
                        </RowComponent>
                        <SpaceComponent height={30} />
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default ChangeQuantityModal

const styles = StyleSheet.create({
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: appColor.subText,
        borderRadius: 5,
        alignItems: 'center',
    },
    body: {
        width: '70%',
        backgroundColor: appColor.white,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
})