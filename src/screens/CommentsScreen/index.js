import React, { PureComponent } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { Comment } from "../../components/Comment/index";

const GET_COMMENTS = gql`
  query Comments($photoId: ID!) {
    comments(photoId: $photoId) {
      id
      text
      insertedAt
      user {
        # avatar
        id
        username
      }
    }
  }
`;

class CommentsScreen extends PureComponent {
  // flatlist
  _keyExtractor = item => item.id;
  // pass item to Comment component
  _renderItem = ({ item }) => <Comment {...item} />;

  render() {
    return (
      <Query query={GET_COMMENTS} variables={{ photoId: this.props.photoId }}>
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <View style={styles.root}>
                <ActivityIndicator size="large" />
              </View>
            );
          }
          if (error) {
            return (
              <View>
                <Text>{JSON.stringify(error)}</Text>
              </View>
            );
          }

          return (
            <FlatList
              data={data.comments}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          );
        }}
      </Query>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default CommentsScreen;
