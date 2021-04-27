import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native'

import { MaterialIcons, Feather } from '@expo/vector-icons'
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc'

import AppText from '../components/AppText'
import callLogsApi from '../api/callLog'
import LoadingIndicator from '../components/LoadingIndicator'

import pendingsApi from '../api/callPending'
import RBSheet from 'react-native-raw-bottom-sheet'
import petsApi from '../api/pets'

import AppButton from '../components/AppButton'
import AuthContext from '../context/authContext'

const VideoCallScreen = ({ navigation, route }) => {
  const { user, docId, userId } = route.params
  // console.log('Routtt', route)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [status, setStatus] = useState('disconnected')
  const [participants, setParticipants] = useState(new Map())
  const [videoTracks, setVideoTracks] = useState(new Map())
  const [token, setToken] = useState(route.params?.token)
  const [waitingTime, setWaitingTime] = useState(20)
  const [logId, setLogId] = useState()
  const timeRef = useRef(null)
  const twilioVideo = useRef(null)
  const { user: username } = useContext(AuthContext)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [previousProblem, setPreviousProblem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pet, setPet] = useState(null)
  const refRBSheet = useRef()

  const startTimer = () => {
    timeRef.current = setInterval(() => {
      setWaitingTime((time) => {
        if (time >= 1) return time - 1

        resetTimer()
        return 0
      })
    }, 1000)
  }

  const resetTimer = () => {
    clearInterval(timeRef.current)
    timeRef.current = null
    setWaitingTime(0)
  }

  const handleDeleteCall = async () => {
    const callRes = await pendingsApi.singleCallPending(route.params?.item._id)
    if (callRes.ok) {
      const call = callRes.data.call
      call.userJoined && call.docJoined
        ? await pendingsApi.deleteCallPending(call._id)
        : await pendingsApi.updateCallPending(call._id, {
            userJoined: false,
          })
    }
  }

  useEffect(() => {
    console.log('Inside Effect', token)

    const _onConnectButtonPress = async () => {
      // console.log(token)
      if (Platform.OS === 'android') {
        await _requestAudioPermission()
        await _requestCameraPermission()
      }

      const cRes = await pendingsApi.updateCallPending(route.params?.item._id, {
        userJoined: true,
      })
      if (!cRes.ok) {
        navigation.goBack()
        return
      }
      twilioVideo.current.connect({
        accessToken: token,
        // enableNetworkQualityReporting: true,
      })
      setStatus('connecting')
      if (videoTracks.size === 0) {
        startTimer()
      }

      console.log('Connecting')
    }
    _onConnectButtonPress()

    return () => {
      console.log('Outside Effect')
      clearInterval(timeRef.current)
      // handleDeleteCall()
      twilioVideo.current.disconnect()
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Home' }],
      // })
    }
  }, [])

  useEffect(() => {
    const saveCallLog = async () => {
      setLoading(true)
      const res = await callLogsApi.saveCallLog({
        senderId: userId,
        receiverId: docId,
      })
      if (!res.ok) {
        setLoading(false)
        console.log('Log Resss', res)
        return
      }
      setLogId(res.data.log._id)
      setLoading(false)
    }
    saveCallLog()
  }, [])

  const _onEndButtonPress = () => {
    clearInterval(timeRef.current)
    // handleDeleteCall()
    twilioVideo.current.disconnect()
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Home' }],
    // })

    navigation.goBack()
  }

  const _onMuteButtonPress = () => {
    twilioVideo.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled))
  }

  const _onVideoButtonPress = () => {
    twilioVideo.current
      .setLocalVideoEnabled(!isVideoEnabled)
      .then((isEnabled) => setIsVideoEnabled(isEnabled))
  }

  const _onFlipButtonPress = () => {
    twilioVideo.current.flipCamera()
  }

  const _onRoomDidConnect = (events) => {
    // console.log(events)
    console.log('Room')
    setStatus('connected')
  }

  const _onRoomDidDisconnect = ({ error }) => {
    console.log('ERROR: ', error)

    setStatus('disconnected')
  }

  const _onRoomDidFailToConnect = (error) => {
    console.log('ERROR: ', error)

    setStatus('disconnected')
  }

  const _onParticipantAddedVideoTrack = async ({ participant, track }) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track)
    clearInterval(timeRef.current)
    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ])
    )

    setLoading(true)
    const logRes = await callLogsApi.updateCallLog(logId)
    if (!logRes.ok) {
      setLoading(false)
      console.log('Log Resss', res)
      return
    }
    setLoading(false)
  }

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track)
    resetTimer()
    const videoTracks = new Map(videoTracks)
    videoTracks.delete(track.trackSid)

    setVideoTracks(videoTracks)
  }

  const _onNetworkLevelChanged = ({ participant, isLocalUser, quality }) => {
    console.log(
      'Participant',
      participant,
      'isLocalUser',
      isLocalUser,
      'quality',
      quality
    )
  }

  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Need permission to access microphone',
        message:
          'To run this demo we need permission to access your microphone',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    )
  }

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Need permission to access camera',
      message: 'To run this demo we need permission to access your camera',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    })
  }

  const getPetDetails = async () => {
    const id = route?.params?.item.petId
    const docName = route?.params?.item.docName
    setPet(null)
    refRBSheet.current.open()
    setLoading(true)
    const petRes = await petsApi.getSinglePet(id)
    if (!petRes.ok) {
      console.log('Error', petRes)
      alert('Pet Not Found!')
      setPet(null)
      setLoading(false)
      refRBSheet.current.close()
      return
    }
    setLoading(false)
    setPet(petRes.data.exPet)
    if (petRes.data.exPet.problems?.length > 0) {
      const allProb = petRes.data.exPet.problems.reverse()
      const curProbIndex = allProb.findIndex((prob) => prob.docname === docName)
      if (curProbIndex !== -1) {
        const cur = allProb[curProbIndex]
        setCurrentProblem(cur)
        allProb.splice(curProbIndex, 1)
        setPreviousProblem(allProb)
      } else {
        setPreviousProblem(allProb)
      }
    }
  }

  return (
    <View style={styles.container}>
      {loading && <LoadingIndicator visible={loading} />}
      <RBSheet
        ref={refRBSheet}
        height={Dimensions.get('window').height - 150}
        animationType='fade'
        closeOnDragDown={false}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,.6)',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            backgroundColor: '#fff',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
          },
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginHorizontal: 20,
            marginBottom: 10,
          }}
        >
          {loading && <LoadingIndicator visible={loading} />}
          <AppText
            style={{
              fontSize: 24,
              fontWeight: '500',
              marginVertical: 20,
              textAlign: 'center',
            }}
          >
            Pet Details :-
          </AppText>
          {pet && (
            <>
              <View style={styles.card2}>
                <AppText>
                  Date: {new Date(pet.createdAt).toLocaleDateString()}
                </AppText>
                <AppText>
                  Time: {new Date(pet.createdAt).toLocaleTimeString()}
                </AppText>
                <AppText>Weight: {pet.weight} Kg</AppText>
                <AppText>
                  Age: {pet.years !== 0 && `${pet.years} years`}{' '}
                  {pet.months !== 0 && `${pet.months} months`}
                </AppText>
                <AppText>Gender: {pet.gender} </AppText>
                <AppText>Breed: {pet.breed} </AppText>
                <AppText>Pet Type: {pet.type} </AppText>
                {pet.petHistoryImages?.length > 0 && (
                  <>
                    <AppText>Pet History Images: </AppText>
                    <ScrollView horizontal style={{ marginVertical: 20 }}>
                      {pet.petHistoryImages.map((img, i) => (
                        <View key={`${img}-${i}`} style={{ marginRight: 20 }}>
                          <Image
                            // source={{
                            //   uri: `https://vetinstantbe.azurewebsites.net/img/${img}`,
                            // }}
                            source={{
                              uri: `${img}`,
                            }}
                            style={{
                              width: 150,
                              height: 150,
                              borderRadius: 75,
                            }}
                          />
                        </View>
                      ))}
                    </ScrollView>
                  </>
                )}
                {pet.prescriptions?.length > 0 && (
                  <AppText>Pet Prescriptions:</AppText>
                )}
                {pet.prescriptions?.length > 0 &&
                  pet.prescriptions.map((pbm, index) => (
                    <View key={index} style={styles.cardBordered}>
                      <AppText>Prescription: {pbm.prescription}</AppText>
                      <AppText>Doctor name: {pbm.docname}</AppText>
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
                              uri: `${pbm.img}`,
                            }}
                            style={{
                              width: 150,
                              height: 150,
                              borderRadius: 75,
                            }}
                          />
                        </>
                      )}
                    </View>
                  ))}
                {currentProblem && <AppText>Current Pet Problem:</AppText>}
                {currentProblem && (
                  <View style={styles.cardBordered}>
                    <AppText>Problem: {currentProblem.problem}</AppText>
                    <AppText>Doctor name: {currentProblem.docname}</AppText>
                    <AppText>Time Period: {currentProblem.time}</AppText>
                    <AppText>Appetite: {currentProblem.Appetite}</AppText>
                    <AppText>Behaviour: {currentProblem.Behaviour}</AppText>
                    <AppText>Eyes: {currentProblem.Eyes}</AppText>
                    <AppText>Gait: {currentProblem.Gait}</AppText>
                    <AppText>Mucous: {currentProblem.Mucous}</AppText>
                    <AppText>Comment: {currentProblem.comment}</AppText>
                    {currentProblem.Ears?.length > 0 && (
                      <AppText style={{ fontSize: 22 }}>Ears: </AppText>
                    )}

                    {currentProblem.Ears?.length > 0 &&
                      currentProblem.Ears.map((er, i) => (
                        <AppText key={`${i}-Ears`}> {er}</AppText>
                      ))}

                    {currentProblem.Feces?.length > 0 && (
                      <AppText style={{ fontSize: 22 }}>Faces: </AppText>
                    )}

                    {currentProblem.Feces?.length > 0 &&
                      currentProblem.Feces.map((fc, i) => (
                        <AppText key={`Feces ${i}`}> {fc}</AppText>
                      ))}
                    {currentProblem.Urine?.length > 0 && (
                      <AppText style={{ fontSize: 22 }}>Urines: </AppText>
                    )}

                    {currentProblem.Urine?.length > 0 &&
                      currentProblem.Urine.map((ur, i) => (
                        <AppText key={`Urines ${i}`}> {ur}</AppText>
                      ))}
                    {currentProblem.Skin?.length > 0 && (
                      <AppText style={{ fontSize: 22 }}>Skins: </AppText>
                    )}

                    {currentProblem.Skin?.length > 0 &&
                      currentProblem.Skin.map((sk, i) => (
                        <AppText key={`Skins ${i}`}> {sk}</AppText>
                      ))}

                    {currentProblem?.images?.length > 0 && (
                      <AppText>Pet Problem image</AppText>
                    )}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {currentProblem?.images?.length > 0 &&
                        currentProblem?.images.map((img, i) => (
                          <>
                            <Image
                              key={i + img}
                              // source={{
                              //   uri: `http://192.168.43.242:8000/img/${img}`,
                              // }}
                              source={{
                                uri: `${img}`,
                              }}
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
                )}
                {previousProblem?.length > 0 && (
                  <AppText>Previous Pet Problems:</AppText>
                )}
                {previousProblem?.length > 0 &&
                  previousProblem.map((pb, index) => (
                    <View key={pb._id} style={styles.cardBordered}>
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

                      {pb?.images?.length > 0 && (
                        <AppText>Pet Problem image</AppText>
                      )}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        {pb?.images?.length > 0 &&
                          pb?.images.map((img, i) => (
                            <>
                              <Image
                                key={i + img}
                                // source={{
                                //   uri: `http://192.168.43.242:8000/img/${img}`,
                                // }}
                                source={{
                                  uri: `${img}`,
                                }}
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
              </View>
            </>
          )}
          <AppButton title='Close' onPress={() => refRBSheet.current.close()} />
        </ScrollView>
      </RBSheet>
      {(status === 'connected' || status === 'connecting') && (
        <View style={styles.callContainer}>
          {status === 'connected' && videoTracks.size > 0 ? (
            <View style={styles.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={styles.remoteVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                )
              })}
            </View>
          ) : (
            <View>
              <AppText
                style={{
                  fontSize: 25,
                  marginTop: 50,
                  marginHorizontal: 30,
                  textAlign: 'center',
                  color: '#000',
                }}
              >
                {waitingTime === 0
                  ? 'Doctor Is Not Responding.Either You Can wait Or Try Again After Some Time.'
                  : `Waiting For Doctor To Connect...${waitingTime}`}
              </AppText>
            </View>
          )}
          <View style={styles.optionsContainer}>
            <MaterialIcons
              name='call-end'
              size={56}
              color='#fff'
              onPress={_onEndButtonPress}
              style={{
                backgroundColor: '#ff0055',
                width: 80,
                height: 80,
                borderRadius: 40,
                textAlign: 'center',
                paddingTop: 12,
                paddingHorizontal: 10,
              }}
            />

            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}
            >
              {isAudioEnabled ? (
                <Feather name='volume-2' size={30} color='black' />
              ) : (
                <Feather name='volume-x' size={30} color='black' />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onVideoButtonPress}
            >
              {isVideoEnabled ? (
                <Feather name='video' size={30} color='black' />
              ) : (
                <Feather name='video-off' size={30} color='black' />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}
            >
              <MaterialIcons name='crop-rotate' size={24} color='black' />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={getPetDetails}
            >
              <MaterialIcons name='pets' size={24} color='black' />
            </TouchableOpacity>
          </View>

          <View style={styles.localVideoContainer}>
            <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
          </View>
        </View>
      )}

      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        onNetworkQualityLevelsChanged={_onNetworkLevelChanged}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f3f3',
  },
  callContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    marginTop: 100,
  },
  localVideoContainer: {
    width: 220,
    height: 180,
    backgroundColor: 'white',
    position: 'absolute',
    right: 5,
    bottom: 100,
    borderRadius: 5,
    padding: 3,
  },
  localVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    padding: 10,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 10,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 8,
    marginRight: 5,
    borderRadius: 100 / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    position: 'absolute',
    bottom: 80,
    right: 50,
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 30,
    zIndex: 1,
  },
  cardBordered: {
    borderColor: '#dfd9d9',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
})

export default VideoCallScreen
