import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import TextComponent from '../components/TextComponent'
import ButtonComponent from '../components/ButtonComponent'
import { appColor } from '../constants/appColor'
import RowComponent from '../components/RowComponent'
import SpaceComponent from '../components/SpaceComponent'
import { fontFamilies } from '../constants/fontFamilies'

const AlertChoiceModal = ({ title, onClose, visible, onPress, description }) => {
    return (
        <Modal visible={visible} transparent statusBarTranslucent onRequestClose={onClose} animationType='fade'>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.body} activeOpacity={1}>
                        <TextComponent text={title} fontsize={22} fontFamily={fontFamilies.bold} textAlign={'center'} />
                        <SpaceComponent height={20} />
                        <TextComponent text={description} fontsize={18}  textAlign={'center'} />
                        <SpaceComponent height={30} />
                        <RowComponent justifyContent={'space-between'}>
                            <ButtonComponent text={'Hủy'} width={'48%'} backgroundColor={appColor.white}
                                borderColor={appColor.white}
                                height={51} onPress={onClose} />
                            <ButtonComponent text={'Xác nhận'} width={'48%'} backgroundColor={appColor.primary}
                                height={51} color={appColor.white} onPress={onPress} />
                        </RowComponent>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default AlertChoiceModal

const styles = StyleSheet.create({
    body: {
        width: '85%',
        backgroundColor: appColor.white,
        paddingHorizontal: 20,
        // alignItems: 'center',
        justifyContent: 'center',
        height: 250
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
})