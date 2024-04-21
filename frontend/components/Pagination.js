import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

// Code followed from the tutorial : https://youtu.be/2TgArwz6je8 with own modifications
export default function Pagination({data}) {
  return (
    <View style={styles.container}>
      {data.map((_,idx) => {
        return <View key={idx.toString()} style={styles.dot} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 95,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    dot: {
        width: 10,
        height: 10, 
        borderRadius: 4,
        borderWidth: 1,
        marginHorizontal: 3,
        backgroundColor:'gray',
    }
})