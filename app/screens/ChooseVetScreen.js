import React, { useState, useContext } from "react";

import { StyleSheet, View, Alert, ScrollView } from "react-native";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AuthContext from "../context/authContext";
import LoadingIndicator from "../components/LoadingIndicator";

import doctorsApi from "../api/doctors";
import hospitalsApi from "../api/hospitals";

import ChooseVetPicker from "../components/forms/ChooseVetPicker";
import { Formik } from "formik";

const reminders = [
  { label: "Deworming", value: "Deworming" },
  { label: "Medicine", value: "Medicine" },
  { label: "Vaccine", value: "Vaccine" },
];

const ChooseVetScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext);
  // console.log('Choose', route.params.pet)
  const [loading, setLoading] = useState(false);

  const checkMyVetPresence = async () => {
    setLoading(true);
    const res = await doctorsApi.getSingleDoctor(user.doctorId);
    if (!res.ok) {
      console.log(res);
      setLoading(false);
      return;
    }
    if (res.data.doctor.user?.block) {
      alert("Your vet is blocked. Please choose another vet");
      setLoading(false);
      return;
    }
    if (res.data.doctor.user?.isOnline) {
      setLoading(false);
      navigation.navigate("CallVet", {
        doc: res.data.doctor,
        pet: route.params.pet,
      });
    } else {
      const hosRes = await hospitalsApi.getHospitalsDoctors(user.hospitalId);
      if (!hosRes.ok) {
        setLoading(false);
        console.log("Error", hosRes);
        return;
      }
      let msg = "Please choose other Vet that is currently available online ?";
      if (hosRes.data.count > 0) {
        const dc = hosRes.data.doctors.find(
          (doc) =>
            doc.user.isOnline &&
            doc.firstAvailaibeVet &&
            doc.user.block === false
        );
        if (dc) {
          msg = `But Doctor ${dc.user.name} from the same hospital is currently available with consultation Fees of ₹${dc.fee}.\n\n So, Do you want to continue with Doctor ${dc.user.name}?
          `;

          Alert.alert("Info", `Your Vet is currently not online\n\n ${msg}`, [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () =>
                navigation.navigate("CallVet", {
                  doc: dc,
                  pet: route.params.pet,
                }),
            },
          ]);
        } else {
          alert(`You Vet is currently not online.\n\n${msg}`);
        }
      }
      setLoading(false);
    }
  };

  const getOnlineAvailableDoctors = async () => {
    setLoading(true);
    const res = await doctorsApi.getOnlineDoctors();
    if (!res.ok) {
      console.log(res);
      setLoading(false);
      return;
    }
    console.log("Res", res.data);
    const dc = res.data.doctors.filter(
      (doc) =>
        doc.user?.isOnline === true &&
        doc.user._id !== user.doctorId &&
        doc.firstAvailaibeVet &&
        doc.user.block === false
    );
    console.log("Dc", dc[0]);
    if (dc.length > 0) {
      setLoading(false);
      navigation.navigate("CallVet", { doc: dc[0], pet: route.params.pet });
    } else {
      setLoading(false);
      alert("No Vet Is Currently Available.Please Try After Few Minutes.");
    }
  };

  return (
    <>
      <LoadingIndicator visible={loading} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        // style={{
        //   borderWidth: 2,
        //   borderColor: "#B9C4CF",
        //   borderRadius: 25,
        //   bottom: 20,
        // }}
      >
        <View style={styles.container1}>
          {/* <AppText
          style={{
            textAlign: "center",
            fontSize: 20,
            marginBottom: 20,
            marginTop: 20,
            color: "#47687F",
          }}
        >
          Choose your vet
        </AppText> */}
          <Formik
            initialValues={{
              reminder: "",
            }}
          >
            <>
              <ChooseVetPicker
                items={reminders}
                label="Type Of Reminder"
                name="reminder"
              />
              <AppButton
                title="My Vet (Waiting Time - 24 hrs)"
                btnStyle={{ padding: 18, marginBottom: 0 }}
                txtStyle={{ textTransform: "capitalize", textAlign: "center" }}
                onPress={checkMyVetPresence}
              />
              <AppButton
                title="First Available Vet Online (Waiting Time - max. 15 mins)"
                btnStyle={{ padding: 16 }}
                txtStyle={{ textTransform: "capitalize", textAlign: "center" }}
                onPress={getOnlineAvailableDoctors}
              />
              <AppButton
                title="See Your Reminders"
                btnStyle={{ padding: 16 }}
                txtStyle={{ textTransform: "capitalize", textAlign: "center" }}
                onPress={() => navigation.navigate("Reminder")}
              />
              <AppButton
                title="Edit Pet"
                btnStyle={{ padding: 16 }}
                txtStyle={{ textTransform: "capitalize", textAlign: "center" }}
                onPress={() =>
                  navigation.navigate("AddPet", {
                    pet: route.params.pet,
                    editPet: true,
                  })
                }
              />
              <AppButton
                title="Video Call"
                btnStyle={{ padding: 16 }}
                txtStyle={{ textTransform: "capitalize", textAlign: "center" }}
                onPress={() => navigation.navigate("CallVet")}
              />
              <AppButton
                title="Pet Profile"
                btnStyle={{ padding: 16 }}
                txtStyle={{ textTransform: "capitalize", textAlign: "center" }}
                onPress={() => navigation.navigate("PetProfile")}
              />
            </>
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    marginHorizontal: 20,
    marginBottom: 50,
  },
});

export default ChooseVetScreen;
