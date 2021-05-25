import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";

import pendingsApi from "../api/callPending";
import roomsApi from "../api/rooms";
import usersApi from "../api/users";
import doctorsApi from "../api/doctors";
import hospitalsApi from "../api/hospitals";
import RazorpayCheckout from "react-native-razorpay";
import LoadingIndicator from "../components/LoadingIndicator";
import AuthContext from "../context/authContext";

import * as Notifications from "expo-notifications";
import {
  storeObjectData,
  getObjectData,
  removeValue,
} from "../components/utils/reminderStorage";

const CallPendingScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [pendingCalls, setPendingCalls] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const scheduleNotification = async (rmr) => {
    // console.log('Rmr', rmr.docName)
    let d = new Date(rmr.extraInfo);
    const date = new Date(d.getTime() - 10 * 60 * 1000);
    const trigger = new Date(date);
    trigger.setMinutes(date.getMinutes());
    trigger.setSeconds(date.getSeconds());
    console.log("Trigger", trigger.toLocaleString());
    console.log("Original", date.toLocaleString());
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your Today Scheduled Call Reminder",
        body: `You have call with Dr. ${rmr.docName}. Please join it`,
      },
      trigger,
    });
    return identifier;
  };

  const getUserPendingCalls = async () => {
    setLoading(true);
    const pres = await pendingsApi.getCallPendingByUser(user._id);
    if (!pres.ok) {
      console.log("Error", pres);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    // console.log('Ress', pres.data)
    const allScheduledCalls = pres.data.calls.filter(
      (call) => call.status === "scheduled"
    );

    const expiredCalls = [];
    const allCalls = pres.data.calls.filter((call) => {
      if (call?.deleteAfter) {
        if (dayjs().isSameOrAfter(dayjs(call.deleteAfter))) {
          expiredCalls.push(call);
          return;
        } else {
          return call;
        }
      } else {
        return call;
      }
    });

    expiredCalls.forEach(async (call) => {
      await pendingsApi.deleteCallPendingAfter(call._id);
    });

    allScheduledCalls.forEach(async (call) => {
      const d = new Date(call.extraInfo);
      const rmr = await getObjectData(
        `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
      );

      // console.log('Rmr', rmr.docName)
      if (!rmr) {
        const idt1 = await scheduleNotification(call);
        call["identifier"] = idt1;
        call[
          "reminder"
        ] = `You have call with Dr. ${call.docName}.See Pending Calls`;
        console.log("Rmsdr", call);
        await storeObjectData(
          `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`,
          call
        );
      }
    });

    // setPendingCalls(pres.data.calls)
    setPendingCalls(allCalls);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    getUserPendingCalls();
  }, []);

  const handleDeny = async (item) => {
    const allPCalls = [...pendingCalls];
    const pCall = allPCalls.find((p) => p._id === item._id);
    if (pCall) {
      pCall.status = "deny";
    }
    setLoading(true);
    const pRes = await pendingsApi.updateCallPending(item._id, pCall);
    if (!pRes.ok) {
      console.log("Error", pRes);
      setLoading(false);
      return;
    }
    const d = new Date(item.extraInfo);
    const rmr = await getObjectData(
      `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
    );
    if (rmr) {
      await removeValue(`${d.toLocaleDateString()}-${d.toLocaleTimeString()}`);
      await Notifications.cancelScheduledNotificationAsync(rmr.identifier);
    }

    await sendPushToken(
      pRes.data.calls.docMobToken,
      "Call Denied By",
      "Sorry I can't process further"
    );
    setLoading(false);
    setPendingCalls(allPCalls);
  };

  const handlePayment = async (item, str) => {
    if (item.docFee === 0) {
      const allPCalls = [...pendingCalls];
      const pCall = allPCalls.find((p) => p._id === item._id);
      if (pCall) {
        pCall.status = str;
        pCall.paymentDone = true;
        if (str === "scheduledPayment") {
          const d = new Date(item.extraInfo);
          pCall.deleteAfter = new Date(d.getTime() + 72 * 60 * 60 * 1000);
        } else {
          const d = new Date();
          pCall.deleteAfter = new Date(d.getTime() + 72 * 60 * 60 * 1000);
        }
      }
      setLoading(true);
      const pRes = await pendingsApi.updateCallPending(item._id, pCall);
      if (!pRes.ok) {
        console.log("Error", pRes);
        setLoading(false);
        return;
      }
      setLoading(false);
      setPendingCalls(allPCalls);
    } else {
      const res = await usersApi.payDoctor({
        amt: item.docFee * 1 + 100,
      });
      if (!res.ok) {
        setLoading(false);
        console.log("Error", res);
      }
      setLoading(false);
      const options = {
        description: "Payment For Doctor Consultation",
        currency: "INR",
        key: "rzp_test_GbpjxWePHidlJt",
        amount: res.data.result.amount,
        name: item.docName,
        order_id: res.data.result.id,
      };
      RazorpayCheckout.open(options)
        .then(async (data) => {
          setLoading(true);
          const verifyRes = await usersApi.verifyPayment({
            id: res.data.result.id,
            paid_id: data.razorpay_payment_id,
            sign: data.razorpay_signature,
          });
          if (!verifyRes.ok) {
            setLoading(false);
            console.log(verifyRes);
            return;
          }
          const allPCalls = [...pendingCalls];
          const pCall = allPCalls.find((p) => p._id === item._id);
          if (pCall) {
            pCall.status = str;
            pCall.paymentDone = true;
            if (str === "scheduledPayment") {
              const d = new Date(item.extraInfo);
              pCall.deleteAfter = new Date(d.getTime() + 72 * 60 * 60 * 1000);
            } else {
              const d = new Date();
              pCall.deleteAfter = new Date(d.getTime() + 72 * 60 * 60 * 1000);
            }
          }

          const pRes = await pendingsApi.updateCallPending(item._id, pCall);
          if (!pRes.ok) {
            console.log("Error", pRes);
            setLoading(false);
            return;
          }
          await sendPushToken(pRes.data.calls.docMobToken, "Payment Done By");
          setLoading(false);
          setPendingCalls(allPCalls);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const handleVideo = async (item) => {
    // console.log('Vudfdsg', item)
    const roomRes = await roomsApi.createRoom({
      name: `${item.userId}-${item.docId}`,
      senderName: item.userName,
      receiverId: item.docId,
      petId: item.petId,
    });
    if (!roomRes.ok) {
      console.log(roomRes);
      setLoading(false);
      return;
    }
    const tokenRes = await usersApi.getVideoToken({
      userName: user.name,
      roomName: roomRes.data.room.name,
    });
    console.log("Video Token", tokenRes);
    if (!tokenRes.ok) {
      setLoading(false);
      console.log("Error", tokenRes);
    }
    setLoading(false);
    const d = new Date(item.extraInfo);
    const rmr = await getObjectData(
      `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
    );
    if (rmr) {
      // await Notifications.cancelScheduledNotificationAsync(rmr.identifier)
      await removeValue(`${d.toLocaleDateString()}-${d.toLocaleTimeString()}`);
    }

    await sendPushToken(item.docMobToken, "Please Join, Video Call Started By");
    navigation.navigate("VideoCall", {
      docId: item.docId,
      userId: user._id,
      name: user.name,
      token: tokenRes.data,
      item,
    });
  };

  const checkOtherVetPresence = async (item) => {
    setLoading(true);
    const hosRes = await hospitalsApi.getHospitalsDoctors(item.hospId);
    if (!hosRes.ok) {
      setLoading(false);
      console.log("Error", hosRes);
      return;
    }
    if (hosRes.data.count === 0) {
      alert("No doctor from same hospital available");
      setLoading(false);
      return;
    }
    let msg = "Please choose other Vet that is currently available online ?";
    if (hosRes.data.count > 0) {
      console.log("dhff", hosRes.data.doctors[0]);
      const dc = hosRes.data.doctors.find((doc) => {
        return (
          doc.user.isOnline &&
          doc.firstAvailaibeVet &&
          doc.user.block === false &&
          doc.user._id !== item.docId
        );
      });
      if (dc) {
        msg = `Doctor ${dc.user.name} from the same hospital is currently available with consultation Fees of ₹${dc.fee}.\n\n So, Do you want to continue with Doctor ${dc.user.name}?
          `;

        Alert.alert("Info", `Choose other Vet\n\n ${msg}`, [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              const allPCalls = [...pendingCalls];
              const pCall = allPCalls.find((p) => p._id === item._id);
              if (pCall) {
                pCall.status = "requested";
                pCall.docName = dc.user.name;
                pCall.docId = dc.user._id;
                pCall.hospId = dc.hospital._id;
                pCall.docFee = dc.fee;
                pCall.docMobToken = dc.user.token;
              }
              setLoading(true);
              const pRes = await pendingsApi.updateCallPending(item._id, pCall);
              if (!pRes.ok) {
                console.log("Error", pRes);
                setLoading(false);
                return;
              }
              await sendPushToken(pRes.data.calls.docMobToken);
              alert(
                "Notification Sent To Doctor. Please go to pending calls screen for further action"
              );
              setLoading(false);
              setPendingCalls(allPCalls);
            },
          },
        ]);
      } else {
        alert(`No Vet from same hospital is currently online.\n\n${msg}`);
      }
    }
    setLoading(false);
  };

  const getOnlineAvailableDoctors = async (item) => {
    setLoading(true);
    const res = await doctorsApi.getOnlineDoctors();
    if (!res.ok) {
      console.log(res);
      setLoading(false);
      return;
    }
    // console.log('Res', res.data)
    const dc = res.data.doctors.filter(
      (doc) =>
        doc.user?.isOnline === true &&
        doc.user._id !== item.docId &&
        doc.firstAvailaibeVet &&
        doc.user.block === false
    );
    if (dc.length > 0) {
      setLoading(false);
      const msg = `Doctor ${dc[0].user.name} from ${dc[0]?.hospital?.name} is currently available with consultation Fees of ₹${dc[0].fee}.\n\n So, Do you want to continue with Doctor ${dc[0].user.name}?
          `;

      Alert.alert("Info", `Choose other Vet\n\n ${msg}`, [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const allPCalls = [...pendingCalls];
            const pCall = allPCalls.find((p) => p._id === item._id);
            if (pCall) {
              pCall.status = "requested";
              pCall.docName = dc[0].user.name;
              pCall.docId = dc[0].user._id;
              pCall.hospId = dc[0].hospital._id;
              pCall.docFee = dc[0].fee;
              pCall.docMobToken = dc[0].user.token;
            }
            setLoading(true);
            const pRes = await pendingsApi.updateCallPending(item._id, pCall);
            if (!pRes.ok) {
              console.log("Error", pRes);
              setLoading(false);
              return;
            }
            await sendPushToken(pRes.data.calls.docMobToken);
            alert(
              "Notification Sent To Doctor. Please go to pending calls screen for further action"
            );
            setLoading(false);
            setPendingCalls(allPCalls);
          },
        },
      ]);
    } else {
      setLoading(false);
      alert("No Vet Is Currently Available.Please Try After Few Minutes.");
    }
  };

  const _renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View>
        <AppText
          style={{
            textTransform: "capitalize",
            fontSize: 18,
            color: "#47687F",
            fontWeight: "700",
            margin: 5,
            marginLeft: 0,
          }}
        >
          Dr. {item.docName}
          {item?.petName ? ` & ${item?.petName} ` : ""}
        </AppText>
        <View
          style={{
            position: "absolute",
            right: -13,
            top: 55,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/doctor1.png")}
            size={15}
            style={{
              height: 50,
              width: 50,
              borderRadius: 30,
              borderWidth: 2.5,
              borderColor: "#FFFFFF",
              padding: 10,
            }}
          />
          <Image
            source={require("../../assets/doctor2.png")}
            size={15}
            style={{
              height: 50,
              width: 50,
              borderRadius: 30,
              borderWidth: 2.5,
              borderColor: "#FFFFFF",
              padding: 10,
            }}
          />
        </View>
      </View>
      {item.status === "requested" && (
        <>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Status:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Waiting...
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Room:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Dr. {item.docName} and {item.userName} has joined the room...
          </AppText>
          <AppText
            style={{
              fontSize: 16,
              color: "#47687F",
              fontWeight: "500",
              marginVertical: 15,
              textAlign: "center",
            }}
          >
            Waiting for Vet's Confirmation...
          </AppText>
          {/* <AppButton title='Deny' onPress={() => handleDeny(item)} /> */}
        </>
      )}
      {item.status === "accepted" && (
        <>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Status:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Doctor Approved, proceed to payment
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Room:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Dr. {item.docName} and {item.userName} has joined the room...
          </AppText>
          <AppButton
            title="Make Payment"
            onPress={() => handlePayment(item, "paymentDone")}
          />
          <AppButton title="Deny" onPress={() => handleDeny(item)} />
        </>
      )}
      {item.status === "deny" && (
        <>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Status:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Call has been denied
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Room:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Dr. {item.docName} and {item.userName} has joined the room...
          </AppText>
          <View style={{ alignItems: "center", margin: 5 }}>
            <View style={{ margin: 5 }}>
              <Text style={styles.text2}>Vet has rejected your request</Text>
            </View>
            <TouchableOpacity style={{ margin: 5 }}>
              <Text style={styles.text3}>Schedule a call via chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ margin: 5 }}
              onPress={() => checkOtherVetPresence(item)}
            >
              <Text style={styles.text3}>
                Choose other vet from same hospital
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ margin: 5 }}
              onPress={() => getOnlineAvailableDoctors(item)}
            >
              <Text style={styles.text3}>Search for first available vet</Text>
            </TouchableOpacity>
          </View>
          {/* <AppButton
            title='Choose Other Vet From Same Hospital (Waiting Time - max. 30 mins)'
            btnStyle={{ padding: 18, marginBottom: 20 }}
            txtStyle={{ textTransform: 'capitalize', textAlign: 'center' }}
            onPress={() => checkOtherVetPresence(item)}
          />
          <AppButton
            title='First Available Vet Online (Waiting Time - max. 15 mins)'
            btnStyle={{ padding: 16 }}
            txtStyle={{ textTransform: 'capitalize', textAlign: 'center' }}
            onPress={() => getOnlineAvailableDoctors(item)}
          /> */}
        </>
      )}
      {item.status === "scheduled" && (
        <>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Status:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 3,
            }}
          >
            Call Scheduled at{" "}
            <AppText style={{ fontWeight: "bold" }}>
              {dayjs(item.extraInfo).format("hh:mm A")}
            </AppText>
            on
            <AppText style={{ fontWeight: "bold" }}>
              {dayjs(item.extraInfo).format("DD/MM/YYYY")}
            </AppText>
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Room:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Dr. {item.docName} and {item.userName} has joined the room...
          </AppText>

          <View style={{ margin: 5 }}>
            <AppText style={[styles.text2, { textAlign: "center" }]}>
              Your vet has scheduled the call at{" "}
              <AppText style={{ fontWeight: "bold" }}>
                {dayjs(item.extraInfo).format("hh:mm A")}
              </AppText>
              on
              <AppText style={{ fontWeight: "bold" }}>
                {dayjs(item.extraInfo).format("DD/MM/YYYY")}
              </AppText>
            </AppText>
          </View>

          <AppButton
            title="Accept & Pay"
            onPress={() => handlePayment(item, "scheduledPayment")}
          />
          <View style={{ alignItems: "center", margin: 5 }}>
            <View style={{ margin: 5 }}>
              <Text style={styles.text2}>OR</Text>
            </View>
            <TouchableOpacity
              style={{ margin: 5 }}
              onPress={() => checkOtherVetPresence(item)}
            >
              <Text style={styles.text3}>
                Choose other vet from same hospital
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ margin: 5 }}
              onPress={() => getOnlineAvailableDoctors(item)}
            >
              <Text style={styles.text3}>Search for first available vet</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {item.status === "paymentDone" && item.paymentDone && (
        <>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Status:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Payment Succesfully Done
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Room:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Dr. {item.docName} and {item.userName} has joined the room...
          </AppText>
          <AppText
            style={{
              fontSize: 14,
              color: "#FA7C7C",
              fontWeight: "700",
              margin: 5,
              textAlign: "center",
            }}
          >
            Please Join The Call
          </AppText>
          <AppButton title="Join Now" onPress={() => handleVideo(item)} />
        </>
      )}
      {item.status === "scheduledPayment" && item.paymentDone && (
        <>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Status:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Payment Done
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "700",
              margin: 3,
            }}
          >
            Room:
          </AppText>
          <AppText
            style={{
              fontSize: 12,
              color: "#47687F",
              fontWeight: "400",
              margin: 5,
            }}
          >
            Dr. {item.docName} and {item.userName} has joined the room...
          </AppText>
          <AppText
            style={{
              fontSize: 14,
              color: "#FA7C7C",
              fontWeight: "400",
              margin: 5,
              textAlign: "center",
            }}
          >
            Call Scheduled at
            <AppText style={{ fontWeight: "bold" }}>
              {dayjs(item.extraInfo).format("hh:mm A")}
            </AppText>
            on
            <AppText style={{ fontWeight: "bold" }}>
              {dayjs(item.extraInfo).format("DD/MM/YYYY")}
            </AppText>
          </AppText>

          <AppButton title="Join Now" onPress={() => handleVideo(item)} />
          {/* {dayjs().isSameOrAfter(dayjs(item.extraInfo)) && (

          )} */}
        </>
      )}
      <View
        style={{
          height: 1,
          borderBottomWidth: 0.5,
          borderColor: "grey",
          width: "90%",
          alignSelf: "center",
          marginTop: 5,
        }}
      />
    </View>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    getUserPendingCalls();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        {loading && <LoadingIndicator visible={loading} />}
        {pendingCalls.length === 0 && (
          <AppText style={{ textAlign: "center" }}>No Pending Calls</AppText>
        )}
        <FlatList
          data={pendingCalls}
          renderItem={_renderItem}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    marginBottom: 40,
  },
  text2: {
    color: "#FA7C7C",
    fontSize: 14,
    fontWeight: "700",
  },
  text3: {
    color: "#37CF86",
    fontSize: 12,
    fontWeight: "400",
  },
});

export default CallPendingScreen;
