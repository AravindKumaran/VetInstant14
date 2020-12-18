import React, { useState, useContext } from 'react'

import { StyleSheet, View, Alert } from 'react-native'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AuthContext from '../context/authContext'
import LoadingIndicator from '../components/LoadingIndicator'

import doctorsApi from '../api/doctors'
import hospitalsApi from '../api/hospitals'

const ChooseVetScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const checkMyVetPresence = async () => {
    setLoading(true)
    const res = await doctorsApi.getSingleDoctor(user.doctorId)
    if (!res.ok) {
      console.log(res)
      setLoading(false)
      return
    }
    if (res.data.doctor.user?.isOnline) {
      setLoading(false)
      navigation.navigate('CallVet')
    } else {
      const hosRes = await hospitalsApi.getHospitalsDoctors(user.hospitalId)
      if (!hosRes.ok) {
        setLoading(false)
        console.log(res)
        return
      }
      let msg = 'Please choose other Vet that is currently available online ?'
      if (hosRes.data.count > 0) {
        const dc = hosRes.data.doctors.find((doc) => doc.user.isOnline)
        if (dc) {
          msg = `But Doctor ${dc.user.name} from the same hospital is currently available.\n\n So, Do you want to continue with Doctor ${dc.user.name}?
          `

          Alert.alert('Info', `Your Vet is currently not online\n\n ${msg}`, [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => navigation.navigate('CallVet'),
            },
          ])
        } else {
          alert(`You Vet is currently not online.\n\n${msg}`)
        }
      }
      setLoading(false)
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
          Choose between your vet and available vets(online) to talks about your
          pets problem
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
          onPress={() => navigation.navigate('OnlineVet')}
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
