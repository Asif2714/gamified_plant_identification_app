import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
// import XPBar from "./components/XPBar";
import { View, Text, StyleSheet } from 'react-native';

// Importing the screens for navigation
import TakeImageScreen from "./screens/TakeImageScreen";
import HomeScreen from "./screens/HomeScreen.js";
import ChallengesScreen from "./screens/ChallengesScreen";
import LeaderboardGamesScreen from "./screens/LeaderboardGamesScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <>
      {/* <View style={styles.xpBarContainer}>
        <XPBar currentXP={70} maxXP={100} />
      </View> */}
      <NavigationContainer>
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
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

// const styles = StyleSheet.create({
//     xpBarContainer: {
//       height: 20, 
//       backgroundColor: '#000', 
//     },

// });

export default App;
