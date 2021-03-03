import React, { useState, useContext, useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AppFormField from '../components/forms/AppFormField'

import petsApi from '../api/pets'
import doctorsApi from '../api/doctors'
import roomsApi from '../api/rooms'
import usersApi from '../api/users'
import ErrorMessage from '../components/forms/ErrorMessage'
import LoadingIndicator from '../components/LoadingIndicator'
import AuthContext from '../context/authContext'
import RazorpayCheckout from 'react-native-razorpay'
import AppImageListPicker from '../components/forms/AppImageListPicker'
import * as Notifications from 'expo-notifications'

import AppFormPicker from '../components/forms/AppFormPicker'
// import Selected from '../components/utils/select'
// import Select from 'react-select'

const Appetite = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Not Observed', value: 'Not Observed' },
  { label: 'Different from Normal', value: 'Different from Normal' },
]

const Behaviour = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Not Observed', value: 'Not Observed' },
  { label: 'Different from Normal', value: 'Different from Normal' },
]

const Activity = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Not Observed', value: 'Not Observed' },
  { label: 'Different from Normal', value: 'Different from Normal' },
]

const Faces = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Not Observed', value: 'Not Observed' },
  { label: 'Abnormal Colour', value: 'Abnormal Colour' },
  { label: 'Worms', value: 'Worms' },
]

const Urine = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Not Observed', value: 'Not Observed' },
  { label: 'Abnormal Colour', value: 'Abnormal Colour' },
]

const Eyes = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Abnormal Discharge', value: 'Abnormal Discharge' },
]

const Mucous = [
  { label: ' White', value: 'White' },
  { label: ' Pink-White', value: 'Pink-White' },
  { label: ' Pink', value: 'Pink' },
  { label: ' Red-Pink', value: 'Red-Pink' },
  { label: ' Red', value: 'Red' },
  { label: ' Dark Red', value: 'Dark Red' },
  { label: ' Yellow', value: 'Yellow' },
]

const Ears = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Abnormal Discharge', value: 'Abnormal Discharge' },
  { label: 'Abnormal Odour', value: 'Abnormal Odour' },
  { label: 'Abnormal appearance', value: 'Abnormal appearance' },
]

const Skin = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Injuries', value: 'Injuries' },
  { label: 'Odour', value: 'Odour' },
  { label: 'Hairfall', value: 'Hairfall' },
  { label: 'Rough Coat', value: 'Rough Coat' },
  { label: 'Changes in Appearance', value: 'Changes in Appearance' },
]

const Gait = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Not Observed', value: 'Not Observed' },
  { label: 'Different from Normal', value: 'Different from Normal' },
]

const validationSchema = Yup.object().shape({
  problems: Yup.string().max(100).required().label('Problems'),
  photo: Yup.string().nullable(),
  images: Yup.array().nullable().label('Image'),
  time: Yup.number().required().label('Time'),
  comment: Yup.string().required('Please enter comment'),
  appetite: Yup.string().nullable().required('Please select a appetite'),
  behaviour: Yup.string().nullable().required('Please select a behaviour'),
  activity: Yup.string().nullable().required('Please select a activity'),
  faces: Yup.string().nullable().required('Please select a faces'),
  urine: Yup.string().nullable().required('Please select a urine'),
  eyes: Yup.string().nullable().required('Please select a eyes'),
  mucous: Yup.string().nullable().required('Please select a mucous'),
  ears: Yup.string().nullable().required('Please select a ears'),
  eyes: Yup.string().nullable().required('Please select a eyes'),
  skin: Yup.string().nullable().required('Please select a skin'),
  gait: Yup.string().nullable().required('Please select a gait'),
})

const CallVetScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext)
  // console.log('Route', +route.params.doc.fee === 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const notificationListener = useRef()
  const startPayment = useRef()

  const sendPushToken = async (message) => {
    if (route.params.doc.user.token && !startPayment.current) {
      setLoading(true)

      const pushRes = await usersApi.sendPushNotification({
        targetExpoPushToken: route.params.doc.user.token,
        title: `Incoming Call Request from ${user.name}`,
        message:
          message ||
          `Are you available for next 15-30 minutes?\n** Don't close the app from background!!`,
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
        console.log('REceived', notification.request.content.data)
        if (
          notification.request.content.data.status === 'ok' &&
          !startPayment.current
        ) {
          startPayment.current = true
          alert(`Yes I'm available. Complete the payment within 5-10 minutes`)
          console.log('Start Payment', startPayment.current)
        } else if (
          notification.request.content.data.status === 'cancel' &&
          !startPayment.current
        ) {
          startPayment.current = null
          console.log('Start Payment', startPayment.current)
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

  const savePatientProblems = async (values) => {
    // const patientData = {
    //   name: user.name,
    //   problem: values.problems,
    //   petname: route?.params?.pet.name,
    //   time: values.time,
    //   Appetite: values.Appetite,
    //   Behaviour: values.Behaviour,
    //   Feces: values.Faces,
    //   Urine: values.Urine,
    //   Eyes: values.Eyes,
    //   Mucous: values.Mucous,
    //   Ears: values.Ears,
    //   Skin: values.Skin,
    //   Gait: values.Gait,
    //   comment: values.comment,
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
    form.append('time', values.time)
    form.append('Appetite', values.appetite)
    form.append('Behaviour', values.behaviour)
    form.append('Feces', values.faces)
    form.append('Urine', values.urine)
    form.append('Eyes', values.eyes)
    form.append('Mucous', values.mucous)
    form.append('Ears', values.ears)
    form.append('Skin', values.skin)
    form.append('Gait', values.gait)
    form.append('comment', values.comment)
    // console.log('Form', form.images)
    setLoading(true)
    const res = await petsApi.savePetProblems(form, route?.params?.pet._id)
    if (!res.ok) {
      setError(res.data?.msg)
      setLoading(false)
      // console.log(res)
      return
    }
    setError(null)
    // console.log('Pet Res', res.data)
    setLoading(false)
    // console.log('Doc', docRes.data)
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

  const handleSubmit = async (values) => {
    if (values.videoCall && +route.params.doc.fee === 0) {
      const roomRes = await roomsApi.createRoom({
        name: `${user._id}-${route.params?.doc?.user?._id}`,
        senderName: user.name,
        receiverId: route.params?.doc?.user?._id,
        petId: route.params?.pet._id,
      })
      if (!roomRes.ok) {
        console.log(roomRes)
        setLoading(false)
        return
      }
      const tokenRes = await usersApi.getVideoToken({
        userName: user.name,
        roomName: roomRes.data.room.name,
      })
      // console.log('Video Token', tokenRes)
      if (!tokenRes.ok) {
        setLoading(false)
        console.log('Error', tokenRes)
      }
      setLoading(false)
      await savePatientProblems(values)
      sendPushToken(
        `Hello Dr. ${route.params.doc.user.name}, I have started the video call. Please join it`
      )
      navigation.navigate('VideoCall', {
        docId: route?.params?.doc.user._id,
        userId: user._id,
        name: user.name,
        token: tokenRes.data,
      })
    } else if (values.videoCall && !startPayment.current) {
      sendPushToken()
      alert(
        "Notification send to doctor! Please wait for 2-5 minutes for response before taking any new action. Don't close this screen"
      )
    } else if (values.videoCall && startPayment.current) {
      startPayment.current = null
      const res = await usersApi.payDoctor({
        amt: route?.params?.doc.fee * 1 + 100,
      })
      if (!res.ok) {
        setLoading(false)
        console.log('Error', res)
      }
      setLoading(false)
      const options = {
        description: 'Payment For Doctor Consultation',
        currency: 'INR',
        key: 'rzp_test_GbpjxWePHidlJt',
        amount: res.data.result.amount,
        name: `${route?.params?.doc.user.name}`,
        order_id: res.data.result.id,
      }
      RazorpayCheckout.open(options)
        .then(async (data) => {
          setLoading(true)
          const verifyRes = await usersApi.verifyPayment({
            id: res.data.result.id,
            paid_id: data.razorpay_payment_id,
            sign: data.razorpay_signature,
          })
          if (!verifyRes.ok) {
            setLoading(false)
            console.log(verifyRes)
            return
          }
          const roomRes = await roomsApi.createRoom({
            name: `${user._id}-${route.params?.doc?.user?._id}`,
            senderName: user.name,
            receiverId: route.params?.doc?.user?._id,
            petId: route.params?.pet._id,
          })
          if (!roomRes.ok) {
            console.log(roomRes)
            setLoading(false)
            return
          }
          const tokenRes = await usersApi.getVideoToken({
            userName: user.name,
            roomName: roomRes.data.room.name,
          })
          console.log('Video Token', tokenRes)
          if (!tokenRes.ok) {
            setLoading(false)
            console.log('Error', tokenRes)
          }
          setLoading(false)
          await savePatientProblems(values)
          sendPushToken(
            'I have completed the payment.Please join the video call'
          )
          navigation.navigate('VideoCall', {
            docId: route?.params?.doc.user._id,
            userId: user._id,
            name: user.name,
            token: tokenRes.data,
          })
          // setLoading(false)
          // alert(`Success: ${verifyRes.data.verify}`)
        })
        .catch((error) => {
          // handle failure
          console.log(error)
          setLoading(false)
          // alert(`Error: ${error.code} | ${error.description}`)
        })
      // setLoading(true)

      // return
    } else if (!values.videoCall) {
      await savePatientProblems(values)
      // console.log('Clikccc')
      navigation.navigate('Chat', {
        doc: route?.params?.doc,
        pet: route?.params?.pet,
      })
    }
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
            time: '',
            comment: '',
            appetite: '',
            behaviour: '',
            activity: '',
            faces: '',
            urine: '',
            eyes: '',
            mucous: '',
            ears: '',
            skin: '',
            gait: '',
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

              <AppFormField
                label='For how long have you noticed this problem? (Indicate number of days)'
                autoCapitalize='none'
                autoCorrect={false}
                name='time'
                numberOfLines={1}
                placeholder='enter the period of the problem'
              />

              <AppFormPicker
                items={Appetite}
                label='Appetite'
                name='appetite'
              />

              <AppFormPicker
                items={Behaviour}
                label='General Behaviour'
                name='behaviour'
              />

              <AppFormPicker
                items={Activity}
                label='Activity'
                name='activity'
              />

              <AppFormPicker
                items={Faces}
                label='Faces (Select all options that apply)'
                name='faces'
              />

              <AppFormPicker
                items={Urine}
                label='Urine (Select all options that apply)'
                name='urine'
              />

              <AppFormPicker items={Eyes} label='Eyes' name='eyes' />

              <AppFormPicker
                items={Mucous}
                label='Mucous Membrane of the Eye'
                name='mucous'
              />

              <AppFormPicker
                items={Ears}
                label='Ears (Select all options that apply)'
                name='ears'
              />

              <AppFormPicker
                items={Skin}
                label='Skin and Coat (Select all options that apply)'
                name='skin'
              />

              <AppFormPicker items={Gait} label='Gait' name='gait' />

              <AppFormField
                label='Comments'
                autoCapitalize='none'
                autoCorrect={false}
                name='comment'
                numberOfLines={3}
                placeholder='enter your comments to clarify your doubts'
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
                  txtStyle={{ textAlign: 'center', width: '-100%' }}
                  onPress={(e) => {
                    setFieldValue('videoCall', true)
                    handleSubmit(e)
                  }}
                />
                <AppButton
                  title='Chat'
                  iconName='message-circle'
                  btnStyle={{ width: '50%', marginRight: 5 }}
                  txtStyle={{ textAlign: 'center', width: '-100%' }}
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
