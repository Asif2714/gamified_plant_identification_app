import React from "react";
import { View, Text, StyleSheet } from "react-native";

//  Could be converted later to spider chart, following this
// https://dev.to/simbamkenya/building-spider-chart-with-d3-js-and-react-js-50pj
// But there are issues with implememnting it directly in react native
// Resources used: 

const UserMetricsBarChart = ({ metrics }) => {
    // Loading the key-value pairs
    const keys = Object.keys(metrics);
    const values = Object.values(metrics);
  
    return (
      <View style={styles.container}>

        {/* Rendering the metrics one by one */}
        {keys.map((key, index) => {
          const value = values[index] * 100;
          return (
            // passing key for each view, then rendering the key detail and value
            <View key={key}>
                {/* captalizing the first letter */}
              <Text style={styles.label}>{`${key.charAt(0).toUpperCase()}${key.slice(1)}`} ({value.toFixed(0)}%)</Text>
              {/* Background does the full bar, foreground does the bar filling */}
              <View style={styles.barBackground}>
                <View style={[styles.barForeground, { width: `${value}%`, backgroundColor: value > 0 ? "#4CAF50" : "#e0e0e0" }]} />
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 2,
    },
    label: {
      fontSize: 15,
      marginBottom: 4,
      color: "black"
    },
    barBackground: {
      height:16,
      width: '100%',
      backgroundColor: "lightgray",
      borderRadius: 8
    },
    barForeground: {
      height: '100%',
      borderRadius: 8,
    }
  });
  
  export default UserMetricsBarChart;