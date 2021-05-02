import React, { Component } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { api, Authentication, Base64, RenderProcessing, styles } from '../Base';

class ChangePassword extends Component {

  constructor(props) {
    super(props)
    this.state = {
      repassword: '',
      password: '',
      isLoading: false,
      passwordInvalid: false,
      repasswordInvalid: false,
    }
  }

  async changePassword() {
    this.setState({ isLoading: true })
    api.authFetch("/api/member/password", "put", this.state,
      () => {
        this.setState({ isLoading: false })
        this.setPassword()

        Alert.alert('Thành công', 'Đổi mật khẩu thành công.',
          [
            {
              text: 'OK', onPress: () => {
                Actions.pop();
              }
            },
          ]
        )
      }, status => {
        this.setState({ isLoading: false })
        Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng.')
      });
  }

  setPassword = async () => {
    const user = await Authentication.loginUser();
    user.password = this.state.repassword;
    user.base64 = Base64.btoa(user.phone + ":" + user.password);
    await Authentication.setAuth(user)
  }

  submit = () => {
    if (this.state.password.length < 6) {
      this.setState({ passwordInvalid: true })
    } else if (this.state.repassword.length < 6) {
      this.setState({ repasswordInvalid: true })
    } else {
      this.changePassword()
    }
  }

  renderProcessing = () => {
    if (this.state.isLoading) {
      return (<RenderProcessing />)
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} keyboardShouldPersistTaps="handled" extraScrollHeight={120}>
        <View style={{ flex: 1 }}>
          {this.renderProcessing()}
          <View style={styles.vContainer}>

            <Text style={styles.label}>Mật khẩu cũ</Text>
            <TextInput style={[styles.inputs, this.state.passwordInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Mật khẩu cũ"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              value={this.state.password}
              onChangeText={(password) => this.setState({ password: password, passwordInvalid: false })}
            />
            {this.state.passwordInvalid ?
              <Text style={styles.errorLabel}>Tối thiểu 6 ký tự!</Text>
              : null}

            <Text style={styles.label}>Mật khẩu mới</Text>
            <TextInput style={[styles.inputs, this.state.repasswordInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Mật khẩu mới"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              value={this.state.repassword}
              onChangeText={(repassword) => this.setState({ repassword: repassword, repasswordInvalid: false })}
            />
            {this.state.repasswordInvalid ?
              <Text style={styles.errorLabel}>Tối thiểu 6 ký tự!</Text>
              : null}

            <TouchableOpacity style={[styles.buttonContainer]} onPress={this.submit}>
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
export default ChangePassword;
