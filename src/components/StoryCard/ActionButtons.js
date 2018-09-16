import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Evilicons from "react-native-vector-icons/EvilIcons";

import { makeHitSlop } from "../../utils/themes/metrics";

class ActionButtons extends Component {
  state = {};

  _getLikeIcon = () => {
    if (this.props.viewerLike) {
      return <Ionicons name="ios-heart" size={30} color="#FFFFE5" />;
    }
    {
      return <Ionicons name="ios-heart-outline" size={30} color="#FFFFE5" />;
    }
  };

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.actionWrapper}>
          <TouchableOpacity
            onPress={this.props.onLikedPress}
            hitSlop={makeHitSlop(10)}
            style={styles.action}
          >
            {this._getLikeIcon()}
          </TouchableOpacity>
          <TouchableOpacity hitSlop={makeHitSlop(10)} style={styles.action}>
            <Evilicons name="comment" size={35} color="#FFFFE5" />
          </TouchableOpacity>
          */}
        </View>
        <View style={styles.fakeView} />
        <TouchableOpacity hitSlop={makeHitSlop(10)} style={styles.bookmarkWrapper}>
          <Evilicons name="retweet" size={35} color="#FFFFE5" />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={makeHitSlop(10)} style={styles.bookmarkWrapper}>
          <Ionicons name="ios-bookmark-outline" size={28} color="#FFFFE5" />
        </TouchableOpacity>
        <View>{}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row"
  },
  actionWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },

  action: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  fakeView: {
    flex: 1.4
  },
  bookmarkWrapper: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "flex-end"
  }
});

export default ActionButtons;
