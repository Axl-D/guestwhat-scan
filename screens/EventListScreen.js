import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, Text, ListItem, Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getApiBaseUrl } from "../functions/apiEndPointHelper";

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [accesses, setAccesses] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAccesses, setSelectedAccesses] = useState([]);
  const [guestlists, setGuestlists] = useState([]);

  // Function to handle logging out
  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const baseUrl = await getApiBaseUrl();
      const token = await AsyncStorage.getItem("userToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios
        .get(baseUrl + "api/1.1/wf/get-events", config)
        .then((response) => {
          //console.log(response.data.response.events);
          setEvents(response.data.response.events);
          setAccesses(response.data.response.accesses);
          setGuestlists(response.data.response.guestlists);
        })
        .catch((error) => {
          console.error("There was an error fetching the events", error);
        });
    };

    fetchEvents();
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          <Icon name="logout" type="material-community" onPress={logout} />
        </View>
      ),
    });
  }, []);

  // Render each event in the list
  const renderEventItem = ({ item }) => {
    const isSelected = item._id === selectedEvent;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedEvent(item._id);
          setSelectedAccesses([]);
        }}
      >
        <ListItem bottomDivider containerStyle={isSelected ? styles.selectedItem : null}>
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };

  const renderAccessItem = ({ item }) => {
    if (selectedEvent && item.event === selectedEvent) {
      const isSelected = selectedAccesses.includes(item);

      return (
        <TouchableOpacity onPress={() => toggleAccessSelection(item)}>
          <ListItem bottomDivider containerStyle={isSelected ? styles.selectedItem : null}>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const toggleAccessSelection = (item) => {
    if (selectedAccesses.includes(item)) {
      setSelectedAccesses(selectedAccesses.filter((accessId) => accessId !== item));
    } else {
      setSelectedAccesses([...selectedAccesses, item]);
    }
  };

  const goToList = async () => {
    const filteredGuestlists = guestlists.filter((guestlist) => guestlist.event === selectedEvent);
    navigation.navigate("QRAndParticipants", {
      selectedAccesses: selectedAccesses,
      guestlists: filteredGuestlists,
    });
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>
        List of Events
      </Text>
      <FlatList style={styles.list} data={events} renderItem={renderEventItem} keyExtractor={(item) => item._id.toString()} />
      <Text h4 style={styles.title}>
        List of Accesses
      </Text>
      <FlatList data={accesses} renderItem={renderAccessItem} keyExtractor={(item) => item._id.toString()} />

      {selectedAccesses.length > 0 && <Button title="Fetch Participants" onPress={goToList} containerStyle={styles.buttonContainer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    maxHeight: 215,
  },
  container: {
    flex: 1,
  },
  title: {
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  selectedItem: {
    backgroundColor: "#2DA771",
  },
  buttonContainer: {
    margin: 20,
  },
});

export default EventListScreen;
