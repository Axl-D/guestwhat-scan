// apiHelper.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getApiBaseUrl = async () => {
  const baseUrl = "https://guestwhat.co/";
  const isProductionEnv = await AsyncStorage.getItem("isProductionEnv");
  return isProductionEnv === "false" ? baseUrl + "version-test/" : baseUrl;
};
