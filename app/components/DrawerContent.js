import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer'

import { Feather } from '@expo/vector-icons'

import AppText from './AppText'

const DrawerContent = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rounded}>
          <Feather name='user' size={35} color='blue' />
        </View>
        <AppText style={{ marginBottom: 20 }}>Avinash</AppText>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        label='Logout'
        icon={({ color, size }) => (
          <Feather name='log-out' color={color} size={size} />
        )}
        onPress={() => console.log('Logout')}
        style={styles.footer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: 10,
    marginVertical: 20,
  },
  footer: {
    marginLeft: 60,
  },
  header: {
    marginTop: 50,
    borderBottomWidth: 1,
    padding: 10,
    borderBottomColor: '#D1D5DA',
    alignItems: 'center',
  },
  rounded: {
    backgroundColor: '#f1f1f1',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginBottom: 10,
  },
})

export default DrawerContent
