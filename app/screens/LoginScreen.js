import React, { useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppFormField from '../components/forms/AppFormField'
import SubmitButton from '../components/forms/SubmitButton'
import ErrorMessage from '../components/forms/ErrorMessage'
import LoadingIndicator from '../components/LoadingIndicator'

import authApi from '../api/auth'
import AuthContext from '../context/authContext'
import authStorage from '../components/utils/authStorage'

import usersApi from '../api/users'
import socket from '../components/utils/socket'

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(8).label('Password'),
})

const LoginScreen = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { setUser } = useContext(AuthContext)

  const handleSubmit = async ({ email, password }) => {
    setLoading(true)
    const res = await authApi.login(email, password)
    if (!res.ok) {
      setLoading(false)
      setError(res.data.msg)
      return
    }
    setError(null)
    authStorage.storeToken(res.data.token)
    const userRes = await usersApi.getLoggedInUser()
    if (!userRes.ok) {
      setLoading(false)
      console.log(userRes)
      return
    }
    socket.emit('online', userRes.data.user._id)
    setUser(userRes.data.user)
    setLoading(false)
  }

  return (
    <>
      <LoadingIndicator visible={loading} />
      <View style={styles.container}>
        <AppText
          style={{
            textAlign: 'center',
            marginBottom: 30,
            fontSize: 22,
            fontWeight: '500',
          }}
        >
          Login
        </AppText>

        {error && <ErrorMessage error={error} visible={!loading} />}

        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {() => (
            <>
              <AppFormField
                icon='email'
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
                name='email'
                placeholder='Enter your email id'
              />

              <AppFormField
                autoCapitalize='none'
                autoCorrect={false}
                icon='lock'
                name='password'
                placeholder='Password'
                secureTextEntry
                placeholder='Enter your password'
              />

              <SubmitButton title='Login' />
            </>
          )}
        </Formik>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 60,
  },
})

export default LoginScreen
