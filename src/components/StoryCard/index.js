import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text, FlatList } from "react-native";
import { human, iOSColors } from "react-native-typography";
import { graphql } from "react-apollo";
import { defaultDataIdFromObject } from "apollo-cache-inmemory";

import Header from "./Header";
import ActionButtons from "./ActionButtons";
import Meta from "./Meta";
import CommentInput from "../CommentInput";
import { likePhotoMutation } from "../../graphql/mutations";
import { FeedsPhotoFragment } from "../../screens/FeedsScreen/fragments";

class StoryCard extends Component {
  _onLikedPress = () => {
    this.props.onLikePhotoMutation();
  };

  render() {
    return (
      <View style={styles.root}>
        <Header />
        <Image
          style={styles.img}
          source={{
            uri: this.props.data.imageUrl
          }}
        />

        <ActionButtons
          viewerLike={this.props.data.viewerLike}
          onLikedPress={this._onLikedPress}
        />
        <Meta caption={this.props.data.caption} />
        <View style={styles.commentsWrapper}>
          <TouchableOpacity>
            <Text style={styles.commentViewAll}>View all 14 comments</Text>
          </TouchableOpacity>
          <CommentInput photoId={this.props.data.id} navigator={this.props.navigator} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    minHeight: 700,
    paddingBottom: 10,
    backgroundColor: "#282e45",
    // backgroundColor: "#fff",
    flex: 1,
    borderWidth: 4,
    borderColor: "#191414",
    margin: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  img: {
    flex: 1
  },
  commentsWrapper: {
    height: 50,
    paddingHorizontal: 16
  },
  commentViewAll: {
    ...human.calloutObject,
    color: iOSColors.midGray
  }
});

export default graphql(likePhotoMutation, {
  props: ({ mutate, ownProps }) => ({
    onLikePhotoMutation: () =>
      mutate({
        variables: { photoId: ownProps.data.id },
        update: (store, { data: { likePhoto } }) => {
          const id = defaultDataIdFromObject({
            __typename: "Photo",
            id: ownProps.data.id
          });

          const photo = store.readFragment({
            id,
            fragment: FeedsPhotoFragment
          });

          store.writeFragment({
            id,
            fragment: FeedsPhotoFragment,
            data: {
              ...photo,
              viewerLike: likePhoto
            }
          });
        }
      })
  })
})(StoryCard);
