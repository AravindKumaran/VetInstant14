import React, { useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import ServiceScreen from "./ServiceScreen";

export default function VetChoice() {
  const refRBSheet = useRef();
  const onAddButtonPress = () => {
    refRBSheet?.current?.open();
  };
  const onClosePress = (data) => {
    if (data === "close") {
      refRBSheet?.current?.close();
    }
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={onAddButtonPress}>
        <Image
          source={require("../components/assets/images/center.png")}
          style={{
            width: 60,
            height: 60,
            bottom: 35,
          }}
        />
      </TouchableWithoutFeedback>
      <RBSheet
        ref={refRBSheet}
        dragFromTopOnly={true}
        closeOnPressMask={true}
        height={Dimensions.get("window").height - 200}
        animationType="slide"
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
        <ServiceScreen onClosePress={onClosePress} />
      </RBSheet>
    </>
  );
}
