import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { human, systemWeights } from "react-native-typography";

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    minHeight: 50
  },
  wrapper: {
    flex: 1
  },
  text: {
    ...human.footnoteObject,
    ...systemWeights.light,
    color: "#5CA1CC"
  }
});

export default function Meta({ caption, username = "Thomas J" }) {
  return (
    <View style={styles.root}>
      <View style={styles.wrapper}>
        <Text style={styles.text}>
          Likes by <Text style={systemWeights.regular}>The Man </Text>{" "}
          <Text style={systemWeights.regular}>1,444</Text>
        </Text>
      </View>
      <View style={styles.wrapper}>
        <Text numberOfLines={2} style={styles.text}>
          <Text style={systemWeights.regular}>{username}</Text> {caption}
        </Text>
      </View>
    </View>
  );
}
