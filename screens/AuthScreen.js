import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Switch, Text } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "../functions/apiEndPointHelper";

const AuthScreen = ({ navigation }) => {
  const [isProductionEnv, setIsProductionEnv] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpStage, setOtpStage] = useState(false);

  useEffect(() => {
    const getEnv = async () => {
      const env = await AsyncStorage.getItem("isProductionEnv");
      setIsProductionEnv(env === "true");
    };
    getEnv();
  }, []);

  const toggleEnv = async () => {
    const newEnv = !isProductionEnv;
    await AsyncStorage.setItem("isProductionEnv", newEnv.toString());
    setIsProductionEnv(newEnv);
  };

  const login = async () => {
    const baseUrl = await getApiBaseUrl();
    if (isOtpStage) {
      // Handle login with OTP
      axios
        .post(baseUrl + "api/1.1/wf/login", { email, otp })
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
        .post(baseUrl + "api/1.1/wf/send-otp", { email })
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
      <View style={styles.headerContainer}>
        <View style={styles.toggleContainer}>
          <Switch value={isProductionEnv} onValueChange={toggleEnv} style={styles.toggleSwitch} disabled={isOtpStage} />
          <Text style={styles.toggleText}>{isProductionEnv ? "prod" : "test"}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Input placeholder="Email" leftIcon={{ type: "font-awesome", name: "envelope" }} onChangeText={(text) => setEmail(text)} keyboardType="email-address" />

        {isOtpStage ? <Input placeholder="OTP" leftIcon={{ type: "font-awesome", name: "key" }} onChangeText={(text) => setOtp(text)} keyboardType="number-pad" /> : null}

        <Button title={isOtpStage ? "Login" : "Generate One-Time Password"} onPress={login} containerStyle={styles.buttonContainer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flex: 0,
  },
  contentContainer: {
    flex: 0.5,
    justifyContent: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleSwitch: {
    marginLeft: 10,
  },
  toggleText: {
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
export default AuthScreen;
