import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import moment from "moment";
import CONFIG from "../app_config";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    // Fetching 10 recent user images (a bit randomized!)
    const response = await fetch(`${CONFIG.API_URL}/plants-for-homepage/`);
    const data = await response.json();
    // TODO: Fetch plant facts or nature news, and add their "type"
    setContent(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchContent();
    }, [])
  );

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "user_submitted_plant":
        const dateTaken = item.date_time_taken
          ? moment(item.date_time_taken).format("Do MMMM YYYY")
          : "Date not available";
        return (
          <View style={styles.card}>
            <Image
              source={{
                uri: `${CONFIG.API_URL}${item.plant_image}`,
              }}
              style={styles.image}
            />
            <View style={styles.infoContainer}>
              <View style={styles.userContainer}>
                <Image
                  source={{
                    uri: `${CONFIG.API_URL}${item.user_profile_picture}`,
                  }}
                  style={styles.profilePic}
                />
                <Text style={styles.username}>{item.user}</Text>
              </View>
              <Text style={styles.commonName}>{item.common_name}</Text>
              <Text style={styles.scientificName}>{item.scientific_name}</Text>
              <Text style={styles.dateTaken}>Uploaded on: {dateTaken}</Text>
              <Text style={styles.rarity}>Rarity: {item.rarity}</Text>
            </View>
          </View>
        );
      //TODO: add other cases, such as news, plant info, advice, etc
      // maybe weather data too?
      default:
        return null;
    }
  };

  return (
    <View style={styles.mainView}>
      <Text style={styles.header}>The home feed</Text>
      <FlatList
        data={content}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* TODO: add a refresh feed button */}
    </View>
  );
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: "#F6FBF4"
    },
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#F6FBF4",
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 0,
  },
  card: {
    margin: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: "#F6FBE4"
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profilePic: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 8,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 12,
    color: "#252900",
  },
  commonName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "black",
    marginBottom: 4,
  },
  scientificName: {
    fontStyle: 'italic',
    fontSize: 13,
    color: "#252900",
  },

  dateTaken: {
    fontSize: 12,
    color: "gray",
  },
  rarity: {
    fontSize: 12,
    fontWeight: "bold",
    color: "gray",
  },
});
