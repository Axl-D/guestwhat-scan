import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ParticipantsList from "./ParticipantsList";
import QRCodeReader from "./QRCodeReader";

// Tab Navigator
const BottomTab = createBottomTabNavigator();

const QRAndParticipantsScreen = ({ route }) => {
  const { selectedAccesses, guestlists } = route.params;
  const [participants, setParticipants] = useState([]);

  const buildURL = (quotedArrayString) => {
    const base = "https://guestwhat.co/version-test/api/1.1/obj/Guest?cursor=0&constraints=";
    const constraints = [
      { key: "status", constraint_type: "equals", value: "confirmée" },
      { key: "access", constraint_type: "in", value: `[${quotedArrayString}]` },
    ];
    return `${base}${JSON.stringify(constraints)}`;
  };

  const enrichParticipants = (raw) => {
    return raw.map((participant) => {
      return {
        ...participant,
        guest_list: guestlists.find((g) => g._id === participant.guest_list)?.host_alias || "Unknown",
        access: selectedAccesses.find((g) => g._id === participant.access)?.name || "Unknown",
      };
    });
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const quotedArrayString = selectedAccesses.map((item) => `"${item._id}"`).join(",");
      const url = buildURL(quotedArrayString);

      try {
        const response = await axios.get(url, config);
        const enrichedParticipants = enrichParticipants(response.data.response.results);
        setParticipants(enrichedParticipants);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };
    fetchParticipants();
  }, []);

  return (
    <BottomTab.Navigator initialRouteName="Participants">
      <BottomTab.Screen
        name="Participants"
        children={() => <ParticipantsList participants={participants} selectedAccesses={selectedAccesses} />}
      />
      <BottomTab.Screen name="QRCode" children={() => <QRCodeReader participants={participants} />} />
    </BottomTab.Navigator>
  );
};

export default QRAndParticipantsScreen;
