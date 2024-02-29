import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";
import moment from "moment"; // for date conversion


const{width, height} = Dimensions.get('screen');

export default function SlideItem({ item }) {
  const formatDate = (dateString) => {
    return moment(dateString).format("Do MMMM YYYY");
  };

  console.log(`http://10.0.2.2:8000/media/${item.image}`);
  return (
    <View style={styles.container}>
      <Image
        //TODO: shift to amazon s3, or update this url later to not have emulator ip.
        source={{ uri: `http://10.0.2.2:8000/media/${item.image}` }}
        style={styles.image}
        resizeMode="contain"
        onError={(e) => console.log(e.nativeEvent.error)}
      />
      <View>
        <Text style={styles.sci_name}>
          Scientific Name: {item.scientific_name}
        </Text>
        <Text style={styles.com_name}>Common Name: {item.common_name}</Text>
        <Text style={styles.date}>Date Taken: {formatDate(item.date_time_taken)}</Text>
        <Text style={styles.rarity}>Rarity: {item.rarity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    width,
    // height, 
    alignItems: 'center',
},
  image: {
    width: 200,
    height: 200,
    // flex: 0.6,
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: "red",
  },
  content:{
    alignItems: 'center',
  },
  sci_name: {},
  com_name: {},
  date: {},
});
