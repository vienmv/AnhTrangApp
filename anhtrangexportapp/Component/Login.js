import React, { Component } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { Authentication, Base64, BASE_URL, DeviceToken, RenderProcessing, styles } from '../Base';

class Login extends Component {
  async login() {
    this.setState({ isLoading: true })
    const token = await DeviceToken.getTokenDevice()
    const base64 = Base64.btoa(this.state.phone + ":" + this.state.password);
    fetch(BASE_URL + "/api/member/me", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Authorization": "Basic " + base64
      },
      body: "token=" + token
    }).then(response => {
      this.setState({ isLoading: false })
      return response.json()
    })
      .then(responseJson => {
        if (responseJson.status == 401) {
          this.setState({ loginFail: true })
        } else {
          const user = responseJson;
          user.base64 = base64;
          user.password = this.state.password;
          Authentication.setAuth(user);
          Actions.reset("home");
        }
      }).catch(error => {
        console.log(error)
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      password: '',
      isLoading: true,
      loginFail: false,
      phoneInvalid: false,
      passwordInvalid: false
    }
    this.checkAuthen()
  }

  checkAuthen = async () => {
    const user = await Authentication.loginUser()
    if (user) {
      Actions.reset("home")
    } else {
      this.setState({ isLoading: false })
    }
  }

  submit = () => {
    if (this.state.phone.length == 0) {
      this.setState({ phoneInvalid: true })
    } else if (this.state.password.length < 6) {
      this.setState({ passwordInvalid: true })
    } else {
      this.login()
    }
  }

  renderProcessing = () => {
    if (this.state.isLoading) {
      return <RenderProcessing />
    }
    return null
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require('../assets/bg.png')} style={styles.backgroundImage} />
        <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/logo.png')} style={{ height: 50, width: 150, resizeMode: 'contain' }} />
        </View>
        {this.renderProcessing()}
        <View style={styles.boxContainer}>
          <View style={[styles.vContainer]}>
            <Text style={styles.headingText}>ĐĂNG NHẬP</Text>
            {this.state.loginFail ?
              <Text style={styles.errorLabel}>Tài khoản hoặc mật khẩu không đúng!</Text>
              : null}
            <Text style={styles.label}>Số điện thoại hoặc tài khoản</Text>
            <TextInput style={[styles.inputs, this.state.phoneInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Số điện thoại hoặc tài khoản"
              keyboardType="phone-pad"
              underlineColorAndroid='transparent'
              value={this.state.phone}
              onChangeText={(phone) => this.setState({ phone: phone, loginFail: false, phoneInvalid: false })} />
            {this.state.phoneInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
              : null}

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput style={[styles.inputs, this.state.passwordInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Mật khẩu"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              value={this.state.password}
              onChangeText={(password) => this.setState({ password: password, loginFail: false, passwordInvalid: false })}
            />
            {this.state.passwordInvalid ?
              <Text style={styles.errorLabel}>Tối thiểu 6 ký tự!</Text>
              : null}

            <TouchableOpacity style={{ marginBottom: 20, marginRight: 10 }} onPress={() => Actions.ForgotPassword()}>
              <Text style={{
                fontSize: 13,
                lineHeight: 17,
                textAlign: 'right',
                fontStyle: 'italic',
                color: '#247158'
              }}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonContainer]} onPress={this.submit}>
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 30 }} onPress={() => Actions.register()}>
              <Text style={{
                fontSize: 15,
                lineHeight: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#247158',
                textTransform: 'uppercase'
              }}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}
export default Login;