import React, { useState, useContext, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View, Text, TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppFormField from "../components/forms/AppFormField";

import petsApi from "../api/pets";
import doctorsApi from "../api/doctors";
import pendingsApi from "../api/callPending";
import roomsApi from "../api/rooms";
import usersApi from "../api/users";
import ErrorMessage from "../components/forms/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import AuthContext from "../context/authContext";
import RazorpayCheckout from "react-native-razorpay";
import AppImageListPicker from "../components/forms/AppImageListPicker";
import * as Notifications from "expo-notifications";

import AppFormPicker from "../components/forms/AppFormPicker";
import AppMultiSelect from "../components/forms/AppMultiSelect";
import socket from "../components/utils/socket";
import RadioForm from "react-native-simple-radio-button";
import ChoosePicker from "../components/forms/ChoosePicker";
import RadioButtons from "../components/forms/Radio";
import CheckList from "../components/forms/CheckList";

import CheckboxList from "rn-checkbox-list";

const Appetite = [
  { label: "Normal", value: "Normal" },
  { label: "Not Observed", value: "Not Observed" },
  { label: "Different from Normal", value: "Different from Normal" },
];

const Behaviour = [
  { label: "Normal", value: "Normal" },
  { label: "Not Observed", value: "Not Observed" },
  { label: "Different from Normal", value: "Different from Normal" },
];

const Activity = [
  { label: "Normal", value: "Normal" },
  { label: "Not Observed", value: "Not Observed" },
  { label: "Different from Normal", value: "Different from Normal" },
];

const Feces = [
  { label: "Normal", name: "Normal" },
  { label: "Not Observed", name: "Not Observed" },
  { label: "Abnormal Colour", name: "Abnormal Colour" },
  { label: "Abnormal Odour", name: "Abnormal Odour" },
  { label: "Worms", name: "Worms" },
];

const Feces1 = [
  { id: 1, name: "Normal" },
  { id: 2, name: "Not Observed" },
  { id: 3, name: "Abnormal Colour" },
  { id: 4, name: "Abnormal Odour" },
  { id: 5, name: "Worms" },
];

const Urine = [
  { id: 1, name: "Normal" },
  { id: 2, name: "Not Observed" },
  { id: 3, name: "Abnormal Colour" },
  { id: 4, name: "Abnormal Odour" },
  { id: 5, name: "Worms" },
];

const Eyes = [
  { label: "Normal", value: "Normal" },
  { label: "Abnormal Discharge", value: "Abnormal Discharge" },
];

const Mucous = [
  { label: " White", value: "White" },
  { label: " Pink-White", value: "Pink-White" },
  { label: " Pink", value: "Pink" },
  { label: " Red-Pink", value: "Red-Pink" },
  { label: " Red", value: "Red" },
  //   { label: " Dark Red", value: "Dark Red" },
  { label: " Yellow", value: "Yellow" },
];

const Ears = [
  { label: "Normal", name: "Normal" },
  { label: "Abnormal Discharge", name: "Abnormal Discharge" },
  { label: "Abnormal Odour", name: "Abnormal Odour" },
  //   { label: "Abnormal appearance", name: "Abnormal appearance" },
];

const Ears1 = [
  { id: 1, name: "Normal" },
  { id: 2, name: "Abnormal Discharge" },
  { id: 3, name: "Abnormal Odour" },
];

const Nose = [
  { label: "Normal", value: "Normal" },
  { label: "Abnormal Discharge", value: "Abnormal Discharge" },
];

const Skin = [
  { label: "Normal", name: "Normal" },
  { label: "Injuries", name: "Injuries" },
  { label: "Odour", name: "Odour" },
  { label: "Hairfall", name: "Hairfall" },
  { label: "Rough Coat", name: "Rough Coat" },
  { label: "Changes in Appearance", name: "Changes in Appearance" },
];

const Skin1 = [
  { id: 1, name: "Normal" },
  { id: 2, name: "Injuries" },
  { id: 3, name: "Odour" },
  { id: 4, name: "Hairfall" },
  { id: 5, name: "Rough Coat" },
  { id: 6, name: "Changes in Appearance" },
];

const Gait = [
  { label: "Normal", value: "Normal" },
  { label: "Not Observed", value: "Not Observed" },
  { label: "Different from Normal", value: "Different from Normal" },
];

const Months = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
];

