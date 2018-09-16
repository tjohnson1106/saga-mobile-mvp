import { Navigation } from "react-native-navigation";

import FeedsScreen from "./FeedsScreen";
import ExploreScreen from "./ExploreScreen";
import LoginScreen from "./LoginScreen";
import CreatePhotoScreen from "./CreatePhotoScreen";
import OnboardPhotoScreen from "./OnboardPhotoScreen";
import CommentsScreen from "./CommentsScreen";

import WithProvider from "../components/WithProvider";

export const registerScreens = () => {
  Navigation.registerComponent("mobile.FeedsScreen", () => WithProvider(FeedsScreen));
  Navigation.registerComponent("mobile.ExploreScreen", () => WithProvider(ExploreScreen));
  Navigation.registerComponent("mobile.LoginScreen", () => WithProvider(LoginScreen));

  Navigation.registerComponent("mobile.CreatePhotoScreen", () =>
    WithProvider(CreatePhotoScreen)
  );
  Navigation.registerComponent("mobile.OnboardPhotoScreen", () =>
    WithProvider(OnboardPhotoScreen)
  );
  Navigation.registerComponent("mobile.CommentsScreen", () =>
    WithProvider(CommentsScreen)
  );
};
