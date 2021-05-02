import React, { Component } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import local from '../local.json'

import { api, Authentication, styles, RenderProcessing } from '../Base';
import Autocomplete from 'react-native-autocomplete-input';

class UpdateProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      isLoading: false,
      name: '',
      address: '',
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

  componentDidMount() {
    this.getUser();
  }

  async getUser() {
    const user = await Authentication.loginUser();
    this.setState({
      user: user,
      name: user.name,
      address: user.address,
      nameInvalid: false,
      addressInvalid: false,
      cityName: user.cityName,
      districtName: user.districtName,
      wardsName: user.wardsName
    })
  }

  async updateProfile() {
    this.setState({ isLoading: true })
    api.authFetch("/api/member/profile", "put", this.state.user,
      (response) => {
        this.setState({ isLoading: false })
        if (response.status == 401) {
          Authentication.logout();
          return;
        } else {
          this.state.user.name = this.state.name;
          this.state.user.cityName = this.state.cityName;
          this.state.user.districtName = this.state.districtName;
          this.state.user.wardsName = this.state.wardsName;
          this.state.user.address = this.state.address;
          Authentication.setAuth(this.state.user)
          Alert.alert('Thành công', 'Cập nhật hồ sơ thành công.',
            [
              {
                text: 'OK', onPress: () => {
                  Actions.pop({ refresh: true });
                }
              },
            ]
          )
        }
      }).catch(error => {
        this.setState({ isLoading: false })
      });
  }

  submit = () => {
    if (this.state.name.length == 0) {
      this.setState({ nameInvalid: true })
    } else if (this.state.address.length == 0) {
      this.setState({ addressInvalid: true })
    } else if (this.state.cityName.length == 0) {
      this.setState({ nameCityInvalid: true })
    } else if (this.state.districtName.length == 0) {
      this.setState({ nameDistrictInvalid: true })
    } else if (this.state.wardsName.length == 0) {
      this.setState({ nameWardInvalid: true })
    } else {
      this.updateProfile()
    }
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
      return (<RenderProcessing />)
    }
    return null
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} keyboardShouldPersistTaps="handled" extraScrollHeight={120}>
        <View style={{ flex: 1 }}>
          {this.renderProcessing()}
          <View style={styles.vContainer}>
            <Text style={styles.label}>Tên của bạn</Text>
            <TextInput style={[styles.inputs, this.state.nameInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Tên của bạn"
              underlineColorAndroid='transparent'
              value={this.state.name}
              onChangeText={(name) => this.setState({ name: name, nameInvalid: false })} />
            {this.state.nameInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập tên</Text>
              : null}


            <Text style={styles.label}>Thành Phố</Text>
            <Autocomplete
              style={[{height: 35}, this.state.nameCityInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
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
              style={[{height: 35}, this.state.nameDistrictInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
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
              style={[{height: 35}, this.state.nameWardInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
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

            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput style={[styles.inputs, this.state.addressInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Địa chỉ"
              underlineColorAndroid='transparent'
              value={this.state.address}
              onChangeText={(address) => this.setState({ address: address, addressInvalid: false })} />
            {this.state.addressInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập địa chỉ</Text>
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
export default UpdateProfile;
