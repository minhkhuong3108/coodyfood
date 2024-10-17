import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import WebView from 'react-native-webview'
import LoadingModal from '../../../modal/LoadingModal'

const PayOSPaymentScreen = ({ navigation, route }) => {
  const { checkoutUrl } = route.params
  return (
    <View style={{flex:1}}>
      <WebView source={{ uri: checkoutUrl }} />
    </View>
  )
}

export default PayOSPaymentScreen

const styles = StyleSheet.create({})