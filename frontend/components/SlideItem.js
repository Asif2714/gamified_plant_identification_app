import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function SlideItem({item}) {
    console.log(`http://10.0.2.2:8000/media/${item.image}`)
  return (
    <View>
        <Image
        //TODO: shift to amazon s3, or update this url later to not have emulator ip.
        source={{ uri: `http://10.0.2.2:8000/media/${item.image}` }}
        style={styles.image}
        onError={(e) => console.log(e.nativeEvent.error)} 
      />
      <Text>Scientific Name: {item.scientific_name}</Text>
      <Text>Common Name: {item.common_name}</Text>
      <Text>Date Time Taken: {item.date_time_taken}</Text>
      <Text>Rarity: {item.rarity}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    // container: {
    //   flex: 1,
    //   justifyContent: "center",
    //   alignItems: "center",
    // },
    // text: {
    //   fontSize: 16,
    //   marginBottom: 10,
    // },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderWidth: 1, // Add a border to see the image's layout
        borderColor: 'red',
      },
  });