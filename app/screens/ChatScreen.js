import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
} from 'react-native-gifted-chat'

import AppText from '../components/AppText'

const customtInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopColor: '#E8E8E8',
        borderTopWidth: 1,
        padding: 8,
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 5,
      }}
    />
  )
}

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
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

  const onSend = (newMsg) => setMessages(GiftedChat.append(messages, newMsg))

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: 1,
          name: 'Avinash',
        }}
        renderBubble={renderBubble}
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
