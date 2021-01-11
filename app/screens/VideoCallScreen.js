import React, { useState, useEffect } from 'react'

import {
  ScrollView,
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora'
import AppText from '../components/AppText'

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
}

let engine = RtcEngine

const VideoCallScreen = () => {
  const [permissonAllowed, setPermissionAllowed] = useState(false)
  const [values, setValues] = useState({
    appId: 'e49c5871a45144318804948b860e8228',
    channelName: 'local',
    token:
      '006e49c5871a45144318804948b860e8228IACZ/f+DDdFQIuBuwLn7kfzbM+FgAV3XBCRN90HUYAqi5OiI1osAAAAAEACpE93Ihiv4XwEAAQCHK/hf',
    joinSucceed: false,
    audioMtd: false,
    videoMtd: false,
    peerIds: [],
  })

  const {
    appId,
    channelName,
    token,
    joinSucceed,
    audioMtd,
    videoMtd,
    peerIds,
  } = values

  useEffect(() => {
    const requestCameraAndAudioPermission = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ])
        if (
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          setPermissionAllowed(true)
        } else {
          setPermissionAllowed(false)
        }
      } catch (err) {
        setPermissionAllowed(false)
        console.warn(err)
      }
    }

    requestCameraAndAudioPermission()
  }, [])

  // let engine

  useEffect(() => {
    const initEngine = async () => {
      engine = await RtcEngine.create(appId)
      // setEng(engine)
      // console.log(engine)
      await engine.enableVideo()

      engine.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed)
        if (peerIds.indexOf(uid) === -1) {
          setValues({
            ...values,
            peerIds: [...peerIds, uid],
          })
        }
      })

      engine.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason)
        setValues({
          ...values,
          peerIds: peerIds.filter((id) => id !== uid),
        })
      })

      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed)
        setValues({
          ...values,
          joinSucceed: true,
        })
      })
      // await engine?.joinChannel(token, channelName, null, 0)

      console.log('Done')
    }
    initEngine()
  }, [])

  const startCall = async () => {
    console.log('Call', token)
    await engine?.joinChannel(token, channelName, null, 0)
  }

  const endCall = async () => {
    await engine?.leaveChannel()
    setValues({ ...values, peerIds: [], joinSucceed: false })
  }

  if (!permissonAllowed) {
    return (
      <AppText style={{ fontSize: 25, textAlign: 'center', margin: 20 }}>
        Please give the permission to access the call
      </AppText>
    )
  }

  console.log(values)

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={startCall} style={styles.button}>
            <AppText style={styles.buttonText}> Start Call </AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={endCall} style={styles.button}>
            <AppText style={styles.buttonText}> End Call </AppText>
          </TouchableOpacity>
        </View>
        {joinSucceed ? (
          <View style={styles.fullView}>
            <RtcLocalView.SurfaceView
              style={styles.max}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
            />
            <ScrollView
              style={styles.remoteContainer}
              contentContainerStyle={{ paddingHorizontal: 2.5 }}
              horizontal={true}
            >
              {peerIds.map((value, index, array) => {
                return (
                  <RtcRemoteView.SurfaceView
                    style={styles.remote}
                    uid={value}
                    channelId={channelName}
                    renderMode={VideoRenderMode.FILL}
                    zOrderMediaOverlay={true}
                  />
                )
              })}
            </ScrollView>
          </View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
})

export default VideoCallScreen
