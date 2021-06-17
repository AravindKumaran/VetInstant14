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

const vet = [
  { label: "Buttowski", value: "Buttowski" },
  { label: "Ramsay", value: "Ramsay" },
  { label: "Mariam", value: "Mariam" },
];

const sdoctors = [
  {
    src: require("../components/assets/images/doctor1.png"),
    name: "Dr. Bottowski",
    hospital: "PetCare Veteneriary Hospital",
    amount: "₹200",
  },
];

const ServiceScreen = () => {
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
      name: "Dr. Bottowski",
      hospital: "PetCare Veteneriary Hospital",
      amount: "₹200",
    },
    {
      src: require("../components/assets/images/doctor2.png"),
      name: "Dr. Bottowski",
      hospital: "VetPlus Veteneriary Hospital",
      amount: "₹300",
    },
    {
      src: require("../components/assets/images/doctor1.png"),
      name: "Dr. Bottowski",
      hospital: "PetCare Veteneriary Hospital",
      amount: "₹400",
    },
    {
      src: require("../components/assets/images/doctor2.png"),
      name: "Dr. Bottowski",
      hospital: "VetPlus Veteneriary Hospital",
      amount: "₹500",
    },
  ];

  return (
    <View style={styles.container}>
      <>
        <View style={styles.container1}>
          {active === "stepone" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose your vet
              </AppText>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  borderWidth: 1,
                  borderColor: "#B9C4CF",
                  borderRadius: 25,
                  marginBottom: 100,
                }}
              >
                <Formik
                  initialValues={{
                    vet: "",
                  }}
                >
                  <>
                    <ChooseVetPicker
                      items={vet}
                      label="Choose your vet"
                      name="Vet"
                      placeholder="Choose your vet"
                    />
                    <AppText
                      style={{
                        textAlign: "left",
                        fontSize: 14,
                        marginBottom: 20,
                        marginTop: 20,
                        color: "#47687F",
                        paddingHorizontal: 15,
                      }}
                    >
                      My vets
                    </AppText>
                    <View style={{ paddingTop: 10, margin: 10 }}>
                      {doctors.map((c, i) => (
                        <>
                          <View key={`${c.name}-${i}`} style={styles.catItem}>
                            <Image
                              source={c.src}
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
                            <View
                              style={{
                                flexDirection: "column",
                                marginLeft: 10,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => handleActive("steptwo")}
                              >
                                <Text style={styles.text1}>{c.name}</Text>
                                <Text style={styles.text2}>{c.hospital}</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.Rectangle}>
                              <Text style={styles.text3}>{c.amount}</Text>
                            </View>
                          </View>
                          <View
                            style={{
                              height: 1,
                              width: "95%",
                              borderWidth: 0.6,
                              borderColor: "#DCE1E7",
                              alignSelf: "center",
                              marginVertical: 15,
                              bottom: 20,
                            }}
                          />
                        </>
                      ))}
                    </View>
                  </>
                </Formik>
              </ScrollView>
            </>
          )}
          {active === "steptwo" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose your vet
              </AppText>
              <View style={{ marginTop: 30 }}>
                {sdoctors.map((c, i) => (
                  <>
                    <View key={`${c.name}-${i}`} style={styles.catItem1}>
                      <Image
                        source={c.src}
                        size={15}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 30,
                          borderWidth: 2.5,
                          borderColor: "#FFFFFF",
                          margin: 10,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "column",
                          marginLeft: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleActive("stepone")}
                        >
                          <Text style={styles.text1}>{c.name}</Text>
                          <Text style={styles.text2}>{c.hospital}</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.Rectangle}>
                        <Text style={styles.text3}>{c.amount}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        alignItems: "center",
                        marginVertical: 20,
                      }}
                    >
                      <Text>
                        <Text
                          style={{
                            color: "#47687F",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Seems like your vet is
                        </Text>{" "}
                        <Text
                          style={{
                            color: "red",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          offline
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#47687F",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          now
                        </Text>
                      </Text>
                      <View
                        style={{
                          height: 1,
                          width: "100%",
                          borderWidth: 0.5,
                          borderColor: "#B9C4CF",
                          alignSelf: "center",
                          marginVertical: 15,
                        }}
                      />
                      <TouchableOpacity>
                        <Text
                          style={{
                            color: "#839BAB",
                            fontSize: 12,
                            fontWeight: "400",
                            margin: 10,
                          }}
                        >
                          How can we help you?
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text
                          style={{
                            color: "#37CF86",
                            fontSize: 12,
                            fontWeight: "400",
                            margin: 10,
                          }}
                        >
                          Choose any other vet from the same hospital
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <Text
                          style={{
                            color: "#37CF86",
                            fontSize: 12,
                            fontWeight: "400",
                            margin: 10,
                          }}
                        >
                          Search for first available vet for Rs.100
                        </Text>
                      </TouchableOpacity>

                      <AppButton
                        title="Next"
                        onPress={() => handleActive("stepthree")}
                      />
                      <Text
                        style={{
                          color: "#839BAB",
                          fontSize: 9,
                          fontWeight: "700",
                          margin: 10,
                          textAlign: "center",
                        }}
                      >
                        (Video calls applies consultation fees along with
                        discounts for mandated visits)
                      </Text>

                      <TouchableOpacity>
                        <Text>
                          <Text
                            style={{
                              color: "#839BAB",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Or is it just a short enquiry?
                          </Text>{" "}
                          <Text
                            style={{
                              color: "#37CF86",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Chat Now.
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ))}
              </View>
            </>
          )}
          {active === "stepthree" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose a service
              </AppText>
              <View style={{ marginTop: 30 }}>
                {sdoctors.map((c, i) => (
                  <>
                    <View key={`${c.name}-${i}`} style={styles.catItem1}>
                      <Image
                        source={c.src}
                        size={15}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 30,
                          borderWidth: 2.5,
                          borderColor: "#FFFFFF",
                          margin: 10,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "column",
                          marginLeft: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleActive("stepone")}
                        >
                          <Text style={styles.text1}>{c.name}</Text>
                          <Text style={styles.text2}>{c.hospital}</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.Rectangle}>
                        <Text style={styles.text3}>{c.amount}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        alignItems: "center",
                        marginVertical: 20,
                      }}
                    >
                      <Text>
                        <Text
                          style={{
                            color: "#47687F",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Your vet is
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#41CE8A",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          online
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#47687F",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          now
                        </Text>
                      </Text>
                      <View
                        style={{
                          height: 1,
                          width: "100%",
                          borderWidth: 0.5,
                          borderColor: "#B9C4CF",
                          alignSelf: "center",
                          marginVertical: 15,
                        }}
                      />

                      <AppButton
                        title="Next"
                        onPress={() => handleActive("stepfour")}
                      />
                      <Text
                        style={{
                          color: "#839BAB",
                          fontSize: 9,
                          fontWeight: "700",
                          margin: 10,
                          textAlign: "center",
                        }}
                      >
                        (Video calls applies consultation fees along with
                        discounts for mandated visits)
                      </Text>

                      <TouchableOpacity>
                        <Text>
                          <Text
                            style={{
                              color: "#839BAB",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Or is it just a short enquiry?
                          </Text>{" "}
                          <Text
                            style={{
                              color: "#37CF86",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Chat Now.
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ))}
              </View>
            </>
          )}
          {active === "stepfour" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose a service
              </AppText>
              <Text
                style={{
                  color: "#47687F",
                  fontSize: 12,
                  fontWeight: "400",
                  marginBottom: 20,
                }}
              >
                We found a first available vet
              </Text>
              <View style={{ margin: 10 }}>
                {sdoctors.map((c, i) => (
                  <>
                    <View key={`${c.name}-${i}`} style={styles.catItem2}>
                      <Image
                        source={c.src}
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
                      <View
                        style={{
                          flexDirection: "column",
                          marginLeft: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleActive("stepone")}
                        >
                          <Text style={styles.text1}>{c.name}</Text>
                          <Text style={styles.text2}>{c.hospital}</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.Rectangle}>
                        <Text style={styles.text3}>{c.amount}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        alignItems: "center",
                        marginVertical: 20,
                      }}
                    >
                      <AppButton
                        title="Next"
                        onPress={() => handleActive("stepfive")}
                      />
                      <Text
                        style={{
                          color: "#839BAB",
                          fontSize: 9,
                          fontWeight: "700",
                          margin: 10,
                          textAlign: "center",
                        }}
                      >
                        (Video calls applies consultation fees)
                      </Text>

                      <TouchableOpacity>
                        <Text>
                          <Text
                            style={{
                              color: "#839BAB",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Or is it just a short enquiry?
                          </Text>{" "}
                          <Text
                            style={{
                              color: "#37CF86",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Chat Now.
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ))}
              </View>
            </>
          )}
          {active === "stepfive" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose a service
              </AppText>
              <Text
                style={{
                  color: "#47687F",
                  fontSize: 12,
                  fontWeight: "400",
                  marginBottom: 20,
                }}
              >
                We found a vet from the same hospital
              </Text>
              <View style={{ margin: 10 }}>
                {sdoctors.map((c, i) => (
                  <>
                    <View key={`${c.name}-${i}`} style={styles.catItem2}>
                      <Image
                        source={c.src}
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
                      <View
                        style={{
                          flexDirection: "column",
                          marginLeft: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleActive("stepone")}
                        >
                          <Text style={styles.text1}>{c.name}</Text>
                          <Text style={styles.text2}>{c.hospital}</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.Rectangle}>
                        <Text style={styles.text3}>{c.amount}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        alignItems: "center",
                        marginVertical: 20,
                      }}
                    >
                      <AppButton
                        title="Next"
                        onPress={() => handleActive("stepsix")}
                      />
                      <Text
                        style={{
                          color: "#839BAB",
                          fontSize: 9,
                          fontWeight: "700",
                          margin: 10,
                          textAlign: "center",
                        }}
                      >
                        (Video calls applies consultation fees along with
                        discounts for mandated visits)
                      </Text>

                      <TouchableOpacity>
                        <Text>
                          <Text
                            style={{
                              color: "#839BAB",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Or is it just a short enquiry?
                          </Text>{" "}
                          <Text
                            style={{
                              color: "#37CF86",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Chat Now.
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ))}
              </View>
            </>
          )}
          {active === "stepsix" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose a service
              </AppText>
              <Text
                style={{
                  color: "#47687F",
                  fontSize: 12,
                  fontWeight: "400",
                  marginBottom: 20,
                }}
              >
                Searching vet from same hospital
              </Text>
              <View style={{ margin: 10 }}>
                <>
                  <View
                    style={{
                      alignItems: "center",
                      marginVertical: 20,
                    }}
                  >
                    <Image
                      style={{
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                      source={require("../components/assets/images/loader.png")}
                    />
                    <AppButton
                      title="Next"
                      onPress={() => handleActive("stepone")}
                    />
                    <Text
                      style={{
                        color: "#839BAB",
                        fontSize: 9,
                        fontWeight: "700",
                        margin: 10,
                        textAlign: "center",
                      }}
                    >
                      (Video calls applies consultation fees along with
                      discounts for mandated visits)
                    </Text>

                    <TouchableOpacity>
                      <Text>
                        <Text
                          style={{
                            color: "#839BAB",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Or is it just a short enquiry?
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#37CF86",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Chat Now.
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              </View>
            </>
          )}
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    justifyContent: "center",
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
  catItem2: {
    flexDirection: "row",
    alignItems: "center",
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
    marginLeft: 60,
  },
});

export default ServiceScreen;
