import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  RefreshControl,
  FlatList
} from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import { StoryCard } from "../../components";
import { FeedsPhotoFragment } from "./fragments";
import { iconsMap } from "../../utils/themes";

class FeedsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false
    };
    props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    this.props.navigator.setButtons({
      leftButtons: [
        {
          id: "camera",
          icon: iconsMap.camera
        }
      ]
    });
  }

  _onNavigatorEvent(e) {
    if (e.type === "NavBarButtonPress") {
      if (e.id === "camera") {
        this.props.navigator.showModal({
          screen: "mobile.CreatePhotoScreen",
          title: "Choose a photo",
          animationType: "slide up"
        });
      }
    }
  }

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => <StoryCard navigator={this.props.navigator} data={item} />;

  _refreshRequest = async () => {
    this.setState({
      isRefreshing: true
    });
    await this.props.data.refetch();
    this.setState({
      isRefreshing: false
    });
  };

  render() {
    if (this.props.data.loading) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <FlatList
        data={this.props.data.photos}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._refreshRequest}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const getPhotos = gql`
  query {
    photos {
      ...feedsPhoto
    }
  }
  ${FeedsPhotoFragment}
`;

export default graphql(getPhotos)(FeedsScreen);
