import React, { PureComponent } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import gql from "graphql-tag";
import { withApollo, graphql } from "react-apollo";

import { Divider } from "../../components";
import { colors } from "../../utils/themes";
import { uploadImageToS3 } from "../../utils/uploadImage";
import { createPhotoMutation } from "../../graphql/mutations";
import { FeedsPhotoFragment } from "../FeedsScreen/fragments";

const signS3Query = gql`
  query {
    presignUrl {
      url
      uploadUrl
    }
  }
`;

class OnboardPhotoScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      caption: "",
      loading: false
    };

    props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.props.navigator.setButtons({
      rightButtons: [
        {
          id: "sharePost",
          title: "share"
        }
      ],
      animated: true
    });
  }

  _onNavigatorEvent = e => {
    if (e.type === "NavBarButtonPress") {
      if (e.id === "sharePost") {
        this._onSharePostPress();
      }
    }
  };

  _onSharePostPress = async () => {
    this.setState({ loading: true });
    const res = await this.props.client.query({ query: signS3Query });
    const resultFromS3 = await uploadImageToS3(
      this.props.image.node.image.uri,
      res.data.presignUrl
    );

    await this.props.onCreatePhoto({
      imageUrl: resultFromS3.remoteUrl,
      caption: this.state.caption
    });

    this.setState({ loading: false });
    this.props.navigator.dismissModal({
      animationType: "slide-down"
    });

    console.log("============================");
    console.log("resultFromS3", resultFromS3);
    console.log("============================");
  };

  _onCaptionChange = caption => {
    this.setState({ caption });
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.root} onPress={Keyboard.dismiss}>
        <View style={styles.header}>
          <View style={styles.imageWrapper}>
            <ImageBackground
              style={styles.img}
              source={{ uri: this.props.image.node.image.uri }}
            >
              <View style={styles.onboardWrapper}>
                <TextInput
                  placeholder="Say something here..."
                  style={styles.onboardInput}
                  multiline
                  value={this.state.caption}
                  onChangeText={this._onCaptionChange}
                  //remember for android
                  underlineColorAndroid="rgba( 0. 0. 0. 0 )"
                />
              </View>
            </ImageBackground>
          </View>
        </View>
        <Divider />
        <TouchableOpacity style={styles.listItem}>
          <View>
            <Text>Tags</Text>

            <Ionicons name="ios-arrow-forward" size={20} color={colors.lightGray} />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#3D5099"
  },
  header: {
    height: 150,
    flexDirection: "row"
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    borderColor: "black",
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  img: {
    height: "100%",
    width: "100%"
  },
  onboardWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  onboardInput: {
    width: "100%",
    paddingVertical: 10,
    paddingRight: 10,
    height: 100,
    color: "black"
  },
  listItem: {
    height: 40,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    flexDirection: "row"
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

export default graphql(createPhotoMutation, {
  props: ({ mutate }) => ({
    onCreatePhoto: variables =>
      mutate({
        variables,
        update: (store, { data: { createPhoto } }) => {
          const query = store.readQuery({
            query: getPhotos
          });

          store.writeData({
            query: getPhotos,
            data: {
              photos: [createPhoto, ...query.photos]
            }
          });
        }
      })
  })
})(withApollo(OnboardPhotoScreen));
