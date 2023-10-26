import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import SlideInPopUp from "./SlideInPopUp";

export default function QRCodeReader({ participants }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [foundParticipant, setFoundParticipant] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleDismissPopup = () => {
    console.log("dismiss");
    setFoundParticipant(null);
    setIsScanning(true);
  };

  const handleBarCodeScanned = ({ data }) => {
    if (!isScanning) return;
    setIsScanning(false);

    // Search for participant
    const searchParticipant = participants.find((participant) => participant._id === data);
    if (searchParticipant) {
      console.log("participant found");
      setFoundParticipant(searchParticipant);
    } else {
      alert("Participant not found");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isScanning && <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />}
      {foundParticipant && <SlideInPopUp participant={foundParticipant} onDismiss={handleDismissPopup} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