const Days = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
  { label: "13", value: "13" },
  { label: "14", value: "14" },
  { label: "15", value: "15" },
  { label: "16", value: "16" },
  { label: "17", value: "17" },
  { label: "18", value: "18" },
  { label: "19", value: "19" },
  { label: "20", value: "20" },
];

const validationSchema = Yup.object().shape({
  pet: Yup.string().max(100).required().label("Pet"),
  problems: Yup.string().max(100).required().label("Problems"),
  photo: Yup.string().nullable(),
  images: Yup.array().nullable().label("Image"),
  month: Yup.number().required().label("Month"),
  day: Yup.number().required().label("Day"),
  //comment: Yup.string().required("Please enter comment"),

  feces_comment: Yup.string().nullable(),
  urine_comment: Yup.string().nullable(),
  skin_comment: Yup.string().nullable(),
  general_comment: Yup.string().nullable(),

  appetite: Yup.string().nullable().required("Please select a appetite"),
  behaviour: Yup.string().nullable().required("Please select a behaviour"),
  activity: Yup.string().nullable().required("Please select a activity"),
  eyes: Yup.string().nullable().required("Please select a eyes"),
  mucous: Yup.string().nullable().required("Please select a mucous"),
  gait: Yup.string().nullable().required("Please select a gait"),
  eyes: Yup.string().required("Please select a eyes"),
  nose: Yup.string().required("Please select a nose"),

  ears: Yup.array().required().min(1).label("Ears"),
  skin: Yup.array().required().min(1).label("Skin"),
  feces: Yup.array().required().min(1).label("Feces"),
  urine: Yup.array().required().min(1).label("Urine"),
});

