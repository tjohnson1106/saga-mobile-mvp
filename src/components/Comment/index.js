import React, { PureComponent } from "react";
import { View, Text, StyleSheet } from "react-native";

class Comment extends PureComponent {
  render() {
    return (
      <View style={styles.root}>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height: 50
  }
});

export default Comment;
