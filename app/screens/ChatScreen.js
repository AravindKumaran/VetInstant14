import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import AuthContext from '../context/authContext'
import LoadingIndicator from '../components/LoadingIndicator'
import roomsApi from '../api/rooms'
import chatsApi from '../api/chats'
import socket from '../components/utils/socket'

const ChatScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [room, setRoom] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const newRoom = async () => {
      setLoading(true)
      const res = await roomsApi.createRoom({
        name: `${user._id}-${route.params?.doc?.user?._id}`,
        senderName: user.name,
        receiverId: route.params?.doc?.user?._id,
        petId: route.params?.pet._id,
      })
      if (!res.ok) {
        console.log(res)
        setLoading(false)
        return
      }

      // console.log('Room Res', res)
      setRoom(res.data.room)

      const chatRes = await chatsApi.getRoomAllChat(
        res.data.room.name,
        res.data.room.petId
      )
      if (!chatRes.ok) {
        console.log('ChatRes', chatRes)
        setLoading(false)
        return
      }
      // console.log('Chat Res', chatRes)
      const sortedChat = chatRes.data.chats.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      // const chatMessages = chatRes.data.chats
      const newMessages = sortedChat.map((msg) => {
        return {
          ...msg,
          user: {
            _id: msg.userId,
            name: msg.userName,
          },
        }
      })

      // console.log('MSg', newMessages)
      setMessages(newMessages)
      setLoading(false)

      socket.emit('room', res.data.room.name)
      socket.on('chat', (data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setMessages(sortedData)
      })
    }

    newRoom()
    navigation.setOptions({ title: route.params?.doc?.user?.name })
  }, [])

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#E8E8E8',
          },
        }}
      />
    )
  }

  const onSend = async (newMsg) => {
    newMsg[0].roomName = room.name
    newMsg[0].petId = route.params?.pet._id
    newMsg[0].userId = user._id
    newMsg[0].userName = user.name
    setLoading(true)
    const ress = await chatsApi.createChat({
      petId: route.params?.pet._id,
      roomName: room.name,
      text: newMsg[0].text,
      userId: user._id,
      userName: user.name,
    })
    if (!ress.ok) {
      console.log('ress', ress)
      setLoading(false)
      return
    }
    // console.log('Ress', ress)
    setLoading(false)
    socket.emit('chat', {
      room: room.name,
      msg: GiftedChat.append(messages, newMsg),
    })
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <LoadingIndicator visible={loading} />
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: user._id,
          name: user.name,
        }}
        renderBubble={renderBubble}
        showUserAvatar
        placeholder='Type your message here...'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ChatScreen
