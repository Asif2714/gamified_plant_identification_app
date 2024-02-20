import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
// import XPBar from "./components/XPBar";
import { View, Text, StyleSheet, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Screens
import MainAppScreen from "./screens/MainAppScreen";
import RegistrationScreen from './screens/RegistrationScreen';
import SignInScreen from './screens/SignInScreen';  


const AuthTab = createBottomTabNavigator();

// const AuthScreens = () => {
//   return (
//     <AuthTab.Navigator>
//         <AuthTab.Screen name="SignIn" component={SignInScreen} />
//         <AuthTab.Screen name="Register" component={RegistrationScreen} />
//     </AuthTab.Navigator>
//   );
// };

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>

        {/* TODO: implement sign out! */}
        {/* {userToken ? <MainAppScreen /> : <AuthScreens />} */}

        {userToken ? (
          <MainAppScreen />
        ) : (
          <AuthTab.Navigator>
            <AuthTab.Screen 
              name="SignIn" 
              children={() => <SignInScreen onSignIn={setUserToken} />} 
            />
            <AuthTab.Screen 
              name="Register" 
              children={() => <RegistrationScreen onRegistrationComplete={setUserToken} />} 
            />
          </AuthTab.Navigator>
        )}

      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

// const styles = StyleSheet.create({
//     xpBarContainer: {
//       height: 20,
//       backgroundColor: '#000',
//     },

// });

export default App;
