import React, { useState, useEffect } from 'react'

import { StyleSheet, View } from 'react-native'
import AppText from '../components/AppText'

import petsApi from '../api/pets'
import { ScrollView } from 'react-native-gesture-handler'
import LoadingIndicator from '../components/LoadingIndicator'

const PetProblemScreen = ({ route }) => {
  const [petsProblems, setPetProblems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    const getPetProblems = async () => {
      setLoading(true)
      const res = await petsApi.getSinglePet(route?.params?.id)
      if (!res.ok) {
        setError(res.data.msg)
        setLoading(false)
        console.log(res)
        return
      }
      setError(null)
      setPetProblems(res.data.exPet.problems)
      setLoading(false)
    }

    getPetProblems()
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        <LoadingIndicator visible={loading} />
        {petsProblems.length === 0 ? (
          <AppText style={{ textAlign: 'center' }}>No Problems Found!</AppText>
        ) : (
          <>
            {petsProblems.map((pbm, index) => (
              <View key={index} style={styles.card}>
                <AppText>Problem: {pbm.problem}</AppText>
                <AppText>Doctor name: {pbm.docname}</AppText>
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

export default PetProblemScreen
