import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  CameraRoll,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity
} from "react-native";

///////////////////////////////////////////////////////////////////
//fix camera roll then must re-design or re-think text/caption
//in order to have a preliminary screen before sharing photo
///////////////////////////////////////////////////////////////////

const MAX_PHOTOS = 20;
const PADDING = 17;
const MARGIN = 10;

const { width } = Dimensions.get("window");

class CreatePhotoScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      loading: false,
      selected: null,
      hasNextPage: false,
      endCursor: "",
      firstQuery: true
    };
    props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this._getPhotos();
  }

  _onNavigatorEvent = e => {
    if (e.type === "NavBarButtonPress") {
      if (e.id === "goToOnboardPhoto") {
        this.props.navigator.push({
          screen: "mobile.OnboardPhotoScreen",
          title: "Share your story",
          passProps: {
            image: this.state.selected
          }
        });
      }
    }
  };

  _getPhotos = async after => {
    if (this.state.firstQuery) {
      this.setState({ loading: true });
    }

    const res = await CameraRoll.getPhotos({
      first: MAX_PHOTOS,
      after
    });

    this.setState({
      images: [...this.state.images, ...res.edges],
      loading: false,
      hasNextPage: res.page_info.has_next_page,
      endCursor: res.page_info.end_cursor,
      firstQuery: false
    });

    console.log("====================================");
    console.log("res", res);
    console.log("====================================");
  };

  _renderItem = ({ item }) => {
    const isSelected =
      this.state.selected &&
      this.state.selected.node.image.filename === item.node.image.filename;
    return (
      <TouchableOpacity
        disabled={isSelected}
        feedback="opacity"
        onPress={() => this._onSelect(item)}
        style={styles.imageWrapper}
      >
        <Image source={{ uri: item.node.image.uri }} style={styles._image} />
        {isSelected && <View style={styles.imageHover} />}
      </TouchableOpacity>
    );
  };

  _onSelect = selected => {
    this.setState({ selected });
    this.props.navigator.setButtons({
      rightButtons: [
        {
          id: "goToOnboardPhoto",
          title: "Next"
        }
      ],
      animated: true
    });
  };

  _keyExtractor = item => item.node.image.filename;

  _onEndReached = () => {
    if (this.state.hasNextPage) {
      this._getPhotos(this.state.endCursor);
    }
  };

  render() {
    console.log("====================================");
    console.log("state", this.state);
    console.log("====================================");
    if (this.state.loading) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <FlatList
        data={this.state.images}
        renderItem={this._renderItem}
        numColumns={3}
        keyExtractor={this._keyExtractor}
        extraData={this.state}
        onEndReached={this._onEndReached}
      />
    );
  }
}

const styles = StyleSheet.create({
  imageWrapper: {
    width: (width - PADDING * 2 - MARGIN * 2) / 3,
    height: (width - PADDING * 2 - MARGIN * 2) / 3,
    borderRadius: 3,
    marginVertical: "2.5%",
    marginHorizontal: MARGIN
  },
  _image: {
    flex: 1,
    borderRadius: 3
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageHover: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 3,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
});

export default CreatePhotoScreen;

// class CreatePhotoScreen extends PureComponent {
//   state = {
//     images: [],
//     loading: false,
//     selected: null,
//     hasNextPage: false,
//     endCursor: "",
//     firstQuery: true
//   };

//   componentDidMount() {
//     this._getPhotos;
//   }

//   _getPhotos = async after => {
//     if (this.state.firstQuery) {
//       this.setState({ loading: true });
//     }

//     const res = await CameraRoll.getPhotos({
//       first: MAX_PHOTOS,
//       after
//     });

//     this.setState({
//       images: [...this.state.images, ...res.edges],
//       loading: false,
//       hasNextPage: res.page_info.has_next_page,
//       endCursor: res.page_info.end_cursor,
//       firstQuery: false
//     });

//     console.log("====================================");
//     console.log("res", res);
//     console.log("====================================");
//   };

//   _renderItem = ({ item }) => {
//     const isSelected =
//       this.state.selected &&
//       this.state.selected.node.image.filename == item.node.image.filename;
//     return (
//       <TouchabOpacityOpacity
//         disabled={isSelected}
//         style={styles.imageWrapper}
//         onPress={() => this._onSelect(item)}
//       >
//         <Image source={{ uri: item.node.image.uri }} style={styles._image} />
//         {isSelected && <View style={styles.imageHover} />}
//       </TouchabOpacityOpacity>
//     );
//   };

//   _onSelect = selected => {
//     this.setState({ selected });
//   };

//   _keyExtractor = item => item.node.image.filename;

//   _onEndReached = () => {
//     if (this.state.hasNextPage) {
//       this._getPhotos(this.state.endCursor);
//     }
//   };

//   render() {
//     console.log("state", this.state);
//     if (this.state.loading) {
//       return (
//         <View style={loadingWrapper}>
//           <ActivityIndicator />
//         </View>
//       );
//     }
//     return (
//       <FlatList
//         data={this.state.images}
//         renderItem={this._renderItem}
//         numColumns={3}
//         keyExtractor={this._keyExtractor}
//         extraData={this.state}
//         onEndReached={this.onEndReached}
//       />
//     );
//   }
// }
