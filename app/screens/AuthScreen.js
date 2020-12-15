import React, { useState, useContext } from 'react'
import * as Google from 'expo-google-app-auth'
import { StyleSheet, View, Text } from 'react-native'

import AppButton from '../components/AppButton'

import authStorage from '../components/utils/authStorage'
import AuthContext from '../context/authContext'
import LoadingIndicator from '../components/LoadingIndicator'

import authApi from '../api/auth'
import usersApi from '../api/users'

const config = {
  // iosClientId: `<YOUR_IOS_CLIENT_ID>`,
  androidClientId:
    '320113619885-drs735a38tcvfq000k0psg7t60c8nfff.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
}

const AuthScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState()

  const { title } = route.params

  const { setUser } = useContext(AuthContext)

  const handlePress = () => {
    navigation.navigate(`${title}`)
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const result = await Google.logInAsync(config)
      if (result.type === 'success') {
        const password = result.user.id + Date.now()
        const res = await authApi.saveGoogleUser(
          result.user.name,
          result.user.email,
          password
        )
        if (!res.ok) {
          setLoading(false)
          // setError(res.data.msg);
          console.log(res)
          return
        }
        authStorage.storeToken(res.data.token)
        const userRes = await usersApi.getLoggedInUser()
        setUser(userRes.data.user)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  return (
    <>
      <LoadingIndicator visible={loading} />
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>VetInstant</Text>
          <Text style={styles.title}>{title}</Text>
        </View>

        <AppButton title='Continue with Email ID' onPress={handlePress} />

        <AppButton title='Continue with Google' onPress={signInWithGoogle} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  text: {
    fontSize: 25,
  },
  title: {
    fontSize: 22,
    alignSelf: 'center',
  },
})

export default AuthScreen
