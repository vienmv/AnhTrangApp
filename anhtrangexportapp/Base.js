import { ImagePicker } from 'expo';
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  Image,
  ImageEditor,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';

export const BASE_URL = "http://150.95.113.214";
// export const BASE_URL = "http://192.168.1.77:8080";
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const Base64 = {
  btoa: (input = '') => {
    let str = input;
    let output = '';

    for (let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || (map = '=', i % 1);
      output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

      charCode = str.charCodeAt(i += 3 / 4);

      if (charCode > 0xFF) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }

      block = block << 8 | charCode;
    }

    return output;
  }
}

export const Authentication = {
  setAuth: async (user) => {
    await AsyncStorage.setItem("loginuser", JSON.stringify(user));
  },
  loginUser: async () => {
    const json = await AsyncStorage.getItem("loginuser");
    if (json) {
      return JSON.parse(json);
    }
    return
  },
  logout: async () => {
    await AsyncStorage.removeItem("loginuser");
    Actions.reset("login")
  }
}

export const DeviceToken = {
  setTokenDevice: async (deviceId) => {
    await AsyncStorage.setItem("deviceId", deviceId);
  },
  getTokenDevice: async () => {
    return await AsyncStorage.getItem("deviceId");
  }
}

export const NumberUtils = {
  getOnlyDigit: (value) => {
    return String(value).replace(/[^\d-]/g, "");
  },
  formatNumber: (value) => {
    if (value == "-") {
      return value;
    }
    var sign = "";
    if (value && Number(NumberUtils.getOnlyDigit(value)) < 0) {
      sign = "-";
    }
    return sign + NumberUtils.getOnlyDigit(value).replace(/\D/g, "").replace(
      /\B(?=(\d{3})+(?!\d))/g, ".");
  }
}

export const api = {
  authFetch: async (path, method, data, handleSuccess, handleFail) => {
    const user = await Authentication.loginUser()

    if (!user) {
      Authentication.logout()
      return
    }

    fetch(BASE_URL + path, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic " + user.base64
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.status == 200) {
          handleSuccess(response)
        } else if (response.status == 401) {
          Authentication.logout();
        } else {
          handleFail(response.status);
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  authFetchWithGet: async (path, handleSuccess, handleFail) => {
    const user = await Authentication.loginUser()

    if (!user) {
      Authentication.logout()
      return
    }

    fetch(BASE_URL + path, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic " + user.base64
      }
    })
      .then(response => {
        if (response.status == 200) {
          handleSuccess(response)
        } else if (response.status == 401) {
          Authentication.logout();
        } else {
          handleFail(response.status)
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  anonymousFetch: async (path, method, data, handleSuccess, handleFail) => {
    fetch(BASE_URL + path, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.status == 200) {
          handleSuccess(response)
        } else {
          handleFail(response.status)
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  authUploadImage: async (path, formData, handleSuccess, handleFail) => {
    const user = await Authentication.loginUser()

    if (!user) {
      Authentication.logout()
      return
    }

    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        "Authorization": "Basic " + user.base64
      }
    };
    fetch(BASE_URL + path, options).then(response => {
      if (response.status == 200) {
        handleSuccess(response)
      } else if (response.status == 401) {
        Authentication.logout();
      } else {
        handleFail(response.status)
      }
    }).catch(error => {
      console.log(error)
      handleFail()
    });
  },
  anonymousGet: async (path) => {
    return fetch(BASE_URL + path, {
      method: "get",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json"
      }
    }).catch(error => {
      console.log(error)
      return error;
    });
  },
}

export const CameraImage = {
  _takePhoto: async (callback) => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        quality: 0.7
      });

      callback(pickerResult);
    }
  },
  _pickImage: async (callback) => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        quality: 0.7
      });
      callback(pickerResult);
    }
  },
  cropImage: async (pickupResult) => {
    try {
      var wantedMaxSize = 800;
      var rawheight = pickupResult.height;
      var rawwidth = pickupResult.width;
      var ratio = rawwidth / rawheight;
      var wantedwidth = wantedMaxSize;
      var wantedheight = wantedMaxSize / ratio;
      // check vertical or horizontal
      if (rawheight > rawwidth) {
        wantedwidth = wantedMaxSize * ratio;
        wantedheight = wantedMaxSize;
      }

      let resizedUri = await new Promise((resolve, reject) => {
        ImageEditor.cropImage(pickupResult.uri,
          {
            offset: { x: 0, y: 0 },
            size: { width: pickupResult.width, height: pickupResult.height },
            displaySize: { width: wantedwidth, height: wantedheight },
            resizeMode: 'contain',
          },
          (uri) => resolve(uri),
          () => reject(),
        )
      })
      return resizedUri;
    } catch (e) {
      console.log({ e });
    }
    return pickupResult.uri;
  },
  _handleImagePicked: async (pickerResult, callback) => {
    try {
      if (!pickerResult.cancelled) {
        var wantedMaxSize = 800;
        var rawheight = pickerResult.height;
        var rawwidth = pickerResult.width;
        var ratio = rawwidth / rawheight;
        var wantedwidth = wantedMaxSize;
        var wantedheight = wantedMaxSize / ratio;
        // check vertical or horizontal
        if (rawheight > rawwidth) {
          wantedwidth = wantedMaxSize * ratio;
          wantedheight = wantedMaxSize;
        }

        let resizedUri = await new Promise((resolve, reject) => {
          ImageEditor.cropImage(pickerResult.uri,
            {
              offset: { x: 0, y: 0 },
              size: { width: pickerResult.width, height: pickerResult.height },
              displaySize: { width: wantedwidth, height: wantedheight },
              resizeMode: 'contain',
            },
            (uri) => resolve(uri),
            () => reject(),
          );
        });
        callback(resizedUri, pickerResult.uri);
      }
    } catch (e) {
      console.log({ e });
      Alert.alert('Lỗi', 'Tải ảnh lên bị lỗi. Thử lại ảnh mới xem sao.');
    }
  }
}
//render processing icon loading
export class RenderProcessing extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: "#000",
          opacity: 0.3,
          position: "absolute",
          zIndex: 99999,
          width: "100%",
          height: "100%",
          justifyContent: 'center'
        }}
      >
        <ActivityIndicator size="small" color="white" />
      </View>
    )
  }
}

