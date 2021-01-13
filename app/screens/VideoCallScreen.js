import React, { useEffect, useState, useRef } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
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

const VideoCallScreen = ({ navigation, route }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [status, setStatus] = useState('disconnected')
  const [participants, setParticipants] = useState(new Map())
  const [videoTracks, setVideoTracks] = useState(new Map())
  const [token, setToken] = useState(route.params?.token)
  const twilioVideo = useRef(null)

  useEffect(() => {
    console.log('Inside Effect')
    const _onConnectButtonPress = async () => {
      // console.log(token)
      if (Platform.OS === 'android') {
        await _requestAudioPermission()
        await _requestCameraPermission()
      }
      twilioVideo.current.connect({
        accessToken: token,
        enableNetworkQualityReporting: true,
      })
      setStatus('connecting')
      console.log('Connecting')
    }
    _onConnectButtonPress()

    return () => {
      console.log('Outside Effect')
      twilioVideo.current.disconnect()
    }
  }, [])

  const _onEndButtonPress = () => {
    twilioVideo.current.disconnect()
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
    console.log(events)
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

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track)

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ])
    )
  }

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track)

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
      {/* {status === 'disconnected' && (
        <View>
          <Text style={styles.welcome}>React Native Twilio Video</Text>

          <Button
            title='Connect'
            style={styles.button}
            onPress={_onConnectButtonPress}
          ></Button>
        </View>
      )} */}

      {(status === 'connected' || status === 'connecting') && (
        <View style={styles.callContainer}>
          {status === 'connected' && (
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
    marginLeft: 10,
    marginRight: 10,
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
})

export default VideoCallScreen
