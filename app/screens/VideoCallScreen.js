import React, { useEffect, useState, useRef } from 'react'
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
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
  const [loading, setLoading] = useState(false)
  const timeRef = useRef(null)
  const twilioVideo = useRef(null)

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

  return (
    <View style={styles.container}>
      <LoadingIndicator visible={loading} />
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
              color='#FFFFFF'
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
    backgroundColor: "#FFFFFF",
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
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    position: 'absolute',
    bottom: 80,
    right: 50,
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 30,
    zIndex: 1,
  },
})

export default VideoCallScreen
