import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const ipAddress = "10.0.2.2";

export default function LeaderboardGamesScreen() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userPosition, setUserPosition] = useState(null);

  // Fetch the data for leaderboards when component is mounted
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:8000/leaderboard`);
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
      {/* <Text style={styles.heading}>Leaderboard</Text> */}
      {userPosition && (
        <Text style={styles.position}>Your position: {userPosition}</Text>
      )}
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.username}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.positionNumber}>{index + 1}.</Text>
            <Image
              source={{
                //TODO: AWS S3 Bucket changes in future
                uri: `http://${ipAddress}:8000/${item.profile_picture}`,
              }}
              style={styles.profilePic}
            />
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.experience}>{item.experience_points} XP</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  position: {
    fontSize: 18,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  },
  username: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  experience: {
    fontSize: 16,
  },
});
