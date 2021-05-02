import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import {
  Alert,
  AppState,
  AsyncStorage,
  Image,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Vibration,
} from 'react-native';

import { api, DeviceToken } from './Base';
import Routes from './Routes.js';
import { Actions } from 'react-native-router-flux';

console.disableYellowBox = true;
console.ignoredYellowBox = true;

Text.defaultProps = Text.defaultProps || {};
TextInput.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps.allowFontScaling = false;

export default class App extends Component {
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {

      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }

      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return;
      }

      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      await DeviceToken.setTokenDevice(token)

      if (Platform.OS === 'android') {
        Expo.Notifications.createChannelAndroidAsync('notification', {
          name: 'notification',
          priority: 'max',
          vibrate: [0, 250, 250, 250],
          sound: true,
        });
      }
    }
  }

  constructor(prop) {
    super(prop)
    this.state = {
      appState: "",
      notification: {},
    }
    this.checkVersion()
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = notification => {
    Vibration.vibrate();
    if (notification.origin == 'selected') {
      var data = notification.data
      if (data.type == 'NEWS') {
        Actions.listNews();
      } else if (data.type == 'ORDER') {
        Actions.inforOrder({ orderId: data.item })
      } else {//GENERAL, REMINDER
        Actions.listNotification();
      }
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.checkVersion()
    }
  }

  checkVersion = async () => {
    const response = await api.anonymousGet("/api/version/get");
    const versionDTO = await response.json();
    const versionNumber = await AsyncStorage.getItem("versionNumber");

    if (versionDTO.version && versionDTO.version > parseInt(versionNumber == null ? 0 : versionNumber)) {
      Alert.alert(
        'Cập nhật',
        'Đã có phiên bản mới ra mắt. Bạn vui lòng Cập Nhật ứng dụng của mình để tiếp tục.',
        [
          {
            text: 'Cập nhật', onPress: async () => {
              if (Platform.OS === 'android') {
                Linking.openURL('https://play.google.com/store/apps/details?id=com.linkin.anhtrangexport&hl=vi');
              } else {
                Linking.openURL('https://apps.apple.com/in/app/%C3%A1nh-trang-export-d%E1%BA%A7u-%C4%91en/id1492488150');
              }
              await AsyncStorage.setItem("versionNumber", String(versionDTO.version))
            }, style: 'ok'
          },
        ],
        { cancelable: false }
      )
    }
  }

  render() {
    return <View style={{ flex: 1 }}>
      <Routes />

      <TouchableOpacity
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          left: 10,
          bottom: 10,
          width: 50,
          height: 50,

        }}
        onPress={() => {
          Linking.openURL('tel:02436830880')
        }}
      >
        <Image
          source={require("./assets/phoneic.png")}
          style={{ width: 50, height: 50 }}
        />
      </TouchableOpacity>
    </View>
  }
}
