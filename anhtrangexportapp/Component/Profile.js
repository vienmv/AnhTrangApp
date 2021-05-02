import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Authentication, RenderProcessing, BASE_URL, DeviceToken } from '../Base';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        roles: [],
      },
      isLoading: false,
      point: ""
    };
  }

  async getLoginUser() {
    const user = await Authentication.loginUser();
    this.setState({ user: user });
  }

  componentDidMount() {
    this.getLoginUser();
  }

  componentWillReceiveProps() {
    this.getLoginUser();
  }

  async logout() {
    const token = await DeviceToken.getTokenDevice()
    this.setState({ isLoading: true });
    fetch(BASE_URL + "/api/member/logout", {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: "Basic " + this.state.user.base64
      },
      body: "token=" + token
    }).then(response => {
      Authentication.logout()
    }).catch(error => {
      this.setState({ isLoading: false });
    })
  }

  renderProcessing = () => {
    if (this.state.isLoading) {
      return (<RenderProcessing />)
    }
    return null
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        {this.renderProcessing()}
        <View style={styles.infoContainer}>
          <Image source={require('../assets/icon.png')} style={styles.avatar} />
          <Text style={styles.textStyle}>{this.state.user.name}</Text>
          <Text style={[styles.textInfo]}>{this.state.user.phone}</Text>
          <Text style={styles.textInfo}> {this.state.user.address} </Text>
          <Text style={styles.textInfo}> {this.state.user.cityName + ',' + this.state.user.districtName + ',' + this.state.user.wardsName} </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          {this.state.user.roles.includes("ROLE_SHIPPER") ?
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => Actions.listRoadOfShipper({ title: 'Cung Đường Ship: ' + this.state.user.name, user: this.state.user })}
            >
              <Image
                source={require("../assets/road.png")}
                style={styles.imageStyle}
              />
              <Text style={styles.info}>Cung Đường Ship</Text>
            </TouchableOpacity>
            : null}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => Actions.updateProfile()}
          >
            <Image
              source={require("../assets/pen.png")}
              style={styles.imageStyle}
            />
            <Text style={styles.info}>Cập nhật hồ sơ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => Actions.changePassword()}
          >
            <Image
              source={require("../assets/resetPassword1.png")}
              style={styles.imageStyle}
            />
            <Text style={styles.info}>Đổi mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.logout()}
          >
            <Image
              source={require("../assets/logout.png")}
              style={styles.imageStyle}
            />
            <Text style={styles.info}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}
export default Profile;

const styles = StyleSheet.create({
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    resizeMode: 'contain',
    borderWidth: 3,
    borderColor: '#fff'
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#089101",
    height: 250,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: '#089101',
    shadowOffset: { height: 0, width: 0 },
    borderRadius: 5
  },
  buttonContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: '#fff'
  },
  textInfo: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center'
  },
  imageStyle: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  info: { fontSize: 14, color: '#59616B', marginLeft: 10 }
});