export class MultipleImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: this.props.photos ? this.props.photos : []
    }
  }

  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      let images = this.state.photos.concat(photos)
      images = this.getUnique(images, "id")

      this.setState({ photos: images })
      this.props.callback(images)
      Actions.pop()
    }).catch((e) => console.log(e))
  }

  getUnique = (arr, comp) => {
    const unique = arr
      .map(e => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => arr[e]).map(e => arr[e]);
    return unique;
  }

  deletePhoto = (item) => {
    const photos = this.state.photos.filter(_item => item.id !== _item.id)
    this.setState({ photos: photos })
    this.props.callback(photos)
  }

  renderImage() {
    return (
      <FlatList
        horizontal={true}
        data={this.state.photos}
        renderItem={({ item }) => (
          <View style={{ height: 100, width: 100 }}>
            <TouchableOpacity style={{ position: 'absolute', top: 0, right: 5, zIndex: 1000001 }} onPress={() => this.deletePhoto(item)}>
              <Image
                source={require("./assets/trash.png")}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            <Image
              style={{ height: 100, width: 100, resizeMode: 'cover', zIndex: 1000000 }}
              source={{ uri: item.uri }}
            />
            <RenderProcessing />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }

  render() {
    return (
      <View style={{
        backgroundColor: '#fff',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 5,
        padding: 10
      }}>
        <TouchableOpacity style={{ flex: 1, marginBottom: 10 }}
          onPress={() => Actions.ImagePickup({ imageBrowserCallback: this.imageBrowserCallback })}
        >
          <Text style={{ color: '#2b8eff', textAlign: 'center' }}>Chọn ảnh</Text>
        </TouchableOpacity>
        {this.renderImage()}
      </View>
    )
  }
}

export class MultipleImageViewer extends Component {
  renderImageSources = () => {
    const imageSources = []
    this.props.photos.map((item) => {
      imageSources.push({ source: { uri: BASE_URL + "/image/" + item.toString() } })
    })
    return imageSources
  }

  render() {
    return (
      <FlatList
        horizontal={true}
        data={this.props.photos}
        renderItem={({ item, index }) => {
          const url = BASE_URL + "/image/" + item.toString()
          return (
            <TouchableOpacity onPress={() => { this.props.renderGallery(this.renderImageSources(), index) }}>
              <Image
                style={{ height: 100, width: 100, resizeMode: 'cover', zIndex: 1000000 }}
                source={{ uri: url }}
                onLoadEnd={() => { }}
              />
              <RenderProcessing />
            </TouchableOpacity>
          )
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }
}

export class AddFloatingButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.action}
        style={styles.fab}
      >
        <Image
          source={require("./assets/more.png")}
          style={{
            height: 45,
            width: 45
          }}
        />
      </TouchableOpacity>
    )
  }
}

export class AddFloatingCameraButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.action}
        style={[styles.fab, { left: 10 }]}
      >
        <Image
          source={require("./assets/camera.png")}
          style={{
            height: 45,
            width: 45,
          }}
        />
      </TouchableOpacity>
    )
  }
}

