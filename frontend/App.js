import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from "react-native-vector-icons/Ionicons";
// import XPBar from "./components/XPBar";
import { View, Text, StyleSheet } from 'react-native';



// Screens
import MainAppScreen from "./screens/MainAppScreen";

// Importing the screens for navigation

const App = () => {
  return (

      <MainAppScreen/>

  );
};

// const styles = StyleSheet.create({
//     xpBarContainer: {
//       height: 20, 
//       backgroundColor: '#000', 
//     },

// });

export default App;
