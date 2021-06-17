import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Formik } from "formik";
import AppButton from "../components/AppButton";
import RBSheet from "react-native-raw-bottom-sheet";
import ServiceScreen from "./ServiceScreen";

const VetProfile = () => {
  const refRBSheet = useRef();
  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          reminder: "",
        }}
      >
        <>
          <View style={{ marginVertical: 20 }}>
            <Image
              style={{
                height: 130,
                width: 130,
                alignSelf: "center",
                borderRadius: 100,
                borderWidth: 10,
                borderColor: "#FFFFFF",
                elevation: 10,
              }}
              source={require("../components/assets/images/doctor1.png")}
            />
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              <Text style={styles.text2}>Dr. Raj Kumar</Text>{" "}
              <Text
                style={[
                  styles.text2,
                  { color: "#47687F", fontSize: 18, fontWeight: "400" },
                ]}
              >
                M.B.B.S., M.D.
              </Text>
            </Text>
            <View style={{ marginVertical: 50 }}>
              <View style={styles.box}>
                <Text style={styles.text3}>Hospital</Text>
                <Text style={styles.text4}>PetCare Chennai Clinic</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Vet Contact</Text>
                <Text style={styles.text4}>+91 1234567890</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Hospital Contact</Text>
                <Text style={styles.text4}>+91 1234567890</Text>
              </View>
            </View>
            <View>
              <AppButton
                title="Call Vet"
                onPress={() => refRBSheet.current.open()}
              />
              <RBSheet
                ref={refRBSheet}
                height={Dimensions.get("window").height - 200}
                animationType="fade"
                customStyles={{
                  wrapper: {
                    backgroundColor: "rgba(0,0,0,.6)",
                  },
                  draggableIcon: {
                    backgroundColor: "#C4C4C4",
                  },
                  container: {
                    backgroundColor: "#FFFFFF",
                    borderTopRightRadius: 25,
                    borderTopLeftRadius: 25,
                  },
                }}
              >
                <ServiceScreen />
              </RBSheet>
            </View>
          </View>
        </>
      </Formik>
    </ScrollView>
  );
};

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
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    paddingHorizontal: 20,
  },
  text2: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 24,
    color: "#41CE8A",
    marginBottom: 20,
  },
  text3: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  text4: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 14,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  box: {
    height: 50,
    borderRadius: 30,
    marginVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    elevation: 10,
    backgroundColor: "#FFFFFF",
    margin: 20,
  },
});

export default VetProfile;
