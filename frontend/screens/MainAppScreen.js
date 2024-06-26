import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, StyleSheet } from "react-native";

// Importing the screens for navigation
import TakeImageScreen from "./TakeImageScreen";
import HomeScreen from "./HomeScreen.js";
import ChallengesScreen from "./ChallengesScreen";
import LeaderboardGamesScreen from "./LeaderboardGamesScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

// Screen when the user is logged in. Showing all other Screens within tabs
export default function MainAppScreen({ onSignOut }) {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "black",
          },
          tabBarLabelStyle: {
            fontWeight: "bold",
            // fontSize: 12
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconSize = size;
            let iconColor = color;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Challenges") {
              iconName = focused ? "ribbon" : "ribbon-outline";
            } else if (route.name === "Identify") {
              iconName = focused ? "leaf" : "leaf-outline";
              iconSize = focused ? size * 1.5 : size;
              iconColor = focused ? "limegreen" : "darkgreen";
            } else if (route.name === "Leaderboard") {
              iconName = focused ? "podium" : "podium-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return (
              <Ionicons name={iconName} size={iconSize} color={iconColor} />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Challenges" component={ChallengesScreen} />
        <Tab.Screen name="Identify" component={TakeImageScreen} />
        <Tab.Screen name="Leaderboard" component={LeaderboardGamesScreen} />
        <Tab.Screen
          name="Profile"
          children={() => <ProfileScreen onSignOut={onSignOut} />}
        />
      </Tab.Navigator>
    </>
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
