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
          <AppText style={{ textAlign: 'center' }}>No Problems Found</AppText>
        ) : (
          <>
            {petsProblems.map((pb, index) => (
              <View key={pb._id} style={styles.card}>
                <AppText>Problem: {pb.problem}</AppText>
                <AppText>Doctor name: {pb.docname}</AppText>
                <AppText>Time Period: {pb.time}</AppText>
                <AppText>Appetite: {pb.Appetite}</AppText>
                <AppText>Behaviour: {pb.Behaviour}</AppText>
                <AppText>Eyes: {pb.Eyes}</AppText>
                <AppText>Gait: {pb.Gait}</AppText>
                <AppText>Mucous: {pb.Mucous}</AppText>
                <AppText>Comment: {pb.comment}</AppText>
                {pb.Ears?.length > 0 && (
                  <AppText style={{ fontSize: 22 }}>Ears: </AppText>
                )}

                {pb.Ears?.length > 0 &&
                  pb.Ears.map((er, i) => (
                    <AppText key={`${i}-Ears`}> {er}</AppText>
                  ))}

                {pb.Feces?.length > 0 && (
                  <AppText style={{ fontSize: 22 }}>Faces: </AppText>
                )}

                {pb.Feces?.length > 0 &&
                  pb.Feces.map((fc, i) => (
                    <AppText key={`Feces ${i}`}> {fc}</AppText>
                  ))}
                {pb.Urine?.length > 0 && (
                  <AppText style={{ fontSize: 22 }}>Urines: </AppText>
                )}

                {pb.Urine?.length > 0 &&
                  pb.Urine.map((ur, i) => (
                    <AppText key={`Urines ${i}`}> {ur}</AppText>
                  ))}
                {pb.Skin?.length > 0 && (
                  <AppText style={{ fontSize: 22 }}>Skins: </AppText>
                )}

                {pb.Skin?.length > 0 &&
                  pb.Skin.map((sk, i) => (
                    <AppText key={`Skins ${i}`}> {sk}</AppText>
                  ))}

                {pb.images?.length > 0 && <AppText>Pet Problem image</AppText>}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {pb.images?.length > 0 &&
                    pb.images.map((img, i) => (
                      <>
                        <Image
                          key={i + img}
                          source={{
                            uri: `http://192.168.29.239:8000/${img}`,
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
