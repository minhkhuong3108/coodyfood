import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ContainerComponent from '../../components/ContainerComponent'
import SpaceComponent from '../../components/SpaceComponent'
import RowComponent from '../../components/RowComponent'
import TextComponent from '../../components/TextComponent'
import { fontFamilies } from '../../constants/fontFamilies'
import { appColor } from '../../constants/appColor'
import { globalStyle } from '../../styles/globalStyle'
import ButtonComponent from '../../components/ButtonComponent'

const VerifyScreen = () => {
    const ref1 = useRef()
    const ref2 = useRef()
    const ref3 = useRef()
    const ref4 = useRef()

    const [codevalue, setCodeValue] = useState([])
    const [codeMain, setCodeMain] = useState('')
    const [time, setTime] = useState(60)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMess, setErrorMess] = useState('')
    console.log('codevalue', codevalue);


    useEffect(() => {
        ref1.current.focus()
    }, [])
    const handleChangeCode = (value, index) => {
        if (value.length > 0) {
            switch (index) {
                case 0:
                    ref2.current.focus()
                    break
                case 1:
                    ref3.current.focus()
                    break
                case 2:
                    ref4.current.focus()
                    break
                case 3:
                    ref4.current.blur()
                    break
            }
        }
        const data = [...codevalue]

        data[index] = value
        console.log('data', data);
        setCodeValue(data)
    }

    useEffect(() => {
        let item = ''
        codevalue.forEach(element => { item += element })
        setCodeMain(item)
    }, [codevalue])

    return (
        <ContainerComponent styles={globalStyle.container}>
            <SpaceComponent height={50} />
            <Image source={require('../../assets/images/auth/login-regis/logo.png')} />
            <SpaceComponent height={30} />
            <RowComponent>
                <TextComponent text={'Nhập '} fontsize={28} fontFamily={fontFamilies.bold} />
                <TextComponent text={'mã xác thực'} fontsize={28} color={appColor.primary} fontFamily={fontFamilies.bold} />
            </RowComponent>
            <SpaceComponent height={10} />
            <TextComponent text={'Mã xác thực đã được gửi đến email'} color={appColor.subText} />
            <SpaceComponent height={40} />
            <View style={styles.viewInput}>
                <TextInput
                    style={styles.input}
                    maxLength={1}
                    keyboardType='number-pad'
                    ref={ref1}
                    value={codevalue[0]}
                    onChangeText={text => handleChangeCode(text, 0)}
                />
                <TextInput
                    style={styles.input}
                    maxLength={1}
                    keyboardType='number-pad'
                    ref={ref2}
                    value={codevalue[1]}
                    onChangeText={text => handleChangeCode(text, 1)}
                />
                <TextInput
                    style={styles.input}
                    maxLength={1}
                    keyboardType='number-pad'
                    ref={ref3}
                    value={codevalue[2]}
                    onChangeText={text => handleChangeCode(text, 2)}
                />
                <TextInput
                    style={styles.input}
                    maxLength={1}
                    keyboardType='number-pad'
                    ref={ref4}
                    value={codevalue[3]}
                    onChangeText={text => handleChangeCode(text, 3)}
                />
            </View>
            <SpaceComponent height={40} />
            <ButtonComponent text={'Next'} color={appColor.white} />
            <SpaceComponent height={20} />
            <RowComponent justifyContent={'center'}>
                <TextComponent text={'Bạn không nhận được mã?  '} fontsize={14} />
                <ButtonComponent type={'link'} text={`Gửi lại (${time} giây)`} color={appColor.primary} fontsize={14} />
            </RowComponent>
        </ContainerComponent>
    )
}

export default VerifyScreen

const styles = StyleSheet.create({
    input: {
        width: 58,
        height: 58,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: appColor.gray,
        color: appColor.text,
        textAlign: 'center',
        fontSize: 26,
        fontFamily: fontFamilies.bold
    },
    viewInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})