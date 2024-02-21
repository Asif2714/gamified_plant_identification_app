import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
// import XPBar from "./components/XPBar";
import { View, Text, StyleSheet, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Screens
import MainAppScreen from "./screens/MainAppScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import SignInScreen from "./screens/SignInScreen";

// Context API
import { UserProvider } from "./contexts/UserContext";

const AuthTab = createBottomTabNavigator();

const App = () => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    //TODO: logic to check if user is already signed in and setting userToeken accordingly
  }, []);

  const handleRegistrationComplete = (token) => {
    setUserToken(token);
  };

  const handleSignIn = (token) => {
    setUserToken(token);
  };

  const handleSignOut = () => {
    setUserToken(null);
  };

  return (
    <UserProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          {/* TODO: implement sign out! */}
          {/* {userToken ? <MainAppScreen /> : <AuthScreens />} */}

          {userToken ? (
            <MainAppScreen onSignOut={handleSignOut} />
          ) : (
            <AuthTab.Navigator
              screenOptions={({ route }) => ({
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                  backgroundColor: "black",
                },
                tabBarLabelStyle: {
                  fontWeight: "bold",
                },
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  let iconSize = size;
                  let iconColor = color;
                  if (route.name === "SignIn") {
                    iconName = focused ? "log-in" : "log-in-outline";
                  } else if (route.name === "Register") {
                    iconName = focused ? "person-add" : "person-add-outline";
                  }
                  return (
                    <Ionicons
                      name={iconName}
                      size={iconSize}
                      color={iconColor}
                    />
                  );
                },
              })}
            >
              <AuthTab.Screen
                name="SignIn"
                children={() => <SignInScreen onSignIn={setUserToken} />}
              />
              <AuthTab.Screen
                name="Register"
                children={() => (
                  <RegistrationScreen onRegistrationComplete={setUserToken} />
                )}
              />
            </AuthTab.Navigator>
          )}
        </NavigationContainer>
      </GestureHandlerRootView>
    </UserProvider>
  );
};

// const styles = StyleSheet.create({
//     xpBarContainer: {
//       height: 20,
//       backgroundColor: '#000',
//     },

// });

export default App;
