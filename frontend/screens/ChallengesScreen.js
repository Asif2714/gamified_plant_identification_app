import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const ipAddress = "10.0.2.2";

export default function ChallengesScreen() {
  const [rarityCounts, setRarityCounts] = useState({
    CR: 0,
    EN: 0,
    VU: 0,
    NT: 0,
    LC: 0,
    "Not Listed": 0,
  });

  const fetchRarityCounts = async () => {
    const username = await AsyncStorage.getItem("username");

    if(username) {
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

            if (response.ok){
                console.log("User plant details below:")
                console.log(rarityData)

                const counts = rarityData.rarity_counts.reduce((accumulator, currentRarity) => {
                    accumulator[currentRarity.rarity] = currentRarity.count;
                    return accumulator;
              }, {});

              setRarityCounts(counts);
            }

        } catch (error) {
            console.error("Error fetching user details:", error);
            console.error(`request: ${request}`);
          }
    }

  }

  // Fetch data everytime the page is focused? TODO: check if useEffect is needed
  useFocusEffect(
    useCallback(() => {
      fetchRarityCounts();
    }, [])
  );

  const RarityCountBox = ({ title, count }) => (
    <View style={styles.rarityCountBox}>
      <Text style={styles.rarityTitle}>{title}</Text>
      <Text style={styles.rarityCount}>{count}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenges</Text>
      <View style={styles.rarityCountsContainer}>
        <RarityCountBox title="Critically Endangered" count={rarityCounts.CR} />
        <RarityCountBox title="Endangered" count={rarityCounts.EN} />
        <RarityCountBox title="Vulnerable" count={rarityCounts.VU} />
        <RarityCountBox title="Near Threatened" count={rarityCounts.NT} />
        <RarityCountBox title="Least Concern" count={rarityCounts.LC} />
        <RarityCountBox title="Not Listed" count={rarityCounts["Not Listed"]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
