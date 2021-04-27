import React, { useEffect, useState, useContext, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";

import AuthContext from "../context/authContext";
import LoadingIndicator from "../components/LoadingIndicator";
import roomsApi from "../api/rooms";
import chatsApi from "../api/chats";
import socket from "../components/utils/socket";
import Feather from "react-native-vector-icons/Feather";
import { IconButton } from "react-native-paper";

const ChatScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newRoom = async () => {
      setLoading(true);
      const res = await roomsApi.createRoom({
        name: `${user._id}-${route.params?.doc?.user?._id}`,
        senderName: user.name,
        receiverId: route.params?.doc?.user?._id,
        petId: route.params?.pet._id,
      });
      if (!res.ok) {
        console.log(res);
        setLoading(false);
        return;
      }

      // console.log('Room Res', res)
      setRoom(res.data.room);

      const chatRes = await chatsApi.getRoomAllChat(
        res.data.room.name,
        res.data.room.petId
      );
      if (!chatRes.ok) {
        console.log("ChatRes", chatRes);
        setLoading(false);
        return;
      }
      // console.log('Chat Res', chatRes)
      const sortedChat = chatRes.data.chats.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      // const chatMessages = chatRes.data.chats
      const newMessages = sortedChat.map((msg) => {
        return {
          ...msg,
          user: {
            _id: msg.userId,
            name: msg.userName,
          },
        };
      });

      // console.log('MSg', newMessages)
      setMessages(newMessages);
      setLoading(false);

      socket.emit("room", res.data.room.name);
      socket.on("chat", (data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedData);
      });
    };

    newRoom();
    navigation.setOptions({ title: route.params?.doc?.user?.name });
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#F1F1F1",
          },
          right: {
            backgroundColor: "#41CE8A",
          },
        }}
        textStyle={{
          left: {
            color: "#47687F",
            fontSize: 12,
            fontWeight: "400",
          },
          right: {
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "400",
          },
        }}
      />
    );
  };

  // const onSend = async (newMsg) => {
  //   newMsg[0].roomName = room.name;
  //   newMsg[0].petId = route.params?.pet._id;
  //   newMsg[0].userId = user._id;
  //   newMsg[0].userName = user.name;
  //   setLoading(true);
  //   const ress = await chatsApi.createChat({
  //     petId: route.params?.pet._id,
  //     roomName: room.name,
  //     text: newMsg[0].text,
  //     userId: user._id,
  //     userName: user.name,
  //   });
  //   if (!ress.ok) {
  //     console.log("ress", ress);
  //     setLoading(false);
  //     return;
  //   }
  //   // console.log('Ress', ress)
  //   setLoading(false);
  //   socket.emit("chat", {
  //     room: room.name,
  //     msg: GiftedChat.append(messages, newMsg),
  //   });
  //   setLoading(false);
  // };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Type your message here...",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  function renderSend(props) {
    return (
      <Send {...props}>
        <IconButton
          icon="send-circle"
          size={40}
          color="#51DA98"
          style={{ top: 13 }}
        />
      </Send>
    );
  }

  return (
    <View style={styles.container}>
      <LoadingIndicator visible={loading} />
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        showUserAvatar
        isTyping
        placeholder="Type your message here..."
        renderSend={renderSend}
        messagesContainerStyle={{ color: "red", borderColor: "red" }}
        alwaysShowSend
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 100,
    backgroundColor: "#FFFFFF",
  },
});

export default ChatScreen;
