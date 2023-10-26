import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "./screens/AuthScreen";
import EventListScreen from "./screens/EventListScreen";
import QRAndParticipants from "./screens/QRAndParticipants";

const Stack = createStackNavigator();

const App = () => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the token from storage then navigate to the appropriate place
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
      setIsLoading(false);
    };

    fetchToken();
  }, []);

  if (isLoading) {
    return null; // or some loading indicator
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userToken != null ? "EventList" : "Auth"}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="EventList" component={EventListScreen} />
        <Stack.Screen name="QRAndParticipants" component={QRAndParticipants} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
