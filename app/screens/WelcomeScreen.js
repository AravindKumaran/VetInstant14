import React from 'react'
import { StyleSheet, View } from 'react-native'

import AppButton from '../components/AppButton'
import AppText from '../components/AppText'

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AppText>VetInstant</AppText>
      <AppButton
        title='Signup'
        onPress={() => navigation.navigate('Auth', { title: 'Register' })}
      />
      <AppButton
        title='Login'
        onPress={() => navigation.navigate('Auth', { title: 'Login' })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
})

export default WelcomeScreen
