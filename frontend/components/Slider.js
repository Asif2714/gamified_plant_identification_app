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
