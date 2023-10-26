import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpStage, setOtpStage] = useState(false);

  const login = () => {
    if (isOtpStage) {
      // Handle login with OTP
      axios
        .post("https://guestwhat.co/version-test/api/1.1/wf/login", { email, otp })
        .then(async (response) => {
          // Handle success
          const token = response.data.response.token;
          if (token) {
            await AsyncStorage.setItem("userToken", response.data.response.token);
            navigation.navigate("EventList");
          } else {
            console.log(response.data.response.error);
          }
        })
        .catch((error) => {
          // Handle error
        });
    } else {
      // Generate OTP
      axios
        .post("https://guestwhat.co/version-test/api/1.1/wf/send-otp", { email })
        .then(() => {
          setOtpStage(true); // Move to OTP stage
        })
        .catch((error) => {
          // Handle error
        });
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Email"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />

      {isOtpStage ? (
        <Input
          placeholder="OTP"
          leftIcon={{ type: "font-awesome", name: "key" }}
          onChangeText={(text) => setOtp(text)}
          keyboardType="number-pad"
        />
      ) : null}

      <Button
        title={isOtpStage ? "Login" : "Generate One-Time Password"}
        onPress={login}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
export default AuthScreen;
