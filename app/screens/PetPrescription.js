import React, { useState, useEffect } from 'react'

import { Image, StyleSheet, View } from 'react-native'
import AppText from '../components/AppText'

import petsApi from '../api/pets'
import { ScrollView } from 'react-native-gesture-handler'
import LoadingIndicator from '../components/LoadingIndicator'

const PetPrescriptionScreen = ({ route }) => {
  const [petPrescriptions, setPetPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    const getPetPrescriptions = async () => {
      setLoading(true)
      const res = await petsApi.getSinglePet(route?.params?.id)
      if (!res.ok) {
        setError(res.data.msg)
        setLoading(false)
        console.log(res)
        return
      }
      setError(null)
      console.log('ResPEt', res.data.exPet.prescriptions)
      setPetPrescriptions(res.data.exPet.prescriptions)
      setLoading(false)
    }

    getPetPrescriptions()
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        <LoadingIndicator visible={loading} />
        {petPrescriptions.length === 0 ? (
          <AppText style={{ textAlign: 'center' }}>
            No Prescriptions Found
          </AppText>
        ) : (
          <>
            {petPrescriptions.map((pbm, index) => (
              <View key={index} style={styles.card}>
                <AppText>Prescription: {pbm.prescription}</AppText>
                <AppText>Doctor Name: {pbm.docname}</AppText>
                <AppText>
                  Date: {new Date(pbm.date).toLocaleDateString()}
                </AppText>
                <AppText>
                  Time: {new Date(pbm.date).toLocaleTimeString()}
                </AppText>
                {pbm.img && (
                  <>
                    <AppText>Prescription Image:</AppText>
                    <Image
                      // source={{
                      //   uri: `http://192.168.43.242:8000/img/${pbm.img}`,
                      // }}
                      source={{
                        uri: `https://vetinstantbe.azurewebsites.net/img/${pbm.img}`,
                      }}
                      style={{ width: 150, height: 150, borderRadius: 75 }}
                    />
                  </>
                )}
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 20,
    borderRadius: 5,
  },
})

export default PetPrescriptionScreen
