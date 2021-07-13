import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
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
  const [routeName, setrouteName] = useState(false);
  const [touched, setTouched] = useState(false);

  const { keyboardHidesTabBars } = useState(true);
  const [didKeyboardShow, setKeyboardShow] = useState(false);

  const toggleTouched = () => {
    setTouched(!touched);
  };

  const seeProfile = () => {
    navigation.navigate("PetLobby");
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setKeyboardShow(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardShow(false);
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          onAddButtonPress();
          setTouched(!touched);
        }}
      >
        <Image
          source={require("../components/assets/images/center.png")}
          style={{
            width: 60,
            height: 60,
            bottom: didKeyboardShow ? 5 : 35,
          }}
        />
      </TouchableWithoutFeedback>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
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