const CallVetScreen = ({ navigation, route }) => {
  //  console.log('Route', route.params)

  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState({});
  const [isSelected, setisSelected] = useState(false);
  const refRBSheet = useRef();

  const pet = [];
  useEffect(() => {
    route?.params?.pet?.map((p) => {
      pet.push({ label: p.name, value: p.name });
    });
    setPets(pet);
  }, []);

  const getPetDetails = (petName) => {
    const petDetail = route?.params?.pet?.find((p) => p.name === petName);
    // setSelectedPet(petDetail);
    return petDetail;
  };

  // useEffect(() => {
  //   const petDetail = getPetDetails("raju");
  //   console.log("petDetail", petDetail);
  // }, []);
  const sendPushToken = async (title, message) => {
    if (route?.params.doc?.user?.token) {
      setLoading(true);

      const pushRes = await usersApi.sendPushNotification({
        targetExpoPushToken: route.params.doc.user.token,
        title: `Incoming ${title ? title : "CaLL"} Request from ${user.name}`,
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

  // const sendWebPushToken = async (title, message) => {
  //   if (route.params.doc.user?.webToken) {
  //     setLoading(true)

  //     const pushRes = await usersApi.sendWebPushNotification({
  //       webToken: route.params.doc.user.webToken,
  //       title: `Incoming ${title ? title : 'Call'} Request from ${user.name}`,
  //       body: message || `Open the pending calls page for further action`,
  //     })

  //     if (!pushRes.ok) {
  //       setLoading(false)
  //       console.log('Error', pushRes)
  //       return
  //     }
  //     // console.log('PushRes', pushRes)
  //     setLoading(false)
  //   } else {
  //     alert('Something Went Wrong. Try Again Later')
  //   }
  // }

  const savePatientProblems = async (values, petDetail) => {
    console.log("savePatientProblems", values);
    const form = new FormData();
    if (values.images) {
      const images_arr = [];
      values.images.forEach((image, index) => {
        images_arr.push({
          name: "image" + index,
          type: "image/jpeg",
          uri: image,
        });
      });
      form.append("images", images_arr);
    }
    form.append("docname", route?.params?.doc.user.name);
    form.append("pet", values.pet);
    form.append("problem", values.problems);
    form.append("month", values.month);
    form.append("day", values.day);
    form.append("Appetite", values.appetite);
    form.append("Behaviour", values.behaviour);
    form.append("Activity", values.activity);
    const feces_arr = [];
    values.feces.forEach((fc) => {
      feces_arr.push(fc.name);
    });
    form.append("Feces", JSON.stringify(feces_arr));
    form.append("feces_comment", values.feces_comment);
    const urine_arr = [];
    values.urine.forEach((ur) => {
      urine_arr.push(ur.name);
    });
    form.append("Urine", JSON.stringify(urine_arr));
    form.append("urine_comment", values.urine_comment);
    form.append("Eyes", values.eyes);
    form.append("Mucous", values.mucous);
    const ears_arr = [];
    values.ears.forEach((er) => {
      ears_arr.push(er.name);
    });
    form.append("Ears", JSON.stringify(ears_arr));
    form.append("Nose", values.nose);
    const skin_arr = [];
    values.skin.forEach((sk) => {
      skin_arr.push(sk.name);
    });
    form.append("Skin", JSON.stringify(skin_arr));
    form.append("skin_comment", values.skin_comment);
    form.append("Gait", values.gait);
    form.append("general_comment", values.general_comment);

    console.log("Form", petDetail?._id, form);
    setLoading(true);
    const res = await petsApi.savePetProblems(form, petDetail?._id);
    console.log("res", res);
    if (!res.ok) {
      setError(res.data?.msg);
      console.log("response not ok");
      setLoading(false);
      // console.log(res)
      return;
    }
    setError(null);
    console.log("Pet Res", res.data);
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    const petDetail = getPetDetails(values.pet);

    if (values.videoCall) {
      // sendPushToken();

      // sendWebPushToken()
      // socket.emit('videoCall', {
      //   token: user.token,
      //   docId: route.params?.doc?.user?._id,
      //   paymentDone: false,
      //   name: user.name,
      // })

      const penData = {
        // webToken: route.params?.doc?.user?.webToken,
        docId: route.params?.doc?.user?._id,
        docName: route.params?.doc?.user?.name,
        docFee: route?.params?.doc?.fee * 1,
        hospId:
          route?.params?.doc?.hospital?._id ||
          route?.params?.doc?.user?.hospitalId,
        paymentDone: false,
        userName: user.name,
        userId: user._id,
        petId: petDetail?._id,
        petName: petDetail?.name,
        status: "requested",
        docMobToken: route.params?.doc?.user?.token,
        userMobToken: user.token,
      };
      setLoading(true);
      await savePatientProblems(values, petDetail);
      const penRes = await pendingsApi.saveCallPending(penData);
      if (!penRes.ok) {
        setLoading(false);
        console.log("Error", penRes);
      }
      setLoading(false);
      alert(
        "Notification Sent To Doctor. Please go to pending calls screen for further action"
      );
      navigation.navigate("Home");
    }
    // } else if (!values.videoCall) {
    //   sendPushToken("chat", "I have started the chat.Please join");
    //   await savePatientProblems(values, petDetail);
    //   navigation.navigate("Chat", {
    //     doc: route?.params?.doc,
    //     pet: petDetail,
    //   });
    // }
  };

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      <LoadingIndicator visible={loading} />
      <View style={styles.btnWrapper}>
        {/* <AppButton
          title="Pet History"
          btnStyle={{ marginTop: 30 }}
          onPress={() =>
            navigation.navigate("PetProblems", { id: route?.params?.pet._id })
          }
        />
        <AppButton
          title="Previous Pet Prescription"
          btnStyle={{ marginTop: 30 }}
          onPress={() =>
            navigation.navigate("PetPrescription", {
              id: route?.params?.pet._id,
            })
          }
        /> */}
      </View>

      <View style={styles.container1}>
        <Formik
          initialValues={{
            pet: "",
            problems: "",
            photo: null,
            videoCall: true,
            images: [],
            month: "",
            day: "",
            appetite: "",
            behaviour: "",
            activity: "",
            feces: [],
            feces_comment: "",
            urine: [],
            urine_comment: "",
            eyes: "",
            mucous: "",
            ears: [],
            skin: [],
            skin_comment: "",
            nose: "",
            gait: "",
            general_comment: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, setFieldValue }) => (
            <>
              <View style={{ margin: 25 }}>
                <View
                  style={{
                    width: "110%",
                    alignSelf: "center",
                    paddingBottom: 20,
                  }}
                >
                  <ChoosePicker
                    items={pets}
                    label="Choose your pet"
                    name="pet"
                    placeholder="Choose your pet"
                  />
                </View>

                <Text style={styles.text1}>Facing problems in</Text>
                <AppFormField
                  label="Comments"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="problems"
                  numberOfLines={3}
                  // placeholder="Describe the problem..."
                />

                <Text style={styles.text1}>
                  Since when is the problem happening?
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <View style={{ width: "50%" }}>
                    <ChoosePicker
                      items={Months}
                      label="Months"
                      name="month"
                      placeholder="Months"
                    />
                  </View>
                  <View style={{ width: "50%" }}>
                    <ChoosePicker
                      items={Days}
                      label="Days"
                      name="day"
                      placeholder="Days"
                    />
                  </View>
                </View>

                <Text style={styles.text1}>Appetite</Text>
                <RadioButtons
                  items={Appetite}
                  label="Appetite"
                  name="appetite"
                />

                <Text style={styles.text1}>General Behaviour</Text>
                <RadioButtons
                  items={Behaviour}
                  label="Behaviour"
                  name="behaviour"
                />

                <Text style={styles.text1}>Activity</Text>
                <RadioButtons
                  items={Activity}
                  label="Activity"
                  name="activity"
                />

                <Text style={styles.text1}>Feces</Text>
                <CheckList items={Feces1} label="Feces" name="feces" />
                <Text style={styles.text2}>Comments</Text>
                <AppFormField
                  label="Comments"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="feces_comment"
                  numberOfLines={3}
                  // placeholder="Describe the problem..."
                />

                <Text style={styles.text1}>Urine</Text>
                <CheckList items={Urine} label="Urine" name="urine" />

                <Text style={styles.text2}>Comments</Text>
                <AppFormField
                  label="Comments"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="urine_comment"
                  numberOfLines={3}
                  // placeholder="Describe the problem..."
                />

                <Text style={styles.text1}>Eyes</Text>
                <RadioButtons items={Eyes} label="Eyes" name="eyes" />

                <Text style={styles.text1}>Mucous Membrane of the Eye</Text>
                <Text style={styles.text3}>
                  Gently pull down a lower eyellabel with a finger and note its
                  colour. Choose the most appropriate colour description below.
                </Text>
                <RadioButtons items={Mucous} label="Mucous" name="mucous" />

                <Text style={styles.text1}>Ears</Text>
                <CheckList items={Ears1} label="Ears" name="ears" />

                <Text style={styles.text1}>Nose</Text>
                <RadioButtons items={Nose} label="Nose" name="nose" />

                <Text style={styles.text1}>Skin and Coats</Text>
                <CheckList items={Skin1} label="Skin" name="skin" />

                <Text style={styles.text2}>Comments</Text>
                <AppFormField
                  label="Comments"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="skin_comment"
                  numberOfLines={3}
                  // placeholder="Describe the problem..."
                />

                <Text style={styles.text1}>Gait</Text>
                <RadioButtons items={Gait} label="Gait" name="gait" />

                <Text style={styles.text1}>General Comments</Text>
                <AppFormField
                  label="Comments"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="general_comment"
                  numberOfLines={3}
                  // placeholder="Describe the problem..."
                />
              </View>

              <AppText style={styles.text1}>Add Pictures or Videos</AppText>
              <AppImageListPicker
                name="images"
                style={{ alignContent: "center" }}
              />
              {error && <ErrorMessage visible={!loading} error={error} />}

              <View style={styles.btnContainer}>
                <AppButton
                  title="Start a Video Call"
                  iconName="video"
                  btnStyle={{ width: "100%", marginRight: 10 }}
                  txtStyle={{ textAlign: "center", width: "-100%" }}
                  onPress={(e) => {
                    setFieldValue("videoCall", true);
                    handleSubmit(e);
                  }}
                />
              </View>
              {/* <AppButton
                  title='Make Payment'
                  iconName='dollar-sign'
                  btnStyle={{ width: '60%', marginRight: 5, alignSelf: 'center'}}
                  txtStyle={{ textAlign: 'center', width: '-100%' }}
                  onPress={(e) => {
                    setFieldValue('videoCall', false)
                    handleSubmit(e)
                  }}
                /> */}
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    marginHorizontal: 10,
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 30,
    alignItems: "flex-end",
    marginBottom: 70,
  },
  btnWrapper: {
    paddingHorizontal: 40,
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 14,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  text2: {
    color: "#47687F",
    fontSize: 14,
    fontWeight: "700",
    paddingTop: 20,
    margin: 20,
  },
  text3: {
    color: "#A2ABB5",
    fontSize: 12,
    fontWeight: "400",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    bottom: 10,
  },
  text4: {
    color: "#47687F",
    fontSize: 10,
    fontWeight: "400",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    bottom: 15,
  },
  textinput1: {
    width: "100%",
    height: 150,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B9C4CF",
    margin: 20,
    alignSelf: "center",
    paddingBottom: 100,
    paddingLeft: 10,
  },
  textinput2: {
    width: "80%",
    height: 60,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#B9C4CF",
    margin: 0,
    alignSelf: "center",
    paddingBottom: 0,
    paddingLeft: 0,
  },
});

export default CallVetScreen;
