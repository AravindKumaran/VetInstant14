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
      })
      if (!res.ok) {
        console.log(res)
        setLoading(false)
        return
      }

      setRoom(res.data.room)

      const chatRes = await chatsApi.getRoomAllChat(res.data.room.name)
      setMessages(chatRes.data.chats)
      setLoading(false)

      socket.emit('room', res.data.room.name)
      socket.on('chat', (data) => {
        setMessages(data)
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
    setLoading(true)
    await chatsApi.createChat(newMsg[0])
    setLoading(false)
    socket.emit('chat', {
      room: room.name,
      msg: GiftedChat.append(messages, newMsg),
    })
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
