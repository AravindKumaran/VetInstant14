import React, { useEffect, useState, useContext, useCallback } from "react";
import { StyleSheet, View, Image } from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  Actions,
  ActionsProps,
  InputToolbar,
  MessageImage,
} from "react-native-gifted-chat";

import AuthContext from "../context/authContext";
import LoadingIndicator from "../components/LoadingIndicator";
import roomsApi from "../api/rooms";
import chatsApi from "../api/chats";
import socket from "../components/utils/socket";
import Feather from "react-native-vector-icons/Feather";
import { IconButton } from "react-native-paper";
import Video from "react-native-video";
import DocumentPicker from "react-native-document-picker";

const ChatScreen = ({ navigation, route, currentCall, currentRoom }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(currentRoom);
  const [loading, setLoading] = useState(false);
  const [handlePickImage, sethandlePickImage] = useState([]);
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    const newRoom = async () => {
      setLoading(false);
      // const res = await roomsApi.createRoom({
      //   name: `${user._id}-${route.params?.doc?.user?._id}`,
      //   senderName: user.name,
      //   receiverId: route.params?.doc?.user?._id,
      //   petId: route.params?.pet._id
      // });
      // if (!res.ok) {
      //   console.log(res);
      //   setLoading(false);
      //   return;
      // }

      // console.log('Room Res', res)
      // setRoom(res.data.room);

      const chatRes = await chatsApi.getRoomAllChat(
        currentRoom.name,
        currentRoom.petId
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
          image: msg.chatFiles[0]?.mimetype?.includes("image") ? ('http://192.168.43.17:8000/'+msg.chatFiles[0]?.filename):null,
        };
      });

      console.log('MSg', newMessages)
      setMessages(newMessages);
      setLoading(false);

      socket.emit("room", currentRoom.name);
      socket.on("chat", (data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedData);
      });
      // console.log("yes", route.params);
    };

    newRoom();
    // navigation?.setOptions({ title: route.params?.doc?.user?.name });
  }, []);

  const selectFile = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      if(results){
        const form = new FormData();

        const files_arr = [];
        results.forEach((f, index) => {
          console.log(  f  );

          files_arr.push({
            name: f.name,
            type: f.type,
            uri: f.uri,
            size: f.size
          });     
        }); 

        console.log('files_arr', files_arr);
        
        form.append("petId", room.petId);  
        form.append("roomName", room.name);  
        form.append("chatFiles", files_arr[0]);  
        form.append("userId", user._id); 
        form.append("userName", user.name); 

        console.log('form', form);
    
        const ress = await chatsApi.createChat(form);   

        if (!ress.ok) {
          console.log("ress", ress);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const onSend = async (newMsg) => {
    console.log('newMsg', newMsg);
    newMsg[0].roomName = room.name;
    newMsg[0].petId = room.petId;
    newMsg[0].userId = user._id;
    newMsg[0].userName = user.name;
    setLoading(true);
    const ress = await chatsApi.createChat({
      petId: room.petId,
      roomName: room.name,
      text: newMsg[0].text,
      userId: user._id,
      userName: user.name,
    });
    if (!ress.ok) {
      console.log("ress", ress);
      setLoading(false);
      return;
    }
    // console.log('Ress', ress)
    setLoading(false);
    socket.emit("chat", {
      room: room.name,
      msg: GiftedChat.append(messages, newMsg),
    });
    // console.log("yes", route.params);
    setLoading(false);
  };

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: "Type your message here...",
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: "React Native",
  //         avatar: "https://placeimg.com/140/140/any",
  //       },
  //       image: "https://placeimg.com/140/140/any",
  //       video:
  //         "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  //     },
  //   ]);
  // }, []);

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

  // const onSend = useCallback((messages = [], image) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages, image)
  //   );
  // }, []);

  const renderMessageImage = (props) => {
    console.log("imageprop:", props.currentMessage.image);
    return (
      <View style={{ position: "relative", height: 150, width: 250 }}>
        <Image
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 150,
            width: 250,
            borderRadius: 20,
          }}
          source={{ uri: props.currentMessage.image }}
        />
      </View>
    );
  };

  const renderMessageVideo = (props) => {
    console.log("videoprop:", props.currentMessage.video);
    return (
      <View style={{ position: "relative", height: 150, width: 250 }}>
        <Video
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 150,
            width: 250,
            borderRadius: 20,
          }}
          shouldPlay
          isLooping
          rate={1.0}
          resizeMode="cover"
          height={150}
          width={250}
          muted={true}
          source={{
            uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          }}
          allowsExternalPlayback={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator visible={loading} />

      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        // user={{
        //   _id: 1,
        // }}
        renderBubble={renderBubble}
        showUserAvatar
        isTyping
        placeholder="Type a message"
        alwaysShowSend
        wrapInSafeArea={true}
        textInputProps={{
          borderColor: "#B9C4CF",
          borderWidth: 1.5,
          borderRadius: 30,
          alignSelf: "center",
          height: 45,
          paddingLeft: 10,
          paddingRight: 50,
        }}
        minComposerHeight={40}
        minInputToolbarHeight={40}
        // renderSend={renderSend}
        // renderActions={renderActions}
        // renderInputToolbar={renderInputToolbar}
        renderMessageVideo={renderMessageVideo}
        renderMessageImage={renderMessageImage}
        renderInputToolbar={(props) => (
          <InputToolbar {...props} containerStyle={{ borderTopWidth: 0 }} />
        )}
        renderSend={(props) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 40,
            }}
          >
            <Actions
              {...props}
              options={{
                ["Send Files"]: selectFile,
              }}
              icon={() => (
                <Feather
                  name={"plus"}
                  size={35}
                  color={"#41CE8A"}
                  style={{
                    left: 0,
                    width: 35,
                    bottom: 10,
                    borderRadius: 30,
                    backgroundColor: "#FFFFFF",
                    elevation: 10,
                  }}
                />
              )}
              onSend={(messages) => {
                GiftedChat.append(messages);
              }}
            />
            <Send {...props}>
              <IconButton
                icon="send-circle"
                size={41}
                color="#51DA98"
                style={{
                  top: 5,
                  right: 0,
                  elevation: 50,
                  backgroundColor: "transparent",
                }}
              />
            </Send>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
});

