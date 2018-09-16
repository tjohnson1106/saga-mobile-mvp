import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { system, systemWeights, iOSColors } from "react-native-typography";

import { makeCircle, makeHitSlop } from "../../utils/themes";
import { fakeAvatar } from "../../utils/constants";
import human from "react-native-typography/dist/collections/human";

//avatar radius export as function from metrics in themes
export default function Header({
  avatar = fakeAvatar,
  username = "Username",
  location = "New York City"
}) {
  return (
    <View style={styles.root}>
      <View style={styles.userMetaWrapper}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatar }} style={styles.avatarImg} />
        </View>
        <View style={styles.userInforWrapper}>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.location}> {location}</Text>
        </View>
      </View>

      <TouchableOpacity
        hitSlop={makeHitSlop(20)}
        feedback="opacity"
        style={styles.btnWrapper}
      >
        <MaterialCommunityIcons name="dots-horizontal" size={25} color="#FFFFE5" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 60,
    backgroundColor: "#282e45",
    flexDirection: "row",
    paddingHorizontal: 16
  },
  userMetaWrapper: {
    flex: 1,
    flexDirection: "row"
  },
  btnWrapper: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarWrapper: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarImg: {
    ...makeCircle(45)
  },
  userInforWrapper: {
    justifyContent: "center",
    flex: 1,
    paddingLeft: 10
  },
  userName: {
    ...human.subheadObject,
    color: iOSColors.lightGray2
  },
  location: {
    ...human.footnoteObject,
    ...systemWeights.light,
    color: iOSColors.lightGray2
  }
});
