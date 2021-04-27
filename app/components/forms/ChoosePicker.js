import React from "react";
import { useFormikContext } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

import ErrorMessage from "./ErrorMessage";
import AppText from "../AppText";

import { StyleSheet, Text } from "react-native";

const ChoosePicker = ({ label, items, name, placeholder }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <RNPickerSelect
        useNativeAndroidPickerStyle={false}
        onValueChange={(value) => setFieldValue(name, value)}
        style={pickerSelectStyles}
        items={items}
        value={values[name]}
        Icon={() => (
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#47687F"
          />
        )}
      />
      <Text
        style={{
          left: 50,
          position: "absolute",
          color: "#B9C4CF",
          fontWeight: "400",
          backgroundColor: "white",
        }}
      >
        {label}
      </Text>

      <ErrorMessage error={errors[name]} visible={!values[name]} />
    </>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "#fff",
    fontSize: 18,
    padding: 18,
    borderRadius: 10,
    marginVertical: 10,
    color: "#0c0c0c",
    flex: 1,
    overflow: "scroll",
    paddingRight: 30,
  },
  inputAndroid: {
    backgroundColor: "white",
    fontSize: 18,
    padding: 15,
    borderRadius: 30,
    color: "#47687F",
    overflow: "scroll",
    borderWidth: 1,
    borderColor: "#B9C4CF",
    width: "90%",
    alignSelf: "center",
    // borderTopWidth: 0,
    top: 10,
  },
  iconContainer: {
    top: 30,
    right: 30,
  },
});
export default ChoosePicker;