export default ChatScreen;

// const renderActions = (props) => {
//   return (
//     <Actions
//       {...props}
//       options={{
//         ["Send Files"]: handlePickImage,
//       }}
//       icon={() => (
//         <Feather
//           name={"plus"}
//           size={35}
//           color={"#41CE8A"}
//           style={{
//             left: 0,
//             width: 35,
//             bottom: 10,
//             borderRadius: 30,
//             backgroundColor: "#FFFFFF",
//             elevation: 10,
//           }}
//         />
//       )}
//       onSend={(args) => console.log(args)}
//     />
//   );
// };

// const handleSendImage = () => {
//   return <AppImagePicker />;
// };
// const renderActions = (props) => {
//   return (
//     <Actions
//       {...props}
//       icon={() => (
//         <IconButton
//           name={"camera"}
//           size={30}
//           color={"red"}
//           font={"FontAwesome"}
//           onPress={openImageLibrary}
//         />
//       )}
//       onSend={(args) => console.log(args)}
//     />
//   );
// };

// const renderInputToolbar = (props) => {
//   return (
//     <>
//       <View style={{ flexDirection: "row" }}>
//         <TextInput
//           style={{
//             width: "90%",
//             borderColor: "#B9C4CF",
//             borderWidth: 1.5,
//             borderRadius: 30,
//             alignSelf: "center",
//             backgroundColor: "red",
//           }}
//         />
//         <TouchableOpacity style={{ zIndex: 1, right: 50 }} onPress={onSend}>
//           <IconButton icon="send-circle" size={45} color="#51DA98" />
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// };

// const renderInputToolbar = (props) => {
//   return (
//     <InputToolbar
//       {...props}
//       // renderComposer={renderComposer}
//       renderActions={renderActions}
//       renderSend={renderSend}
//       accessoryStyle={{ height: 302 }}
//       containerStyle={{
//         backgroundColor: "#fff",
//         borderTopColor: "#E8E8E8",
//         borderTopWidth: 1,
//       }}
//     />
//   );
// };

// function renderSend(props) {
//   return (
//     <>
//       <Send {...props}>
//         <IconButton
//           icon="send-circle"
//           size={45}
//           color="#51DA98"
//           style={{ top: 10, right: 0 }}
//         />
//       </Send>
//     </>
//   );
// }

{
  /* <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        showUserAvatar
        isTyping
        placeholder="Type a message"
        renderSend={renderSend}
        alwaysShowSend
        wrapInSafeArea={true}
        textInputProps={{
          borderColor: "#B9C4CF",
          borderWidth: 1.5,
          borderRadius: 30,
          alignSelf: "center",
          left: 40,
          height: 45,
        }}
        renderActions={renderActions}
        // renderInputToolbar={renderInputToolbar}
            // renderSend={(props) => (
        //   <View
        //     style={{
        //       flexDirection: "row",
        //       alignItems: "center",
        //       height: 40,
        //     }}
        //   >
        //     <Feather
        //       name={"plus"}
        //       size={35}
        //       color={"#41CE8A"}
        //       style={{
        //         left: 0,
        //         width: 35,
        //         bottom: 5,
        //         borderRadius: 30,
        //         backgroundColor: "#FFFFFF",
        //         elevation: 10,
        //       }}
        //       onPress={openImageLibrary}
        //     />
        //     <Send {...props}>
        //       <IconButton
        //         icon="send-circle"
        //         size={40}
        //         color="#51DA98"
        //         style={{ top: 10, right: 20 }}
        //       />
        //     </Send>
        //   </View>
        // )}
      /> */
}

// try {
//   const res = await DocumentPicker.pick({
//     type: [DocumentPicker.types.images],
//   });
//   console.log(
//     res.uri,
//     res.type, // mime type
//     res.name,
//     res.size
//   );
// } catch (err) {
//   if (DocumentPicker.isCancel(err)) {
//     // User cancelled the picker, exit any dialogs or menus and move on
//   } else {
//     throw err;
//   }
// }
