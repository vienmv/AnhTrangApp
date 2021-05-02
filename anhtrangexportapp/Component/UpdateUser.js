import React, { Component } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { api, Authentication, BASE_URL, CameraImage, MultipleImagePicker, RenderProcessing, styles } from '../Base';
import local from '../local.json';

class UpdateUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.user.id,
      name: this.props.user.name,
      address: this.props.user.address,
      cityName: this.props.user.cityName,
      districtName: this.props.user.districtName,
      wardsName: this.props.user.wardsName,
      phone: this.props.user.phone,
      processing: false,
      registerFail: false,
      phoneInvalid: false,
      nameInvalid: false,
      addressInvalid: false,
      images: this.props.user.images,
      hideResultsGroup: true,
      hideResultsCity: true,
      hideResultsDistrict: true,
      hideResultsWard: true,
      photos: this.renderImageSources(),
      user: { roles: [] },
      nameCityInvalid: false,
      nameDistrictInvalid: false,
      nameWardInvalid: false
    }
  }

  componentDidMount() {
    this.getLoginUser();
  }

  async getLoginUser() {
    const user = await Authentication.loginUser();
    if (!user) {
      await Authentication.logout();
      return;
    }
    this.setState({ user: user });
  }

  renderImageSources = () => {
    const imageSources = []
    this.props.user.images.map((item, i) => {
      imageSources.push({ id: i, uri: BASE_URL + "/image/" + item.toString() })
    })
    return imageSources
  }

  submit = () => {
    if (this.state.name.length == 0) {
      this.setState({ nameInvalid: true })
    } else if (this.state.phone.length != 10) {
      this.setState({ phoneInvalid: true })
    } else if (this.state.address.length == 0) {
      this.setState({ addressInvalid: true })
    } else if (this.state.cityName.length == 0) {
      this.setState({ nameCityInvalid: true })
    } else if (this.state.districtName.length == 0) {
      this.setState({ nameDistrictInvalid: true })
    } else if (this.state.wardsName.length == 0) {
      this.setState({ nameWardInvalid: true })
    } else {
      this.update()
    }
  }

  loadCityOptions = async (text) => {
    const options = [];
    local.map(item => {
      if (item.name.indexOf(text) != -1)
        options.push(item)
    })
    this.setState({ cities: options })
  }

  loadDistricts = async (text) => {
    const options = [];
    this.state.districts.map(item => {
      if (item.name.indexOf(text) != -1)
        options.push(item)
    })
    this.setState({ districts: options })
  };

  loadWards = async (text) => {
    const options = [];
    this.state.wards.map(item => {
      if (item.name.indexOf(text) != -1)
        options.push(item)
    })
    this.setState({ wards: options })
  };

  async update() {
    this.setState({ processing: true })
    let formData = new FormData();
    const images = [];
    for (var i = 0; i < this.state.photos.length; i++) {
      const item = this.state.photos[i]
      if (item.filename) {
        const name = item.filename
        const resizedUri = await CameraImage.cropImage(item)

        formData.append(`imageFiles[${i}]`, {
          uri: resizedUri,
          name: name,
          type: 'image/jpeg'
        })
      } else {
        this.state.images.map((image, k) => {
          if (k == item.id) {
            images.push(image)
          }
        })
      }
    }

    images.map((image, i) => {
      formData.append(`images[${i}]`, image)
    })

    formData.append("id", this.state.id)
    formData.append("name", this.state.name)
    formData.append("address", this.state.address)
    formData.append("phone", this.state.phone)
    formData.append("wardsName", this.state.wardsName)
    formData.append("districtName", this.state.districtName)
    formData.append("cityName", this.state.cityName)
    api.authUploadImage('/api/seller/user/update', formData, () => {
      this.setState({ processing: false });
      Alert.alert('Thành công', 'Cập nhật thành công.',
        [
          {
            text: 'OK', onPress: () => {
              Actions.pop({ refresh: {} });
            }
          },
        ]
      )
    }, err => {
      this.setState({ registerFail: true, processing: false });
    })
  }

  renderProcessing = () => {
    if (this.state.processing) {
      return <RenderProcessing />;
    }
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
        {this.renderProcessing()}
        <View style={styles.boxContainer}>
          <View style={[styles.vContainer]}>

            <Text style={styles.label}>Tên của bạn</Text>
            <TextInput style={[styles.inputs, (this.state.nameInvalid) ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Tên của bạn"
              underlineColorAndroid='transparent'
              value={this.state.name}
              onChangeText={(name) => this.setState({ name: name, nameInvalid: false })} />
            {this.state.nameInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập tên</Text>
              : null}
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput style={[styles.inputs, this.state.phoneInvalid || this.state.registerFail ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              underlineColorAndroid='transparent'
              value={this.state.phone}
              onChangeText={(phone) => this.setState({ phone: phone, registerFail: false, phoneInvalid: false })} />
            {this.state.phoneInvalid ?
              <Text style={styles.errorLabel}>Số điện thoại gồm 10 số</Text>
              : null}
            {this.state.registerFail ?
              <Text style={styles.errorLabel}>Số điện thoại đã tồn tại!</Text>
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
                  this.setState({ hideResultsCity: true, cityName: item.name, districts: item.districts })
                }}>
                  <Text style={{ margin: 5, color: '#fc712b' }} multiline={1}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            {this.state.nameCityInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
              : null}

            <Text style={styles.label}>Quận/Huyện</Text>
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
                  this.setState({ hideResultsDistrict: true, districtName: item.name, wards: item.wards })
                }}>
                  <Text style={{ margin: 5, color: '#fc712b' }} multiline={1}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            {this.state.nameDistrictInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
              : null}

            <Text style={styles.label}>Phường/xã</Text>
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

            <Text style={styles.label}>Địa Chỉ Cụ Thể</Text>
            <TextInput style={[styles.inputs, this.state.addressInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Địa Chỉ"
              underlineColorAndroid='transparent'
              value={this.state.address}
              onChangeText={(address) => this.setState({ address: address, addressInvalid: false })} />
            {this.state.addressInvalid ?
              <Text style={styles.errorLabel}>Địa Chỉ Cụ Thể</Text>
              : null}
           

            <MultipleImagePicker photos={this.state.photos} callback={(photos) => this.setState({ photos: photos })} />

            <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', alignItems: 'center' }]} onPress={this.submit}>
              <Text style={styles.buttonText}>Cập Nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default UpdateUser;