import React, { Component } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import { api, RenderProcessing, styles } from '../Base';
import local from '../local.json';

var radio_props = [
  { label: 'ADMIN', value: "ROLE_ADMIN" },
  { label: 'SELLER', value: "ROLE_SELLER" },
  { label: 'SHIPPER', value: "ROLE_SHIPPER" },
  { label: 'NHÀ CUNG CẤP', value: "ROLE_MEMBER" },
];
var userGroup_prop = [];
const searchUserGroupDTO = {
  length: 8,
  start: 0,
  // search: {
  //   value: this.state.userGroupName
  // }
}
api.authFetch("/api/admin/user-group/search", "post", searchUserGroupDTO, response => {
  response.json().then(responseJson => {
    responseJson.data.map(item => {
      userGroup_prop.push({
        id: item.id,
        name: item.name
      });
    })
  });
})
export default class AddUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      password: '',
      repassword: '',
      name: '',
      address: '',
      cityName: '',
      districtName: '',
      wardsName: '',
      userGroupName: '',
      roles: [],
      userGroupIds: [],
      hideResultsGroup: true,
      hideResultsCity: true,
      hideResultsDistrict: true,
      hideResultsWard: true,
      processing: false,
      registerFail: false,
      phoneInvalid: false,
      passwordInvalid: false,
      nameInvalid: false,
      addressInvalid: false,
      repasswordInvalid: false,
      nameCityInvalid: false,
      nameDistrictInvalid: false,
      nameWardInvalid: false,
    }
  }


  submit = () => {
    if (this.state.name.length == 0) {
      this.setState({ nameInvalid: true })
    } else if (this.state.phone.length != 10) {
      this.setState({ phoneInvalid: true })
    } else if (this.state.password.length < 6) {
      this.setState({ passwordInvalid: true })
    } else if (this.state.password != this.state.repassword) {
      this.setState({ repasswordInvalid: true })
    } else if (this.state.address.length == 0) {
      this.setState({ addressInvalid: true })
    } else if (this.state.cityName.length == 0) {
      this.setState({ nameCityInvalid: true })
    } else if (this.state.districtName.length == 0) {
      this.setState({ nameDistrictInvalid: true })
    } else if (this.state.wardsName.length == 0) {
      this.setState({ nameWardInvalid: true })
    } else {
      this.add()
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

  async add() {
    this.setState({ processing: true })

    api.authFetch('/api/admin/user/add', "post", this.state, () => {
      this.setState({ processing: false });
      Alert.alert("Thành công",
        "Thêm nhân viên thành công.",
        [
          {
            text: "OK",
            onPress: () => {
              Actions.pop({ refresh: {} });
            }
          }
        ]);
    }, err => {
      this.setState({ registerFail: true, processing: false });
    })
  }

  renderProcessing = () => {
    if (this.state.processing) {
      return <RenderProcessing />;
    }
  };

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
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput style={[styles.inputs, this.state.passwordInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Mật khẩu"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              value={this.state.password}
              onChangeText={(password) => this.setState({ password: password, passwordInvalid: false })}
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
              onChangeText={(repassword) => this.setState({ repassword: repassword, repasswordInvalid: false })}
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
                  this.setState({ hideResultsDistrict: true, districtName: item.name, originWards: item.wards })

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

            <Text style={styles.label}>Địa Chỉ Cụ thể</Text>
            <TextInput style={[styles.inputs, this.state.addressInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
              placeholder="Địa Chỉ"
              underlineColorAndroid='transparent'
              value={this.state.address}
              onChangeText={(address) => this.setState({ address: address, addressInvalid: false })} />
            {this.state.addressInvalid ?
              <Text style={styles.errorLabel}>Vui lòng nhập địa chỉ</Text>
              : null}

            <Text style={styles.label}>Chọn vai trò</Text>
            <MultiSelectList data={radio_props} roles={this.state.roles} selected={(selected) => {
              const roles = []
              for (const entry of selected.entries()) {
                if (entry[1]) {
                  roles.push(entry[0])
                }
              }
              this.setState({ roles })
            }} />
            <Text style={styles.label}>Nhóm</Text>
            <MultiSelectLists data={userGroup_prop} userGroupIds={this.state.userGroupIds} selected={(selected) => {
              const userGroupIds = []
              for (const entry of selected.entries()) {
                if (entry[1]) {
                  userGroupIds.push(entry[0])
                }
              }
              this.setState({ userGroupIds })
            }} />
            <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', alignItems: 'center' }]} onPress={this.submit}>
              <Text style={styles.buttonText}>Tạo nhân viên</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}


class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? "red" : "black";
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={this._onPress}>
          <Text style={[styles.title, { color: textColor }]}>
            {this.props.name}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class MultiSelectList extends React.PureComponent {
  state = { selected: new Map() };

  _keyExtractor = (item, index) => index.toString();

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      this.props.selected(selected)
      return { selected };
    });
  };

  constructor(props) {
    super(props)
    for (var i = 0; i < this.props.roles.length; i++) {
      this.state.selected.set(this.props.roles[i], true);
    }
  }

  _renderItem = ({ item }) => (
    item.id != '' ?
      <MyListItem
        id={item.value}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(item.value)}
        name={item.label}
      /> : null
  );

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
class MultiSelectLists extends React.PureComponent {
  state = { selected: new Map() };

  _keyExtractor = (item, index) => index.toString();

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      this.props.selected(selected)
      return { selected };
    });
  };

  constructor(props) {
    super(props)
    for (var i = 0; i < this.props.userGroupIds.length; i++) {
      this.state.selected.set(this.props.userGroupIds[i], true);
    }
  }

  _renderItem = ({ item }) => (
    item.id != '' ?
      <MyListItem
        id={item.id}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(item.id)}
        name={item.name}
      /> : null
  );

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}