import { Image, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TextComponent from '../components/TextComponent'
import { fontFamilies } from '../constants/fontFamilies'
import SpaceComponent from '../components/SpaceComponent'
import ButtonComponent from '../components/ButtonComponent'
import { appColor } from '../constants/appColor'

const AlertNoChoiceModal = ({ title, description, visible, onPress, noImg }) => {
    return (
        <Modal visible={visible} transparent statusBarTranslucent animationType='fade'>
            <View style={styles.container}>
                <View style={styles.body}>
                    <TextComponent text={title} fontsize={22} />
                    <SpaceComponent height={20} />
                    {!noImg && <View>
                        <Image source={require('../assets/images/alert/success.png')} />
                        <SpaceComponent height={20} />
                    </View>
                    }
                    <TextComponent text={description} fontsize={14} textAlign={'center'} color={appColor.subText} />
                    <SpaceComponent height={20} />
                    <ButtonComponent text={'Đồng ý'} onPress={onPress} width={100} height={50} color={appColor.white} />
                </View>
            </View>
        </Modal>
    )
}

export default AlertNoChoiceModal

const styles = StyleSheet.create({
    body: {
        width: '80%',
        backgroundColor: appColor.white,
        paddingVertical: 25,
        alignItems: 'center',
        zIndex: 1,
        borderRadius: 10,
        paddingHorizontal: 24,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
})