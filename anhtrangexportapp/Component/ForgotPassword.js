import React, { Component } from 'react';
import { Alert, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles, RenderProcessing, api } from '../Base';
import { Actions } from 'react-native-router-flux';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: "",
      isLoading: false,
      phoneInvalid: false,
    }
  }

  async resetPassword() {
    this.setState({ isLoading: true })
    api.anonymousFetch('/api/resetpassword/' + this.state.phone, "put", this.state,
      () => {
        this.setState({ isLoading: false })
        Alert.alert('Thành công', 'Mật khẩu mới đã gửi tới sdt của bạn.', [
          {
            text: 'OK', onPress: () => {
              Actions.pop({ refresh: {} });
            }
          },
        ])
      }, status => {
        this.setState({ isLoading: false })
        Alert.alert('Lỗi', 'Số điện thoại không tồn tại.')
      });
  }

  submit = () => {
    if (this.state.phone.length < 10) {
      this.setState({ phoneInvalid: true })
    } else {
      this.resetPassword()
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

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput style={[styles.inputs, this.state.phoneInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Số điện thoại"
              underlineColorAndroid='transparent'
              value={this.state.phone}
              keyboardType="phone-pad"
              onChangeText={(phone) => {
                this.setState({ phone: phone, phoneInvalid: false })
              }}
            />
            {this.state.phoneInvalid ?
              <Text style={styles.errorLabel}>Số điện thoại của bạn không hợp lệ</Text>
              : null}

            <TouchableOpacity style={[styles.buttonContainer]} onPress={this.submit}>
              <Text style={styles.buttonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }

}



