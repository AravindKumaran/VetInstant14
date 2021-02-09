import React, { useState, useContext, useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AppFormField from '../components/forms/AppFormField'

import petsApi from '../api/pets'
import doctorsApi from '../api/doctors'
import usersApi from '../api/users'
import ErrorMessage from '../components/forms/ErrorMessage'
import LoadingIndicator from '../components/LoadingIndicator'
import AuthContext from '../context/authContext'
import RazorpayCheckout from 'react-native-razorpay'
import AppImageListPicker from '../components/forms/AppImageListPicker'
import * as Notifications from 'expo-notifications'

const validationSchema = Yup.object().shape({
  problems: Yup.string().max(100).required().label('Problems'),
  photo: Yup.string().nullable(),
  images: Yup.array().nullable().label('Image'),
})

const CallVetScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext)
  // console.log('Route', route.params.doc.user)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  // const [startPayment, setStartPayment] = useState(false)
  const notificationListener = useRef()
  const startPayment = useRef(null)

  const sendPushToken = async () => {
    if (route.params.doc.user.token && !startPayment.current) {
      setLoading(true)
      // const res = await usersApi.getPushToken(user.doctorId)

      // if (!res.ok) {
      //   setLoading(false)
      //   console.log('Error', res)
      //   return
      // }

      // if (res.data.token === null) {
      //   setLoading(false)
      //   return
      // }

      const pushRes = await usersApi.sendPushNotification({
        targetExpoPushToken: route.params.doc.user.token,
        title: 'Incoming Call Request from PetOwner',
        message: `Are you available for next 15-30 minutes?\n** Don't close the app from background!!`,
        datas: { token: user.token || null },
      })

      if (!pushRes.ok) {
        setLoading(false)
        console.log('Error', pushRes)
        return
      }
      setLoading(false)
    } else {
      alert('Something Went Wrong! Try again later')
    }
  }

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('REceived', notification)
        if (
          notification.request.content.data.status === 'ok' &&
          !startPayment.current
        ) {
          startPayment.current = true
          alert(`Yes I'm available. Complete the payment within 5-10 minutes`)
        } else if (
          notification.request.content.data.status === 'cancel' &&
          !startPayment.current
        ) {
          startPayment.current = null
          alert(
            `Sorry! I'm not available. Please try with other available doctors`
          )
        }
      }
    )

    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
    }
  }, [])

  const handleSubmit = async (values) => {
    if (values.videoCall) {
      sendPushToken()
      return
    }

    // if (values.videoCall) {

    //   const res = await usersApi.payDoctor({
    //     amt: route?.params?.doc.fee * 1 + 100,
    //   })
    //   if (!res.ok) {
    //     setLoading(false)
    //     console.log('Error', res)
    //   }
    //   setLoading(false)
    //   const options = {
    //     description: 'Payment For Doctor Consultation',
    //     currency: 'INR',
    //     key: 'rzp_test_GbpjxWePHidlJt',
    //     amount: res.data.result.amount,
    //     name: `${route?.params?.doc.user.name}`,
    //     order_id: res.data.result.id,
    //   }
    //   RazorpayCheckout.open(options)
    //     .then(async (data) => {
    //       setLoading(true)
    //       const verifyRes = await usersApi.verifyPayment({
    //         id: res.data.result.id,
    //         paid_id: data.razorpay_payment_id,
    //         sign: data.razorpay_signature,
    //       })
    //       if (!verifyRes.ok) {
    //         setLoading(false)
    //         console.log(verifyRes)
    //         return
    //       }
    //       const tokenRes = await usersApi.getVideoToken(user.name)
    //       // console.log('Video Token', tokenRes)
    //       if (!tokenRes.ok) {
    //         setLoading(false)
    //         console.log('Error', tokenRes)
    //       }
    //       setLoading(false)
    //       navigation.navigate('VideoCall', {
    //         docId: route?.params?.doc.user._id,
    //         userId: user._id,
    //         name: user.name,
    //         token: tokenRes.data,
    //         // token: undefined,
    //       })
    //       // setLoading(false)
    //       // alert(`Success: ${verifyRes.data.verify}`)
    //     })
    //     .catch((error) => {
    //       // handle failure
    //       console.log(error)
    //       setLoading(false)
    //       // alert(`Error: ${error.code} | ${error.description}`)
    //     })
    //   // setLoading(true)

    //   // return
    // } else if (!values.videoCall) {
    //   navigation.navigate('Chat', {
    //     doc: route?.params?.doc,
    //     pet: route?.params?.pet,
    //   })
    //   return
    // }

    // const patientData = {
    //   name: user.name,
    //   problem: values.problems,
    //   petname: route?.params?.pet.name,
    // }

    const form = new FormData()
    if (values.images) {
      values.images.forEach((image, index) => {
        form.append('images', {
          name: 'image' + index,
          type: 'image/jpeg',
          uri: image,
        })
      })
    }

    form.append('docname', route?.params?.doc.user.name)
    form.append('problem', values.problems)

    console.log('Form', form.images)
    setLoading(true)
    const res = await petsApi.savePetProblems(form, route?.params?.pet._id)

    if (!res.ok) {
      setError(res.data?.msg)
      setLoading(false)
      // console.log(res)
      return
    }

    setError(null)
    console.log('Pet Res', res.data)
    // console.log('Doc', docRes.data)
    setLoading(false)

    // const docRes = await doctorsApi.savePatientDetails(
    //   patientData,
    //   route?.params?.doc._id
    // )

    // if (!docRes.ok) {
    //   setLoading(false)
    //   console.log(res)
    //   return
    // }

    // setError(null)
    // console.log('Pet Res', res.data)
    // console.log('Doc', docRes.data)
    // setLoading(false)
  }

  return (
    <ScrollView>
      <LoadingIndicator visible={loading} />
      <View style={styles.btnWrapper}>
        <AppButton
          title='Pet History'
          btnStyle={{ marginTop: 30 }}
          onPress={() =>
            navigation.navigate('PetProblems', { id: route?.params?.pet._id })
          }
        />
        <AppButton
          title='Previous Pet Prescription'
          btnStyle={{ marginTop: 30 }}
          onPress={() =>
            navigation.navigate('PetPrescription', {
              id: route?.params?.pet._id,
            })
          }
        />
      </View>

      <View style={styles.container}>
        <AppText
          style={{ textAlign: 'center', fontSize: 20, marginVertical: 20 }}
        >
          Please Provide the problems of your pet below
        </AppText>
        <Formik
          initialValues={{
            problems: '',
            photo: null,
            videoCall: true,
            images: [],
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, setFieldValue }) => (
            <>
              <AppFormField
                label='Pet Problems'
                autoCapitalize='none'
                autoCorrect={false}
                name='problems'
                numberOfLines={3}
                placeholder='enter your pet problems'
              />

              <AppText style={{ marginVertical: 20 }}>
                Select Images (optional)
              </AppText>
              <AppImageListPicker name='images' />
              {error && <ErrorMessage visible={!loading} error={error} />}

              <View style={styles.btnContainer}>
                <AppButton
                  title='Call'
                  iconName='video'
                  btnStyle={{ width: '50%', marginRight: 10 }}
                  txtStyle={{ textAlign: 'center' }}
                  onPress={(e) => {
                    setFieldValue('videoCall', true)
                    handleSubmit(e)
                  }}
                />
                <AppButton
                  title='Chat'
                  iconName='message-circle'
                  btnStyle={{ width: '50%', marginRight: 5 }}
                  onPress={(e) => {
                    setFieldValue('videoCall', false)
                    handleSubmit(e)
                  }}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 30,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'flex-end',
  },
  btnWrapper: {
    paddingHorizontal: 40,
  },
})

export default CallVetScreen
