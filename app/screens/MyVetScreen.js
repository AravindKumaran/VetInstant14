import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AuthContext from "../context/authContext";

import hospitalsApi from "../api/hospitals";
import doctorsApi from "../api/doctors";
import LoadingIndicator from "../components/LoadingIndicator";

import { useNavigation } from "@react-navigation/native";

import ChooseVetPicker from "../components/forms/ChooseVetPicker";
import { Formik } from "formik";

const reminders = [
  { label: "Buttowski", value: "Buttowski" },
  { label: "Ramsay", value: "Ramsay" },
  { label: "Mariam", value: "Mariam" },
];

const sdoctors = [
  {
    src: require("../components/assets/images/doctor1.png"),
    name: "Dr. Bottowski",
    hospital: "PetCare Veteneriary Hospital",
    amount: "$20",
  },
];

const MyVetScreen = () => {
  const { user } = useContext(AuthContext);

  const { hospitalId, doctorId } = user;

  const navigation = useNavigation();

  const [docDetail, setDocDetail] = useState();
  const [hospDetail, setHospDetail] = useState();
  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState("stepone");

  const handleActive = (value) => {
    setActive(value);
  };

  const getDoctorAndHospital = async (hospitalId, doctorId) => {
    setLoading(true);
    const hospRes = await hospitalsApi.getSingleHospital(hospitalId);

    if (!hospRes.ok) {
      setLoading(false);
      console.log(hospRes);
      return;
    }

    const docRes = await doctorsApi.getSingleDoctor(doctorId);
    if (!docRes.ok) {
      setLoading(false);
      console.log(docRes);
      return;
    }

    setDocDetail(docRes.data.doctor);
    setHospDetail(hospRes.data.hospital);
    setLoading(false);
  };

  useEffect(() => {
    if (hospitalId) {
      getDoctorAndHospital(hospitalId, doctorId);
    }
  }, [hospitalId, doctorId]);

  const doctors = [
    {
      src: require("../components/assets/images/doctor1.png"),
      src: require("../components/assets/images/doctor1.png"),
      name: "Dr. Bottowski",
      hospital: "PetCare Veteneriary Hospital",
      amount: "$20",
    },
    {
      src: require("../components/assets/images/doctor2.png"),
      name: "Dr. Bottowski",
      hospital: "VetPlus Veteneriary Hospital",
      amount: "$30",
    },
    {
      src: require("../components/assets/images/doctor1.png"),
      name: "Dr. Bottowski",
      hospital: "PetCare Veteneriary Hospital",
      amount: "$40",
    },
    {
      src: require("../components/assets/images/doctor2.png"),
      name: "Dr. Bottowski",
      hospital: "VetPlus Veteneriary Hospital",
      amount: "$50",
    },
  ];

  return (
    <>
      <View style={styles.container}>
        {loading ? (
          <LoadingIndicator visible={loading} />
        ) : (
          <View style={styles.container1}>
            {docDetail && hospDetail ? (
              <>
                <View style={styles.card}>
                  <AppText style={{ fontSize: 14, color: "#606770" }}>
                    Hospital Name :
                  </AppText>
                  <AppText>{hospDetail.name}</AppText>
                </View>
                <View style={styles.card}>
                  <AppText style={{ fontSize: 14, color: "#606770" }}>
                    Doctor Name :
                  </AppText>
                  <AppText>{docDetail.user.name}</AppText>
                </View>
                <AppButton
                  title="Change Vet"
                  onPress={() =>
                    navigation.navigate("SaveVet", {
                      hosp: hospDetail,
                      doc: docDetail,
                      title: "Edit Vet Details",
                    })
                  }
                />
              </>
            ) : (
              <>
                <AppText style={{ fontSize: 20, marginVertical: 30 }}>
                  You haven't added any vet
                </AppText>
                <AppButton
                  title="Add Vet"
                  onPress={() => navigation.navigate("SaveVet")}
                />
              </>
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  container1: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 15,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },
  catItem: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 20,
  },
  catItem1: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 20,
    borderWidth: 1,
    borderColor: "#B9C4CF",
    borderRadius: 30,
    height: 60,
  },
  catItemText: {
    color: "#47687F",
    fontWeight: "400",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    marginRight: 180,
  },
  // Rectangle: {
  //   width: 80,
  //   height: 30,
  //   backgroundColor: "#f3f3f3",
  //   borderRadius: 20,
  //   left: 10,
  //   justifyContent: "center",
  //   alignContent: "center",
  //   alignItems: "center",
  //   borderWidth: 1,
  //   borderColor: "#51DA98",
  // },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
  },
  text2: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 12,
    color: "#839BAB",
  },
  text3: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 20,
    color: "#47687F",
    marginLeft: 70,
  },
});

export default MyVetScreen;
