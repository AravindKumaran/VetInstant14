import React, { useState, useEffect } from 'react'

import { StyleSheet, View, Image } from 'react-native'
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
            {petsProblems.map((pb, index) => (
              <View key={pb._id} style={styles.card}>
                <AppText>Problem: {pb.problem}</AppText>
                <AppText>Doctor name: {pb.docname}</AppText>
                <AppText>Time Period: {pb.time}</AppText>
                <AppText>Appetite: {pb.Appetite}</AppText>
                <AppText>Behaviour: {pb.Behaviour}</AppText>
                <AppText>Ears: {pb.Ears}</AppText>
                <AppText>Eyes: {pb.Eyes}</AppText>
                <AppText>Faces: {pb.Feces}</AppText>
                <AppText>Gait: {pb.Gait}</AppText>
                <AppText>Mucous: {pb.Mucous}</AppText>
                <AppText>Skin: {pb.Skin}</AppText>
                <AppText>Urine: {pb.Urine}</AppText>
                <AppText>Comment: {pb.comment}</AppText>
                {pb.images.length > 0 && <AppText>Pet Problem image</AppText>}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {pb.images.length > 0 &&
                    pb.images.map((img, i) => (
                      <>
                        <Image
                          key={i + img}
                          source={{
                            uri: `http://192.168.43.242:8000/${img}`,
                          }}
                          // source={{
                          //   uri: `https://vetinstantbe.azurewebsites.net/api/v1/${img}`,
                          // }}
                          style={{
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                            marginHorizontal: 5,
                          }}
                        />
                      </>
                    ))}
                </ScrollView>
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
