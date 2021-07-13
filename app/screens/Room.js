import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Header } from "react-native-elements";
import ChatScreen from "./ChatScreen";
import VideoCallScreen from "./VideoCallScreen";
import AppButton from "../components/AppButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import pendingsApi from "../api/callPending";
import roomsApi from "../api/rooms";
import doctorsApi from "../api/doctors";
import petsApi from "../api/pets";
import AuthContext from "../context/authContext";
import usersApi from "../api/users";
import MedicalHistory from "./MedicalHistory";

const ActiveStyle = () => (
  <View
    style={{
      width: 30,
      height: 4,
      borderRadius: 14,
      position: "absolute",
      top: 20,
      borderBottomColor: "#6ADFA7",
      borderBottomWidth: 2,
      alignSelf: "center",
    }}
  ></View>
);

const ChatRoom = () => {
  const { user } = useContext(AuthContext);
  const [active, setActive] = useState("videocall");
  const [currentCall, setCurrentCall] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pet, setPet] = useState(null);
  const [doctor, setDoctor] = useState(null);

  const handleActive = (value) => {
    setActive(value);
  };

  const navigation = useNavigation();
  const route = useRoute();

  const getReceiverRoom = async () => {
    if (!route.params.video) {
      setLoading(true);
      setCurrentCall({
        ...route?.params?.docDetails,
        ...route?.params?.petDetails,
      });
      const crres = await roomsApi.getReceiverRoom(
        route?.params?.docDetails?._id
      );
      if (!crres.ok) {
        console.log("Error", crres);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      console.log("crres", crres.data.room);
      const requiredRoom = crres.data.room.find(
        (room) => room.petId === route?.params?.petDetails?._id
      );
      console.log("requiredRoom", requiredRoom);

      setCurrentRoom(requiredRoom);
    } else {
      setLoading(true);
      const pres = await pendingsApi.getCallPendingByUser(user._id);
      if (!pres.ok) {
        console.log("Error", pres);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const currentCallDetails = pres.data.calls.filter(
        (call) => call.status === "paymentDone"
      );

      console.log("item", route?.params?.item);
      const currentCallDoctor = currentCallDetails.find(
        (doc) => doc.docName === route?.params?.item?.docName
      );
      console.log("currentCallDoctor", currentCallDoctor);
      const petDetails = await petsApi.getSinglePet(route?.params?.item?.petId);
      console.log("petDetails", petDetails.data.exPet);
      setPet(petDetails.data.exPet);
      const docDetails = await doctorsApi.getSingleDoctor(
        route?.params?.item?.docId
      );

      setDoctor(docDetails?.data?.doctor);

      setCurrentCall(currentCallDoctor);

      const crres = await roomsApi.getReceiverRoom(currentCallDoctor.docId);
      if (!crres.ok) {
        console.log("Error", crres);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      const requiredRoom = crres.data.room.find(
        (room) => room.petId === route?.params?.item?.petId
      );
      setCurrentRoom(requiredRoom);
      setLoading(false);
    }
  };

  useEffect(() => {
    getReceiverRoom();
    console.log("currentCall", currentCall);
    console.log("currentRoom", currentRoom);
    console.log("petDetails", route?.params?.petDetails);
  }, []);

  const handleVideo = async () => {
    const tokenRes = await usersApi.getVideoToken({
      userName: user.name,
      roomName: currentRoom.name,
    });
    console.log("Video Token", tokenRes);
    if (!tokenRes.ok) {
      setLoading(false);
      console.log("Error", tokenRes);
    }
    setLoading(false);

    await sendPushToken(
      currentCall.docMobToken,
      "Please Join, Video Call Started By"
    );
    navigation.navigate("Video", {
      docId: currentCall.docId,
      userId: user._id,
      name: user.name,
      token: tokenRes.data,
      item: currentCall,
    });
  };

  const sendPushToken = async (token, title, message) => {
    if (token) {
      setLoading(true);

      const pushRes = await usersApi.sendPushNotification({
        targetExpoPushToken: token,
        title: `${title ? title : "Incoming CALL Request from"}  ${user.name}`,
        message: message || `Open the pending calls page for further action`,
        datas: { token: user.token || null },
      });

      if (!pushRes.ok) {
        setLoading(false);
        console.log("Error", pushRes);
        return;
      }
      setLoading(false);
    } else {
      alert("Something Went Wrong. Try Again Later");
    }
  };

  // const MyCustomLeftComponent = () => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         navigation?.goBack();
  //       }}
  //     >
  //       <Feather
  //         name={"arrow-left"}
  //         size={25}
  //         color="#476880"
  //         style={{
  //           marginLeft: 10,
  //           top: 5,
  //         }}
  //       />
  //     </TouchableOpacity>
  //   );
  // };

  // const MyCustomRightComponent = () => {
  //   return (
  //     <Image
  //       style={{
  //         height: 40,
  //         width: 40,
  //         borderRadius: 50,
  //         borderWidth: 2.5,
  //         borderColor: "#FFFFFF",
  //         marginRight: 10,
  //         paddingRight: 20,
  //       }}
  //     />
  //   );
  // };

  return (
    <View style={styles.container}>
      {!currentRoom ? (
        <Text>No Room Available</Text>
      ) : (
        <View style={styles.container}>
          {/* <Header
            // leftComponent={<MyCustomLeftComponent />}
            // rightComponent={<MyCustomRightComponent />}
            centerComponent={{
              text: "Room",
              style: {
                color: "#476880",
                fontSize: 20,
                fontWeight: "700",
                top: 5,
              },
            }}
            containerStyle={{
              backgroundColor: "white",
              elevation: 5,
              borderBottomStartRadius: 15,
              borderBottomEndRadius: 15,
            }}
          /> */}
          {route?.params?.video ? (
            <View>
              <View style={styles.catItem2}>
                <Image
                  source={{ uri: doctor?.user?.profile_image }}
                  size={15}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 50,
                    borderWidth: 5,
                    borderColor: "#FFFFFF",
                    padding: 10,
                  }}
                />
                <Image
                  source={{ uri: pet.photo }}
                  size={15}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 50,
                    borderWidth: 5,
                    borderColor: "#FFFFFF",
                    padding: 10,
                  }}
                />
                <View styles={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#47687F",
                      fontWeight: "700",
                    }}
                  >
                    Dr. {currentCall?.docName} & {currentCall?.petName} ‘s room
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#A3B1BF",
                      fontWeight: "400",
                    }}
                  >
                    Room ID : {currentRoom.name}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.catItem2}>
                <Image
                  source={{ uri: currentCall?.user?.profile_image }}
                  size={15}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 50,
                    borderWidth: 5,
                    borderColor: "#FFFFFF",
                    padding: 10,
                  }}
                />
                <Image
                  source={{ uri: currentCall?.photo }}
                  size={15}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 50,
                    borderWidth: 5,
                    borderColor: "#FFFFFF",
                    padding: 10,
                  }}
                />
                <View styles={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#47687F",
                      fontWeight: "700",
                    }}
                  >
                    Dr. {currentCall?.user?.name} & {currentCall.name} ‘s room
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#A3B1BF",
                      fontWeight: "400",
                    }}
                  >
                    Room ID : {currentRoom.name}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View style={styles.choose}>
            <View>
              {active === "videocall" ? <ActiveStyle /> : <View />}
              <TouchableWithoutFeedback
                onPress={() => handleActive("videocall")}
              >
                <Text
                  style={[
                    styles.text1,
                    { color: active === "videocall" ? "#41CE8A" : "#476880" },
                  ]}
                >
                  Video Call
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View>
              {active === "chat" ? <ActiveStyle /> : <View />}
              <TouchableWithoutFeedback onPress={() => handleActive("chat")}>
                <Text
                  style={[
                    styles.text1,
                    { color: active === "chat" ? "#41CE8A" : "#476880" },
                  ]}
                >
                  Chat
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View>
              {active === "sharableassets" ? <ActiveStyle /> : <View />}
              <TouchableWithoutFeedback
                onPress={() => handleActive("sharableassets")}
              >
                <Text
                  style={[
                    styles.text1,
                    {
                      color:
                        active === "sharableassets" ? "#41CE8A" : "#476880",
                    },
                  ]}
                >
                  Sharable Assets
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View
            style={{
              height: 0.5,
              backgroundColor: "#47687F",
              elevation: 5,
            }}
          />
          {active === "videocall" && (
            <View style={{ alignItems: "center", padding: 30 }}>
              {/* <Text
                style={{
                  margin: 10,
                }}
              >
                <Text style={{ color: "#47687F", fontWeight: "400", fontSize: 14 }}>
                  Call Scheduled at
                </Text>{" "}
                <Text style={{ color: "#41CE8A", fontWeight: "400", fontSize: 14 }}>
                  11th April 07:00 pm
                </Text>
              </Text> */}
              {!route.params.video ? (
                <Text>This Service is not applicable for You</Text>
              ) : (
                <View>
                  <Image
                    source={require("../components/assets/images/doctor1.png")}
                    size={15}
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                      borderWidth: 5,
                      borderColor: "#FFFFFF",
                      padding: 10,
                      margin: 10,
                    }}
                  />
                  <Text
                    style={{
                      margin: 10,
                    }}
                  >
                    Dr.{currentCall.docName} has joined the call
                  </Text>
                  <AppButton
                    title="Join Video Call"
                    onPress={() => handleVideo()}
                  />
                </View>
              )}
            </View>
          )}
          {active === "chat" && (
            <ChatScreen currentCall={currentCall} currentRoom={currentRoom} />
          )}
          {active === "sharableassets" && (
            <MedicalHistory user={user} currentCall={currentCall} />
          )}
        </View>
      )}
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  choose: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  catItem1: {
    alignSelf: "center",
    marginTop: 30,
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    paddingHorizontal: 20,
  },
  text2: {
    color: "#FA7C7C",
    fontSize: 14,
    fontWeight: "400",
  },
  text3: {
    color: "#37CF86",
    fontSize: 12,
    fontWeight: "400",
  },
  catItem2: {
    borderRadius: 30,
    flexDirection: "row",
    padding: 25,
    alignItems: "center",
  },
});
