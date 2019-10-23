import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

import { BarCodeScanner } from "expo-barcode-scanner";

const BarcodeScanner = props => {
console.log("TCL: props", props)
  //Set initial state of camera permission and if barcode has been scanned
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanned, setscanned] = useState(false);

  // update state upon changing of camera permissions
  useEffect(() => {
    getPermissionsAsync();
  }, [hasCameraPermission]);

  // request camera permission from phone
  const getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission("granted");
  };

  //what to do when the barcode is scanned
  const handleBarCodeScanned = ({ data }) => {
    setscanned(true);
    //   send genQr as qrData to Login
    props.navigation.navigate("CheckBarCode", {
      qrData: data
    });
  };

  if (hasCameraPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  //add a workorder without a qr code
  const addWithoutQr = () => {
    //generate a random 5 digit string starting with n
    var genQr = "12345";
    // var genQr ="n" + Date.now().toString().slice(7,11);
    //   send genQr as qrData to Login
    props.navigation.navigate("CheckBarCode", {
      qrData: genQr
    });
  };
  return (
    // <SafeAreaView style={styles.container}>
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end"
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, , styles.container]}
      >
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom}>
          <View style={styles.fixToText}>
            <TouchableOpacity style={styles.customBtnBG} onPress={addWithoutQr}>
              <Text style={styles.customBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BarCodeScanner>

      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={setscanned(false)} />
      )}
    </SafeAreaView>
    //  </SafeAreaView>
  );
};
const opacity = "rgba(0, 0, 0, .6)";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: "row"
  },
  layerLeft: {
    flex: 4,
    backgroundColor: opacity
  },
  focused: {
    flex: 15
  },
  layerRight: {
    flex: 4,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignSelf: "flex-end",
    marginTop: 180,
    marginRight: 20
  },
  customBtnText: {
    fontSize: 40,
    fontWeight: "400",
    color: "#fff"
  },

  /* Here style the background of your button */
  customBtnBG: {
    backgroundColor: "#007aff",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 50
  }
});

export default BarcodeScanner;

//SD 10/16/19