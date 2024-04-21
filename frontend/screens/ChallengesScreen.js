import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import CONFIG from "../app_config";

import RarityInfoModal from "../modals/RarityInfoModal";
import UserMetricsBarChart from "../components/UserMetricsBarChart";
// Colours available at https://www.withoutnations.com/portfolio/iucn-red-list/
const iucnColours = {
  CR: "#EA5448",
  EN: "#DA891C",
  VU: "#FFC476",
  NT: "#1A5B8C",
  LC: "#5586AC",
  NL: "#7F7F7F",
};

export default function ChallengesScreen() {
  // Rarity counts and user metrics for the current user
  const [rarityCounts, setRarityCounts] = useState({
    CR: 0,
    EN: 0,
    VU: 0,
    NT: 0,
    LC: 0,
    NL: 0,
  });
  const [userMetrics, setUserMetrics] = useState({
    Accuracy: 0,
    variety: 0,
    explorer: 0,
    achiever: 0,
    consistency: 0,
  });

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [achievements, setAchievements] = useState(null);

  const fetchRarityCounts = async () => {
    const username = await AsyncStorage.getItem("username");

    if (username) {
      try {
        request = `${CONFIG.API_URL}/get-user-plant-counts/${username}/`;
        const response = await fetch(request, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const rarityData = await response.json();
        if (response.ok) {
          console.log("User plant details below:");
          console.log(rarityData);

          const counts = rarityData.rarity_counts.reduce(
            (accumulator, currentRarity) => {
              accumulator[currentRarity.rarity] = currentRarity.count;
              return accumulator;
            },
            {}
          );

          setRarityCounts(counts);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        console.error(`request: ${request}`);
      }
    }
  };

  const fetchAchievements = async () => {
    const username = await AsyncStorage.getItem("username");
    const response = await fetch(
      `${CONFIG.API_URL}/get-user-achievements/${username}/`
    );
    if (response.ok) {
      const data = await response.json();
      setAchievements(data);
      console.log(data);
    } else {
      console.error("Failed to fetch achievements.");
    }
  };

  const fetchUserMetrics = async () => {
    const username = await AsyncStorage.getItem("username");

    try {
      const response = await fetch(
        `${CONFIG.API_URL}/get-user-metrics/?username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("User metrics:", data.user_metrics);
        setUserMetrics(data.user_metrics);
      } else {
        console.error("Failed to fetch user metrics:");
      }
    } catch (error) {
      console.error("Error fetching user metrics:", error);
    }
  };

  // Fetch data everytime the page is focused? TODO: check if useEffect is needed
  useFocusEffect(
    useCallback(() => {
      fetchRarityCounts();
      fetchAchievements();
      fetchUserMetrics();
    }, [])
  );

  const handleOpenInfoModal = () => {
    setInfoModalVisible(true);
  };

  // Separating rarity counts from Not Listed
  const { "Not Listed": notListedCount, ...mainRarities } = rarityCounts;

  console.log(`Main rarities: `);
  console.log(mainRarities);

  const RarityItem = ({ title, count, color }) => (
    <View style={[styles.rarityItem, { backgroundColor: color }]}>
      <Text style={styles.rarityText}>{title}</Text>
      <Text style={styles.rarityCount}>{count}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTextRarity}>
        Rarity of your identified plants
      </Text>
      <View style={styles.rarityContainer}>
        {Object.entries(mainRarities).map(([key, value]) => (
          <RarityItem
            key={key}
            title={key}
            count={value}
            color={iucnColours[key]}
          />
        ))}
      </View>
      {/* Render the 'Not Listed' count separately */}
      <View style={styles.notListedBox}>
        <Text style={styles.rarityText}>
          Not Listed in IUCN Red List: {notListedCount}{" "}
          {/* Information for IUCN with the info button for Modal */}
          <Icon
            name="information-circle-outline"
            size={24}
            onPress={handleOpenInfoModal}
          />
        </Text>
        <RarityInfoModal
          visible={infoModalVisible}
          onClose={() => setInfoModalVisible(false)}
        />
      </View>

      {/* Achievements */}
      <Text style={styles.headerText}>Your Achievements</Text>
      <View style={styles.achievementsContainer}>
        {achievements &&
          Object.entries(achievements).map(([key, value]) => (
            <View
              style={[
                styles.achievementItem,
                { backgroundColor: value ? "green" : "gray" },
              ]}
              key={key}
            >
              <Text style={styles.achievementText}>
                {/* Replacing _ with space and capitalizing first letter */}
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Text>
            </View>
          ))}
      </View>
      {/* User metrics section */}
      <Text style={styles.headerText}>Your Achievements</Text>
      <UserMetricsBarChart metrics={userMetrics} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Styles for the screen parts
  container: {
    flex: 1,
    padding: 7,
    backgroundColor: "#F6FBF4",
  },
  headerTextRarity: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 1,
    alignItems: "center",
    // borderRadius: 5,
    // borderWidth: ,
    textAlign: "center",
  },
  rarityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rarityItem: {
    flexBasis: "18%", // spreading the boxes
    borderWidth: 2,
    borderRadius: 10,
    padding: 3,
    marginBottom: 3,
  },
  rarityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  rarityCount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  notListedBox: {
    borderWidth: 2,
    borderColor: "Black",
    borderRadius: 10,
    padding: 3,
    marginTop: 5,
    alignItems: "center",
    backgroundColor: "white",
  },

  // Styles for achievements
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    margin: 5,
  },
  achievementsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  achievementItem: {
    width: "45%",
    padding: 10,
    margin: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  achievementText: {
    textAlign: "center",
    color: "white",
  },
});
