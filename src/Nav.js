import { Navigation } from "react-native-navigation";
import { registerScreens } from "./screens";
import { iconsMap } from "./utils/themes";
import appInitialized from "./utils/appInitialized";

registerScreens();

export function startLogin() {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "mobile.LoginScreen",
      navigatorStyle: {
        navBarHidden: true
      }
    }
  });
}

export function startMainApp() {
  Navigation.startTabBasedApp({
    tabs: [
      {
        label: "Feeds",
        screen: "mobile.FeedsScreen",
        title: "Saga",
        icon: iconsMap.home
      },
      {
        label: "Explore",
        screen: "mobile.ExploreScreen",
        title: "Explore",
        icons: iconsMap["ios-search"]
      }
    ]
  });
}

export function init() {
  appInitialized();
}
