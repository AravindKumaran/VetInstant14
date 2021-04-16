import React, { useState, useContext } from 'react'

import { StyleSheet, View, Alert } from 'react-native'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AuthContext from '../context/authContext'
import LoadingIndicator from '../components/LoadingIndicator'

import doctorsApi from '../api/doctors'
import hospitalsApi from '../api/hospitals'

const ChooseVetScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext)
  // console.log('Choose', route.params.pet)
  const [loading, setLoading] = useState(false)

  const checkMyVetPresence = async () => {
    setLoading(true)
    const res = await doctorsApi.getSingleDoctor(user.doctorId)
    if (!res.ok) {
      console.log(res)
      setLoading(false)
      return
    }
    if (res.data.doctor.user?.block) {
      alert('Your vet is blocked. Please choose another vet')
      setLoading(false)
      return
    }
    if (res.data.doctor.user?.isOnline) {
      setLoading(false)
      navigation.navigate('CallVet', {
        doc: res.data.doctor,
        pet: route.params.pet,
      })
    } else {
      const hosRes = await hospitalsApi.getHospitalsDoctors(user.hospitalId)
      if (!hosRes.ok) {
        setLoading(false)
        console.log('Error', hosRes)
        return
      }
      let msg = 'Please choose other Vet that is currently available online ?'
      if (hosRes.data.count > 0) {
        const dc = hosRes.data.doctors.find(
          (doc) =>
            doc.user.isOnline &&
            doc.firstAvailaibeVet &&
            doc.user.block === false
        )
        if (dc) {
          msg = `But Doctor ${dc.user.name} from the same hospital is currently available with consultation Fees of ₹${dc.fee}.\n\n So, Do you want to continue with Doctor ${dc.user.name}?
          `

          Alert.alert('Info', `Your Vet is currently not online\n\n ${msg}`, [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () =>
                navigation.navigate('CallVet', {
                  doc: dc,
                  pet: route.params.pet,
                }),
            },
          ])
        } else {
          alert(`You Vet is currently not online.\n\n${msg}`)
        }
      }
      setLoading(false)
    }
  }

  const getOnlineAvailableDoctors = async () => {
    setLoading(true)
    const res = await doctorsApi.getOnlineDoctors()
    if (!res.ok) {
      console.log(res)
      setLoading(false)
      return
    }
    console.log('Res', res.data)
    const dc = res.data.doctors.filter(
      (doc) =>
        doc.user?.isOnline === true &&
        doc.user._id !== user.doctorId &&
        doc.firstAvailaibeVet &&
        doc.user.block === false
    )
    console.log('Dc', dc[0])
    if (dc.length > 0) {
      setLoading(false)
      navigation.navigate('CallVet', { doc: dc[0], pet: route.params.pet })
    } else {
      setLoading(false)
      alert('No Vet Is Currently Available.Please Try After Few Minutes.')
    }
  }

  return (
    <>
      <LoadingIndicator visible={loading} />
      <View style={styles.container}>
        <AppText
          style={{
            textAlign: 'center',
            fontSize: 22,
            marginBottom: 50,
            marginTop: 20,
          }}
        >
          Choose Between Your Vet And Available Vets(online) To Talk About Your
          Pets Problem
        </AppText>
        <AppButton
          title='My Vet (Waiting Time - 24 hrs)'
          btnStyle={{ padding: 18, marginBottom: 20 }}
          txtStyle={{ textTransform: 'capitalize', textAlign: 'center' }}
          onPress={checkMyVetPresence}
        />
        <AppButton
          title='First Available Vet Online (Waiting Time - max. 15 mins)'
          btnStyle={{ padding: 16 }}
          txtStyle={{ textTransform: 'capitalize', textAlign: 'center' }}
          onPress={getOnlineAvailableDoctors}
        />
        <AppButton
          title='See Your Reminders'
          btnStyle={{ padding: 16 }}
          txtStyle={{ textTransform: 'capitalize', textAlign: 'center' }}
          onPress={() => navigation.navigate('Reminder')}
        />
        <AppButton
          title='Edit Pet'
          btnStyle={{ padding: 16 }}
          txtStyle={{ textTransform: 'capitalize', textAlign: 'center' }}
          onPress={() =>
            navigation.navigate('AddPet', {
              pet: route.params.pet,
              editPet: true,
            })
          }
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 50,
  },
})

export default ChooseVetScreen
