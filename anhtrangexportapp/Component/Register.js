import React, { Component } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import local from '../local.json'

import { BASE_URL, RenderProcessing, styles } from '../Base';
import Autocomplete from 'react-native-autocomplete-input';

export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      password: '',
      repassword: '',
      name: '',
      address: '',
      isLoading: false,
      registerFail: false,
      phoneInvalid: false,
      passwordInvalid: false,
      nameInvalid: false,
      addressInvalid: false,
      repasswordInvalid: false,
      hideResultsCity: true,
      hideResultsDistrict: true,
      hideResultsWard: true,
      cityName: '',
      districtName: '',
      wardsName: '',
      nameCityInvalid: false,
      nameDistrictInvalid: false,
      nameWardInvalid: false
    }
  }

  submit = () => {
    if (this.state.name.length == 0) {
      this.setState({ nameInvalid: true })
    } else if (this.state.phone.length == 0) {
      this.setState({ phoneInvalid: true })
    } else if (this.state.password.length < 6) {
      this.setState({ passwordInvalid: true })
    } else if (this.state.password != this.state.repassword) {
      this.setState({ repasswordInvalid: true })
    } else if (this.state.cityName.trim().length == 0) {
      this.setState({ nameCityInvalid: true })
    } else if (this.state.districtName.trim().length == 0) {
      this.setState({ nameDistrictInvalid: true })
    } else if (this.state.wardsName.trim().length == 0) {
      this.setState({ nameWardInvalid: true })
    } else if (this.state.address.trim().length == 0) {
      this.setState({ addressInvalid: true })
    } else {
      this.register()
    }
  }


  register() {
    this.setState({ isLoading: true })
    const customer = this.state

    fetch(BASE_URL + "/api/user/register", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(customer)
    }).then(response => {
      this.setState({ isLoading: false })
      if (response.status && response.status == 409) {
        return { status: 409 };
      }
      return response.json()
    })
      .then(responseJson => {
        if (responseJson.status && responseJson.status == 409) {
          this.setState({ registerFail: true })
        } else {
          Alert.alert('Thành công', 'Đăng ký tài khoản thành công. Vui lòng đăng nhập.',
            [
              {
                text: 'OK', onPress: () => {
                  Actions.pop();
                }
              },
            ]
          )
        }
      }).catch(error => {
        console.log(error);
      });
  }

  loadCityOptions = async (text) => {
    const options = [];
    local.map(item => {
      if (item.name.indexOf(text) != -1)
        options.push(item)
    })
    this.setState({ cities: options })
  };


  loadDistricts = async (text) => {
    const options = [];
    this.state.originDistricts.map(item => {
      if (item.name.indexOf(text) != -1)
        options.push(item)
    })
    this.setState({ districts: options })
  };

  loadWards = async (text) => {
    const options = [];
    this.state.originWards.map(item => {
      if (item.name.indexOf(text) != -1)
        options.push(item)
    })
    this.setState({ wards: options })
  };

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
            <Text style={styles.headingText}>ĐĂNG KÝ</Text>
            {this.state.registerFail ?
              <Text style={styles.errorLabel}>Số điện thoại đã tồn tại!</Text>
              : null}

            <Text style={styles.label}>Tên của bạn</Text>
            <TextInput style={[styles.inputs, this.state.nameInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Tên của bạn"
              underlineColorAndroid='transparent'
              value={this.state.name}
              onChangeText={(name) => this.setState({ name: name, registerFail: false, nameInvalid: false })} />
            {this.state.nameInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập tên</Text>
              : null}

            <Text style={styles.label}>Số điện thoại hoặc tài khoản</Text>
            <TextInput style={[styles.inputs, this.state.phoneInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Số điện thoại hoặc tài khoản"
              keyboardType="phone-pad"
              underlineColorAndroid='transparent'
              value={this.state.phone}
              onChangeText={(phone) => this.setState({ phone: phone, registerFail: false, phoneInvalid: false })} />
            {this.state.phoneInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
              : null}

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput style={[styles.inputs, this.state.passwordInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Mật khẩu"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              value={this.state.password}
              onChangeText={(password) => this.setState({ password: password, registerFail: false, passwordInvalid: false })}
            />
            {this.state.passwordInvalid ?
              <Text style={styles.errorLabel}>Tối thiểu 6 ký tự!</Text>
              : null}

            <Text style={styles.label}>Nhập lại mật khẩu</Text>
            <TextInput style={[styles.inputs, this.state.repasswordInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              value={this.state.repassword}
              onChangeText={(repassword) => this.setState({ repassword: repassword, registerFail: false, repasswordInvalid: false })}
            />
            {this.state.repasswordInvalid ?
              <Text style={styles.errorLabel}>Mật khẩu không khớp</Text>
              : null}

            <Text style={styles.label}>Thành Phố</Text>
            <Autocomplete
              style={[{ height: 35 }, this.state.nameCityInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              containerStyle={{ marginBottom: 10, width: "100%", height: this.state.hideResultsCity ? 35 : 300 }}
              inputContainerStyle={[styles.searchInput, { justifyContent: 'center' }]}
              inputStyle={{
                flex: 1,
              }}
              placeholder="Nhập thành phố"
              autoCorrect={false}
              data={this.state.cities}
              hideResults={this.state.hideResultsCity}
              defaultValue={this.state.cityName}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                this.setState({ hideResultsCity: false, nameCityInvalid: false })
                this.loadCityOptions(text)
              }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  this.setState({ hideResultsCity: true, cityName: item.name, originDistricts: item.districts })
                }}>
                  <Text style={{ margin: 5, color: '#fc712b' }} multiline={1}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            {this.state.nameCityInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
              : null}

            <Text style={styles.label}>Quận Huyện</Text>
            <Autocomplete
              style={[{ height: 35 }, this.state.nameDistrictInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              containerStyle={{ marginBottom: 10, width: "100%", height: this.state.hideResultsDistrict ? 35 : 300 }}
              inputContainerStyle={[styles.searchInput, { justifyContent: 'center' }]}
              inputStyle={{
                flex: 1,
              }}
              placeholder="Nhập Quận Huyện"
              autoCorrect={false}
              data={this.state.districts}
              hideResults={this.state.hideResultsDistrict}
              defaultValue={this.state.districtName}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                this.setState({ hideResultsDistrict: false, nameDistrictInvalid: false })
                this.loadDistricts(text)
              }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  this.setState({ hideResultsDistrict: true, districtName: item.name, originWards: item.wards })

                }}>
                  <Text style={{ margin: 5, color: '#fc712b' }} multiline={1}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            {this.state.nameDistrictInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
              : null}

            <Text style={styles.label}>Phường xã</Text>
            <Autocomplete
              style={[{ height: 35 }, this.state.nameWardInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              containerStyle={{ marginBottom: 10, width: "100%", height: this.state.hideResultsWard ? 35 : 300 }}
              inputContainerStyle={[styles.searchInput, { justifyContent: 'center' }]}
              inputStyle={{
                flex: 1,
              }}
              placeholder="Nhập Quận Huyện"
              autoCorrect={false}
              data={this.state.wards}
              hideResults={this.state.hideResultsWard}
              defaultValue={this.state.wardsName}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                this.setState({ hideResultsWard: false, nameWardInvalid: false })
                this.loadWards(text)
              }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  this.setState({ hideResultsWard: true, wardsName: item.name })

                }}>
                  <Text style={{ margin: 5, color: '#fc712b' }} multiline={1}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            {this.state.nameWardInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
              : null}

            <Text style={styles.label}>Địa Chỉ</Text>
            <TextInput style={[styles.inputs, this.state.addressInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Địa Chỉ"
              underlineColorAndroid='transparent'
              value={this.state.address}
              onChangeText={(address) => this.setState({ address: address, registerFail: false, addressInvalid: false })} />
            {this.state.addressInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập địa chỉ</Text>
              : null}

            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={this.submit}>
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.label}>Bạn đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => Actions.pop()}>
                <Text style={{
                  fontSize: 14,
                  marginTop: 10,
                  lineHeight: 19,
                  fontWeight: 'bold',
                  color: '#247158',
                  textTransform: 'uppercase'
                }}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
