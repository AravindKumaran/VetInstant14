import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { StyleSheet, View, TouchableOpacity } from "react-native";

import AppText from "../AppText";

const AppFilePicker = ({ onChangeUri, size }) => {
  const [fileName, setFileName] = useState(null);

  const selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (file.type === "success") {
        const fileExt = file.name.split(".")[1];
        if (fileExt === "pdf" && file.size < size * 1000000) {
          onChangeUri(file.uri);
          setFileName(file.name);
        } else {
          setFileName(null);
          onChangeUri(null);
          throw new Error(`Please select .pdf file below ${size}mb`);
        }
      }
    } catch (error) {
      console.log("Error in picking file", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectFile}>
        <View style={styles.button}>
          <MaterialCommunityIcons name="upload" size={24} color="#41CE8A" />
          <AppText
            style={{ fontSize: 12, color: "#47687F", fontFamily: "400" }}
          >
            Upload certificate in PDF
          </AppText>
        </View>
      </TouchableOpacity>
      {fileName && <AppText>{fileName}</AppText>}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F6F6F6",
    borderRadius: 75,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    padding: 10,
    width: 320,
    height: 60,
    marginBottom: 20,
    elevation: 10,
  },
  container: {
    marginBottom: 10,
  },
});

export default AppFilePicker;
