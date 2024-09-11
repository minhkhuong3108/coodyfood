import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RowComponent = ({ children, styles, justifyContent }) => {
  return (
    <View style={[styless.container, { justifyContent: justifyContent }, styles]}>
      {children}
    </View>
  )
}

export default RowComponent

const styless = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

})