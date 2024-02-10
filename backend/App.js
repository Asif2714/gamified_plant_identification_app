import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Hello world!</Text>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{ width: 100, backgroundColor: "red", height: 100 }}
        ></View>

        <View
          style={{ width: 100, backgroundColor: "blue", height: 100 }}
        ></View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
