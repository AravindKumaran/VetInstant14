import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AuthContext from '../context/authContext'

import hospitalsApi from '../api/hospitals'
import doctorsApi from '../api/doctors'
import LoadingIndicator from '../components/LoadingIndicator'

const MyVetScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext)

  const { hospitalId, doctorId } = user

  const [docDetail, setDocDetail] = useState()
  const [hospDetail, setHospDetail] = useState()
  const [loading, setLoading] = useState(false)

  const getDoctorAndHospital = async (hospitalId, doctorId) => {
    setLoading(true)
    const hospRes = await hospitalsApi.getSingleHospital(hospitalId)

    if (!hospRes.ok) {
      setLoading(false)
      console.log(hospRes)
      return
    }

    const docRes = await doctorsApi.getSingleDoctor(doctorId)
    if (!docRes.ok) {
      setLoading(false)
      console.log(docRes)
      return
    }

    setDocDetail(docRes.data.doctor)
    setHospDetail(hospRes.data.hospital)
    setLoading(false)
  }

  useEffect(() => {
    if (hospitalId) {
      getDoctorAndHospital(hospitalId, doctorId)
    }
  }, [hospitalId, doctorId])

  return (
    <>
      {loading ? (
        <LoadingIndicator visible={loading} />
      ) : (
        <View style={styles.container}>
          {docDetail && hospDetail ? (
            <>
              <View style={styles.card}>
                <AppText style={{ fontSize: 14, color: '#606770' }}>
                  Hospital Name :
                </AppText>
                <AppText>{hospDetail.name}</AppText>
              </View>
              <View style={styles.card}>
                <AppText style={{ fontSize: 14, color: '#606770' }}>
                  Doctor Name :
                </AppText>
                <AppText>{docDetail.user.name}</AppText>
              </View>
              <AppButton
                title='Change Vet'
                onPress={() =>
                  navigation.navigate('SaveVet', {
                    hosp: hospDetail,
                    doc: docDetail,
                    title: 'Edit Vet Details',
                  })
                }
              />
            </>
          ) : (
            <>
              <AppText style={{ fontSize: 22, marginVertical: 30 }}>
                You haven't added any vet
              </AppText>
              <AppButton
                title='Add Vet'
                onPress={() => navigation.navigate('SaveVet')}
              />
            </>
          )}
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 15,
    marginBottom: 20,
    width: '100%',
  },
})

export default MyVetScreen
