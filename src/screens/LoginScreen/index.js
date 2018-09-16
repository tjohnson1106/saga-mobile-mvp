import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { iOSColors, human, systemWeights } from "react-native-typography";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import { fonts } from "../../utils/themes/fonts";
import { authToken } from "../../utils/constants";
import { startMainApp } from "../../Nav";

const COLORS_GRADIENTS = ["#4286f4", "#373b44"];

class LoginScreen extends Component {
  state = {
    loading: false
  };

  _onLoginFbPress = async () => {
    this.setState({ loading: true });
    const res = await LoginManager.logInWithReadPermissions(["public_profile", "email"]);

    if (res.grantedPermissions && !res.isCancelled) {
      const data = await AccessToken.getCurrentAccessToken();

      if (data) {
        const serverResponse = await this.props.loginMutation({
          variables: {
            provider: "FACEBOOK",
            token: data.accessToken
          }
        });
        const { token } = serverResponse.data.login;

        try {
          await AsyncStorage.setItem(authToken, token);

          this.setState({ loading: false });

          startMainApp();
        } catch (error) {
          throw error;
        }
      }
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.root}>
          <ActivityIndicator size="large" color="#318DEE" />
        </View>
      );
    }
    return (
      <View style={styles.root}>
        <StatusBar style="light-content" />
        <LinearGradient
          //left to right
          start={{
            x: 0.0,
            y: 0.0
          }}
          end={{
            x: 1.0,
            y: 1.0
          }}
          colors={COLORS_GRADIENTS}
          style={styles.header}
        >
          <Text style={styles.appName}>Saga Beta</Text>
        </LinearGradient>
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Email" />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Password" />
            </View>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.forgotWrapper}>
              <Text style={styles.callout}>Forgot password? </Text>
              <TouchableOpacity>
                <Text style={styles.buttonText}>Get help logging in?</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* new section for Facebook login */}

          <View style={styles.orWrapper}>
            <View style={styles.orDivider} />
            <View style={styles.orTextWrapper}>
              <Text style={styles.orText}>OR</Text>
            </View>
            <View style={styles.orDivider} />
          </View>
          <View style={[styles.section, styles.sectionButton]}>
            <TouchableOpacity onPress={this._onLoginFbPress} style={styles.fbLoginButton}>
              <MaterialCommunityIcons size={30} name="facebook-box" color="#318DEE" />
              <Text style={styles.fbLoginButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.noAccountWrapper}>
            <Text style={styles.callout}>Don't have an account? Sign up.</Text>
            <TouchableOpacity>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    flex: 0.3,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    flex: 1,
    alignSelf: "stretch"
  },
  appName: {
    color: iOSColors.white,
    fontSize: 50,
    fontFamily: fonts.sunflower
  },
  section: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch"
  },
  sectionButton: {
    justifyContent: "flex-start",
    flex: 0.7
  },
  inputWrapper: {
    height: 45,
    width: "90%",
    backgroundColor: "#FAF9F9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    marginBottom: 10,
    padding: 10
  },
  input: {
    flex: 1,
    padding: 0
  },
  loginButton: {
    height: 45,
    width: "90%",
    borderRadius: 5,
    backgroundColor: "#318DEE70",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  loginButtonText: {
    color: iOSColors.white
  },
  forgotWrapper: {
    marginVertical: 10,
    flexDirection: "row"
  },
  buttonText: {
    ...human.footnoteObject,
    ...systemWeights.semibold,
    color: "#318DEE"
  },
  callout: {
    ...human.footnoteObject,
    ...systemWeights.semibold,
    color: iOSColors.midGray
  },
  orWrapper: {
    width: "90%",
    marginVertical: 10,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center"
  },
  orDivider: {
    height: 1,
    width: "100%",
    flex: 1,
    backgroundColor: "#E4E4E4"
  },
  orTextWrapper: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  orText: {
    ...systemWeights.semibold,
    color: iOSColors.gray
  },
  fbLoginButton: {
    flexDirection: "row",
    height: 50,
    alignItems: "center"
  },
  fbLoginButtonText: {
    ...human.calloutObject,
    ...systemWeights.semibold,
    color: "#318DEE",
    marginLeft: 10
  },
  noAccountWrapper: {
    height: 50,
    width: "100%",
    borderColor: "#ECECEC",
    borderTopWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  }
});

const loginMutation = gql`
  mutation($provider: Provider, $token: String) {
    login(provider: $provider, token: $token) {
      token
    }
  }
`;

export default graphql(loginMutation, { name: `loginMutation` })(LoginScreen);
