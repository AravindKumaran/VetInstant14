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
import AppMultiSelect from '../components/forms/AppMultiSelect'

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
  { id: 1, name: 'Normal' },
  { id: 2, name: 'Not Observed' },
  { id: 3, name: 'Abnormal Colour' },
  { id: 4, name: 'Worms' },
]

const Urine = [
  { id: 1, name: 'Normal' },
  { id: 2, name: 'Abnormal Colour' },
  { id: 3, name: 'Not Observed' },
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
  { id: 1, name: 'Normal' },
  { id: 2, name: 'Abnormal Discharge' },
  { id: 3, name: 'Abnormal Odour' },
  { id: 4, name: 'Abnormal appearance' },
]

const Skin = [
  { id: 1, name: 'Normal' },
  { id: 2, name: 'Injuries' },
  { id: 3, name: 'Odour' },
  { id: 4, name: 'Hairfall' },
  { id: 5, name: 'Rough Coat' },
  { id: 6, name: 'Changes in Appearance' },
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
  eyes: Yup.string().nullable().required('Please select a eyes'),
  mucous: Yup.string().nullable().required('Please select a mucous'),
  gait: Yup.string().nullable().required('Please select a gait'),
  eyes: Yup.string().required('Please select a eyes'),

  ears: Yup.array().required().min(1).label('Ears'),
  skin: Yup.array().required().min(1).label('Skin'),
  faces: Yup.array().required().min(1).label('Faces'),
  urine: Yup.array().required().min(1).label('Urine'),
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
          `Are You Available For Next 15-30 Minutes?\n** Don't Close The App From Background`,
        datas: { token: user.token || null },
      })

      if (!pushRes.ok) {
        setLoading(false)
        console.log('Error', pushRes)
        return
      }
      setLoading(false)
    } else {
      alert('Something Went Wrong. Try Again Later')
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
          alert(`Yes I'm available. Complete The Payment Within 5-10 Minutes`)
          console.log('Start Payment', startPayment.current)
        } else if (
          notification.request.content.data.status === 'cancel' &&
          !startPayment.current
        ) {
          startPayment.current = null
          console.log('Start Payment', startPayment.current)
          alert(
            `Sorry! I'm Not Available. Please Try With Other Available Doctors`
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

    // console.log('Values', values)
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
    form.append('Eyes', values.eyes)
    form.append('Mucous', values.mucous)

    values.skin.forEach((sk) => {
      form.append('Skin', sk)
    })
    values.faces.forEach((fc) => {
      form.append('Feces', fc)
    })
    values.ears.forEach((er) => {
      form.append('Ears', er)
    })
    values.urine.forEach((ur) => {
      form.append('Urine', ur)
    })

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
        `Hello Dr. ${route.params.doc.user.name}, I Have Started The Video Call. Please Join It`
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
        "Notification Sent To Doctor. Please Wait For 2-5 Minutes For Response Before Taking Any New Action. Don't Close This S creen"
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
    <ScrollView nestedScrollEnabled={true}>
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
          Please Provide The Problems Of Your Pet Below
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
            faces: [],
            urine: [],
            eyes: '',
            mucous: '',
            ears: [],
            skin: [],
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
                placeholder='Enter Your Pet Problems'
              />

              <AppFormField
                label='For How Long Have You Noticed This Problem? (Indicate Number Of Days)'
                autoCapitalize='none'
                autoCorrect={false}
                name='time'
                numberOfLines={1}
                placeholder='Enter The Period Of The Problem'
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

              <AppMultiSelect
                items={Faces}
                label='Feces (Select All Options That Apply)'
                name='faces'
              />

              <AppMultiSelect
                items={Urine}
                label='Urine (Select All Options That Apply)'
                name='urine'
              />

              <AppFormPicker items={Eyes} label='Eyes' name='eyes' />

              <AppFormPicker
                items={Mucous}
                label='Mucous Membrane of the Eye (Gently Pull Down The EyeLid With A Finger And Note Its Colour. Choose The Most Appropriate Colour Description Below).'
                name='mucous'
              />

              <AppMultiSelect
                items={Ears}
                label='Ears (Select All Options That Apply)'
                name='ears'
              />

              <AppMultiSelect
                items={Skin}
                label='Skin And Coat (Select All Options That Apply)'
                name='skin'
              />

              <AppFormPicker items={Gait} label='Gait' name='gait' />

              <AppFormField
                label='Comments'
                autoCapitalize='none'
                autoCorrect={false}
                name='comment'
                numberOfLines={3}
                placeholder='Enter Your Comments To Clarify Your Doubts'
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
