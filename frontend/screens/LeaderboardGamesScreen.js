import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CONFIG from "../app_config";

export default function LeaderboardGamesScreen() {
  // Some usestates required for displaying parts of the page
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [highlightedUser, setHighLightedUser] = useState([]);
  const [userInfoVisible, setUserInfoVisible] = useState([]);

  // Fetch the data for leaderboards when component is mounted
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/leaderboard`);
      const data = await response.json();

      if (response.ok) {
        setLeaderboardData(data);

        console.log("leaderboard data", leaderboardData);

        // Getting position of logged in user
        const username = await AsyncStorage.getItem("username");
        console.log(data);
        const position = data.findIndex((user) => user.username === username);
        setUserPosition(position !== -1 ? position + 1 : null);
      } else {
        console.error("Failed to fetch leaderboard data", data.error);
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const showSelectedUser = async (username) => {
    try {
      const requestUrl = `${CONFIG.API_URL}/user-details/?username=${username}`;
      const response = await fetch(requestUrl);
      const data = await response.json();

      // Showing information of the selected user
      if (response.ok) {
        setHighLightedUser(data);
        setUserInfoVisible(true);
        console.log(data);
        profilename = "";
        if (data.profile_name === "") {
          profilename = "Not set";
        } else {
          profilename = data.profile_name;
        }
        userInfoFormatted = `Profile Name: ${profilename}\nExperience Points: ${data.experience_points}\nDay Streak: ${data.current_streak}\nPlants identified: ${data.plant_count}`;
        Alert.alert(`User details of ${data.username}`, userInfoFormatted);
      } else {
        console.error("Failed to fetch user details", data.error);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch the data for leaderboards when component is mounted
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboardData();
    }, [])
  );

  //   console.log("leaderboard data",leaderboardData)

  return (
    <View style={styles.container}>
      {userPosition && (
        <View style={styles.positionContainer}>
          <Text style={styles.position}>Your position: {userPosition}</Text>
        </View>
      )}
      <Text style={styles.hintText}>Click on usernames to see details</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.username}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => showSelectedUser(item.username)}>
            <View style={[styles.item, index === 0 && styles.firstItem]}>
              <Text style={styles.positionNumber}>{index + 1}.</Text>
              <Image
                source={{
                  uri: `${CONFIG.API_URL}/${item.profile_picture}`,
                }}
                style={styles.profilePic}
              />
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.experience}>{item.experience_points} XP</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F6FBF4",
  },
  positionContainer: {
    backgroundColor: "#195100",
    borderRadius: 10,
    padding: 6,
    alignItems: "center",
    marginBottom: 4,
  },
  position: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 4,
    // borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 6,
    borderWidth: 2,
    marginVertical: 2,
  },
  hintText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  positionNumber: {
    fontSize: 16,
    marginRight: 6,
    color: "#252900",
    fontWeight: "700",
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#252900",
    marginLeft: 10,
  },
  experience: {
    fontSize: 16,
    color: "#252900",
  },
});
