import { FlatList, StyleSheet, Text, View } from "react-native";

import React from "react";
import SlideItem from "./SlideItem";
import Pagination from "./Pagination";

const Slider = (props) => {
  console.log("inside slider");
  // console.log(props.userPlantDetails)
  console.log("userPlantDetails in Slider:", props.userPlantDetails);

  if (!props.userPlantDetails || !Array.isArray(props.userPlantDetails)) {
    return <Text>No plants available</Text>;
  }

  return (
    <>
    {/* TODO: only render the last 10 if there are more than 10 pics */}
    {/* TODO: complete full pagination styling and animations later: follow */}
    {/* Continue from https://youtu.be/2TgArwz6je8?t=644 */}
      <FlatList
        data={props.userPlantDetails}
        renderItem={({ item }) => <SlideItem item={item.fields} />}
        keyExtractor={(item, index) => String(index)}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
      />
      <Pagination data = {props.userPlantDetails}/>

    </>
  );
};

export default Slider;

const styles = StyleSheet.create({});
