import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { Formik } from "formik";
import AppButton from "../components/AppButton";
import AppFormField from "../components/forms/AppFormField";
import AppImagePicker from "../components/forms/AppImagePicker";

const AddVet = () => {
  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          reminder: "",
        }}
      >
        <>
          <View style={{ marginVertical: 20, marginHorizontal: 30 }}>
            <View style={{ alignSelf: "center" }}>
              <AppImagePicker name="photo" />
            </View>
            <AppFormField
              label="Name"
              autoCapitalize="none"
              autoCorrect={false}
              name="Name"
              //   placeholder="Name"
            />
            <AppFormField
              label="Hospital"
              autoCapitalize="none"
              autoCorrect={false}
              name="Hospital"
              //   placeholder="Hospital"
            />
          </View>
          <AppButton title="Add vet" />
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

export default AddVet;
