import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppFormField from '../components/forms/AppFormField'
import SubmitButton from '../components/forms/SubmitButton'
import ErrorMessage from '../components/forms/ErrorMessage'

import authApi from '../api/auth'
import LoadingIndicator from '../components/LoadingIndicator'

const validationSchema = Yup.object().shape({
  code: Yup.string().required().max(6).label('Code'),
  password: Yup.string().required().min(8).label('Password'),
})

const ResetPasswordScreen = ({ navigation }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async ({ code, password }) => {
    // console.log('Values', code, password)
    setLoading(true)
    const res = await authApi.resetPassword(code, password)

    if (!res.ok) {
      setLoading(false)
      setError(res?.data?.msg)
      //   console.log('Error', res)
      return
    }

    setLoading(false)
    alert('Password Reset Successfully. Please Login Again')

    navigation.navigate('Login')
  }

  return (
    <>
      <LoadingIndicator visible={loading} />
      <View style={styles.container}>
        <AppText
          style={{ textAlign: 'center', fontSize: 25, marginVertical: 20 }}
        >
          Provide verification code sent to your email and new password
        </AppText>

        {error && <ErrorMessage error={error} visible={!loading} />}

        <Formik
          initialValues={{ code: '', password: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {() => (
            <>
              <AppFormField
                autoCapitalize='none'
                autoCorrect={false}
                icon='account-key'
                name='code'
                placeholder='Verification Code'
                placeholder='Enter code'
                maxLength={6}
              />
              <AppFormField
                autoCapitalize='none'
                autoCorrect={false}
                icon='lock'
                name='password'
                placeholder='New Password'
                secureTextEntry
                placeholder='Enter your password'
              />

              <SubmitButton title='Submit' />
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
    marginTop: 80,
  },
})

export default ResetPasswordScreen
