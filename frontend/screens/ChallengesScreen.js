import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

import RarityInfoModal from '../modals/RarityInfoModal';

const ipAddress = "10.0.2.2";

// Colors available at https://www.withoutnations.com/portfolio/iucn-red-list/
const iucnColors = {
  CR: "#EA5448",
  EN: "#DA891C",
  VU: "#FFC476",
  NT: "#1A5B8C",
  LC: "#5586AC",
  NL: "#7F7F7F",
};

export default function ChallengesScreen() {
  const [rarityCounts, setRarityCounts] = useState({
    CR: 0,
    EN: 0,
    VU: 0,
    NT: 0,
    LC: 0,
    NL: 0,
  });

  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const fetchRarityCounts = async () => {
    const username = await AsyncStorage.getItem("username");

    if (username) {
      try {
        request = `http://${ipAddress}:8000/get-user-plant-counts/${username}/`;
        const response = await fetch(request, {
          method: "GET",
          headers: {
            // Authorization: `Token ${token}`,
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

  // Fetch data everytime the page is focused? TODO: check if useEffect is needed
  useFocusEffect(
    useCallback(() => {
      fetchRarityCounts();
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
      <Text style={styles.headerText}>Rarity of your identified plants</Text>
      <View style={styles.rarityContainer}>
        {Object.entries(mainRarities).map(([key, value]) => (
          <RarityItem
            key={key}
            title={key}
            count={value}
            color={iucnColors[key]}
          />
        ))}
      </View>
      {/* Render the 'Not Listed' count separately */}
      <View style={styles.notListedBox}>
        <Text style={styles.rarityText}>
          Not Listed in IUCN Red List: {notListedCount} {" "}
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
  headerText: {
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
    backgroundColor: "#ffffff", 
  },

  // Styles for achievements

});
