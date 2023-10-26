import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, ListItem } from "react-native-elements";

const ParticipantsList = ({ participants, selectedAccesses }) => {
  const renderParticipantItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content style={styles.listItemContent}>
        <Text style={styles.listItemText}>{item.first_name}</Text>
        <Text style={styles.listItemText}>{item.last_name}</Text>
        <Text style={styles.listItemText}>{item.guest_list}</Text>
        {selectedAccesses.length > 1 && <Text style={styles.listItemText}>{item.access}</Text>}
      </ListItem.Content>
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>
        List of Participants
      </Text>
      <ListItem bottomDivider>
        <ListItem.Content style={styles.listItemContent}>
          <Text style={styles.headerText}>First Name</Text>
          <Text style={styles.headerText}>Last Name</Text>
          <Text style={styles.headerText}>Guest List</Text>
          {selectedAccesses.length > 1 && <Text style={styles.headerText}>Access Name</Text>}
        </ListItem.Content>
      </ListItem>
      <FlatList data={participants} renderItem={renderParticipantItem} keyExtractor={(item) => item._id.toString()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemText: {
    flex: 1,
    textAlign: "center",
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ParticipantsList;