export class InputSearch extends Component {
  render() {
    return (
      <View>
        <TextInput
          style={[styles.searchInput]}
          placeholder={this.props.placeholder}
          onChangeText={this.props.changeText}
          defaultValue={this.props.defaultValue ? this.props.defaultValue : ""}
          returnKeyType="search"
          returnKeyLabel="Tìm"
          underlineColorAndroid="transparent"
          onSubmitEditing={this.props.search}
        />
        {/* <TouchableOpacity
          style={{ position: "absolute", left: 20, top: 15 }}
          onPress={this.props.search}
        >
          <Icon name="ios-search" android="md-search" size={25} color="#828282" />
        </TouchableOpacity> */}
      </View>
    )
  }
}

export class DateTimePicker extends Component {
  render() {
    return <DatePicker
      style={{ flex: 1 }}
      date={this.props.date}
      mode="date"
      placeholder={this.props.placeholder ? this.props.placeholder : "Chọn Ngày "}
      format="DD/MM/YYYY"
      confirmBtnText="Chọn"
      cancelBtnText="Hủy"
      showIcon={true}
      androidMode="spinner"
      allowFontScaling={false}
      customStyles={{
        dateIcon: {
          position: 'absolute',
          left: 15,
          top: 10,
          marginLeft: 0,
          width: 20,
          height: 20
        },
        dateInput: styles.searchInput
      }}
      onDateChange={this.props.onDateChange}
    />
  }
}

export const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
    textAlign: "left",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
    color: 'red'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  vContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  hContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  inputs: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: "#C4C4C4"
  },
  buttonContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: "#089101",
    margin: 10,
    shadowOpacity: 1,
    shadowRadius: 4,
    padding: 10,
    shadowColor: 'rgba(143, 184, 140, 0.1)',
    shadowOffset: { height: 0, width: 0 },
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  textArea: {
    height: 100,
    backgroundColor: "#FFFFFF",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#f0f0f0"
  },
  searchInput: {
    height: 35,
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0"
  },
  itemHeadText: {
    color: "#089101",
    fontSize: 14,
    fontWeight: "bold",
    width: "80%"
  },
  item: {
    backgroundColor: "#f2f2f2",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    padding: 10,
    borderRadius: 5
  },
  itemHead: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D5d5d5"
  },
  itemBody: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D5d5d5",
    paddingBottom: 5,
    paddingTop: 5
  },
  itemFoot: {
    flex: 1,
    flexDirection: "row",
  },
  itemImage: {
    backgroundColor: "#fff",
    margin: 10
  },
  info: {
    fontSize: 13,
    color: "#262626",
    lineHeight: 18,
    flex: 1
  },
  title: {
    color: "#089101",
    fontSize: 13,
    lineHeight: 18
  },
  fab: {
    backgroundColor: "transparent",
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 45,
    height: 45,
    alignItems: "center"
  },
  textRed: {
    color: '#247158'
  },
  itemIconButton: {
    marginLeft: 20
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    height: 45,
    zIndex: 1
  },
  buttonList: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    alignItems: "center",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#D5d5d5',

  },
  active: {
    textAlign: "center",
    paddingTop: 10,
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#089101',
  },
  inactive: {
    paddingTop: 10,
    textAlign: "center",
    flex: 1
  },
  activeText: {
    color: "#089101",
    fontWeight: "500"
  },
  inactiveText: {
    color: "#BDBDBD",
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  boxContainer: {
    margin: 30,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowColor: 'rgba(18, 108, 184, 0.15)',
    shadowOffset: { height: 0, width: 0 },
  },
  label: {
    fontSize: 14,
    lineHeight: 19,
    color: '#0f9cf3',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  headingText: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
    color: '#16384F'
  },
  errorLabel: {
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'left',
    color: '#F15931',
    marginLeft: 10,
    marginRight: 10
  },
  iconStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    marginLeft: 15
  },
  textAreaNCC: {
    fontSize: 14,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#089101"
  },
});