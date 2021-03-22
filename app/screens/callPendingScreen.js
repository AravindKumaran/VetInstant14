import React, { useState, useEffect, useContext } from 'react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'

import pendingsApi from '../api/callPending'
import roomsApi from '../api/rooms'
import usersApi from '../api/users'
import RazorpayCheckout from 'react-native-razorpay'
import LoadingIndicator from '../components/LoadingIndicator'
import AuthContext from '../context/authContext'

const CallPendingScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [pendingCalls, setPendingCalls] = useState([])

  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const getUserPendingCalls = async () => {
    setLoading(true)
    const pres = await pendingsApi.getCallPendingByUser(user._id)
    if (!pres.ok) {
      console.log('Error', pres)
      setLoading(false)
      setRefreshing(false)
      return
    }
    console.log('Ress', pres.data)
    setPendingCalls(pres.data.calls)
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    getUserPendingCalls()
  }, [])

  const handleDeny = async (item) => {
    const allPCalls = [...pendingCalls]
    const pCall = allPCalls.find((p) => p._id === item._id)
    if (pCall) {
      pCall.status = 'deny'
    }
    setLoading(true)
    const pRes = await pendingsApi.updateCallPending(item._id, pCall)
    if (!pRes.ok) {
      console.log('Error', pRes)
      setLoading(false)
      return
    }
    setLoading(false)
    setPendingCalls(allPCalls)
  }

  const handlePayment = async (item, str) => {
    const res = await usersApi.payDoctor({
      amt: item.docFee * 1 + 100,
    })
    if (!res.ok) {
      setLoading(false)
      console.log('Error', res)
    }
    setLoading(false)
    const options = {
      description: 'Payment For Doctor Consultation',
      currency: 'INR',
      key: 'rzp_test_GbpjxWePHidlJt',
      amount: res.data.result.amount,
      name: item.docName,
      order_id: res.data.result.id,
    }
    RazorpayCheckout.open(options)
      .then(async (data) => {
        setLoading(true)
        const verifyRes = await usersApi.verifyPayment({
          id: res.data.result.id,
          paid_id: data.razorpay_payment_id,
          sign: data.razorpay_signature,
        })
        if (!verifyRes.ok) {
          setLoading(false)
          console.log(verifyRes)
          return
        }
        const allPCalls = [...pendingCalls]
        const pCall = allPCalls.find((p) => p._id === item._id)
        if (pCall) {
          pCall.status = str
          pCall.paymentDone = true
        }

        const pRes = await pendingsApi.updateCallPending(item._id, pCall)
        if (!pRes.ok) {
          console.log('Error', pRes)
          setLoading(false)
          return
        }
        setLoading(false)
        setPendingCalls(allPCalls)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const handleVideo = async (item) => {
    // console.log('Vudfdsg', item)
    const roomRes = await roomsApi.createRoom({
      name: `${item.userId}-${item.docId}`,
      senderName: item.userName,
      receiverId: item.docId,
      petId: item.petId,
    })
    if (!roomRes.ok) {
      console.log(roomRes)
      setLoading(false)
      return
    }
    const tokenRes = await usersApi.getVideoToken({
      userName: user.name,
      roomName: roomRes.data.room.name,
    })
    console.log('Video Token', tokenRes)
    if (!tokenRes.ok) {
      setLoading(false)
      console.log('Error', tokenRes)
    }
    setLoading(false)

    navigation.navigate('VideoCall', {
      docId: item.docId,
      userId: user._id,
      name: user.name,
      token: tokenRes.data,
      item,
    })
  }

  const _renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <AppText
        style={{
          textTransform: 'capitalize',
          fontSize: 22,
          color: '#344247',
        }}
      >
        Dr. {item.docName}
      </AppText>
      {item.status === 'requested' && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Waiting for doctor confirmation</AppText>
          <AppButton title='Deny' onPress={() => handleDeny(item)} />
        </>
      )}
      {item.status === 'accepted' && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Doctor Approved, proceed to payment</AppText>
          <AppButton
            title='Make Payment'
            onPress={() => handlePayment(item, 'paymentDone')}
          />
          <AppButton title='Deny' onPress={() => handleDeny(item)} />
        </>
      )}
      {item.status === 'deny' && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Call has been denied</AppText>
        </>
      )}
      {item.status === 'scheduled' && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>
            Doctor has requested to schedule the call at{' '}
            <AppText style={{ fontWeight: 'bold' }}>
              {dayjs(item.extraInfo).format('hh:mm A')}
            </AppText>
            on
            <AppText style={{ fontWeight: 'bold' }}>
              {dayjs(item.extraInfo).format('DD/MM/YYYY')}
            </AppText>
          </AppText>

          <AppButton
            title='Accept & Make Payment'
            onPress={() => handlePayment(item, 'scheduledPayment')}
          />
          <AppButton title='Deny' onPress={() => handleDeny(item)} />
        </>
      )}
      {item.status === 'paymentDone' && item.paymentDone && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Payment Succesfully Done</AppText>
          <AppText>Please Join The Call</AppText>
          <AppButton title='Join Now' onPress={() => handleVideo(item)} />
        </>
      )}
      {item.status === 'scheduledPayment' && item.paymentDone && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Payment Done</AppText>
          <AppText>
            Call Scheduled at
            <AppText style={{ fontWeight: 'bold' }}>
              {dayjs(item.extraInfo).format('hh:mm A')}
            </AppText>
            on
            <AppText style={{ fontWeight: 'bold' }}>
              {dayjs(item.extraInfo).format('DD/MM/YYYY')}
            </AppText>
          </AppText>
          {dayjs().isSameOrAfter(dayjs(item.extraInfo)) && (
            <AppButton title='Join Now' onPress={() => handleVideo(item)} />
          )}
        </>
      )}
    </View>
  )

  const handleRefresh = () => {
    setRefreshing(true)
    getUserPendingCalls()
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingIndicator visible={loading} />}
      {pendingCalls.length === 0 && (
        <AppText style={{ textAlign: 'center', fontSize: 25 }}>
          No Pending Calls
        </AppText>
      )}
      <FlatList
        data={pendingCalls}
        renderItem={_renderItem}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
})

export default CallPendingScreen
