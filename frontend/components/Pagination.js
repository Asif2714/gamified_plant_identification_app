import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

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
        bottom: 50,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    dot: {
        width: 12,
        height: 12, 
        borderRadius: 6, 
        marginHorizontal: 3,
        backgroundColor:'#ccc',
    }
})