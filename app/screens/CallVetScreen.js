import React, { useState, useContext, useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AppFormField from '../components/forms/AppFormField'

import petsApi from '../api/pets'
import doctorsApi from '../api/doctors'
import pendingsApi from '../api/callPending'
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
import socket from '../components/utils/socket'

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
  // console.log('Route', route.params.doc)
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const sendPushToken = async (title, message) => {
    if (route?.params.doc?.user?.token) {
      setLoading(true)

      const pushRes = await usersApi.sendPushNotification({
        targetExpoPushToken: route.params.doc.user.token,
        title: `Incoming ${title ? title : 'CaLL'} Request from ${user.name}`,
        message: message || `Open the pending calls page for further action`,
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

  // const sendWebPushToken = async (title, message) => {
  //   if (route.params.doc.user?.webToken) {
  //     setLoading(true)

  //     const pushRes = await usersApi.sendWebPushNotification({
  //       webToken: route.params.doc.user.webToken,
  //       title: `Incoming ${title ? title : 'Call'} Request from ${user.name}`,
  //       body: message || `Open the pending calls page for further action`,
  //     })

  //     if (!pushRes.ok) {
  //       setLoading(false)
  //       console.log('Error', pushRes)
  //       return
  //     }
  //     // console.log('PushRes', pushRes)
  //     setLoading(false)
  //   } else {
  //     alert('Something Went Wrong. Try Again Later')
  //   }
  // }

  const savePatientProblems = async (values) => {
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
  }

  const handleSubmit = async (values) => {
    if (values.videoCall) {
      sendPushToken()
      // sendWebPushToken()
      // socket.emit('videoCall', {
      //   token: user.token,
      //   docId: route.params?.doc?.user?._id,
      //   paymentDone: false,
      //   name: user.name,
      // })

      const penData = {
        // webToken: route.params?.doc?.user?.webToken,
        docId: route.params?.doc?.user?._id,
        docName: route.params?.doc?.user?.name,
        docFee: route?.params?.doc.fee * 1,
        hospId:
          route?.params?.doc?.hospital?._id ||
          route?.params?.doc?.user?.hospitalId,
        paymentDone: false,
        userName: user.name,
        userId: user._id,
        petId: route.params?.pet._id,
        status: 'requested',
        docMobToken: route.params?.doc?.user?.token,
        userMobToken: user.token,
      }
      setLoading(true)
      await savePatientProblems(values)
      const penRes = await pendingsApi.saveCallPending(penData)
      if (!penRes.ok) {
        setLoading(false)
        console.log('Error', penRes)
      }
      setLoading(false)
      alert(
        'Notification Sent To Doctor. Please go to pending calls screen for further action'
      )
      navigation.navigate('Home')
    } else if (!values.videoCall) {
      sendPushToken('chat', 'I have started the chat.Please join')
      await savePatientProblems(values)
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
                keyboardType='numeric'
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
                  title='Request Call'
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
              {/* <AppButton
                  title='Make Payment'
                  iconName='dollar-sign'
                  btnStyle={{ width: '60%', marginRight: 5, alignSelf: 'center'}}
                  txtStyle={{ textAlign: 'center', width: '-100%' }}
                  onPress={(e) => {
                    setFieldValue('videoCall', false)
                    handleSubmit(e)
                  }}
                /> */}
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
