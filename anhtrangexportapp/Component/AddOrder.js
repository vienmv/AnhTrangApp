import React, { Component } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import { api, Authentication, RenderProcessing, styles } from '../Base';

export default class AddOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      unit: 'Kg',
      weight: '',
      description: '',
      isLoading: false,
      weightInvalid: false,
      descriptionInvalid: false,
      queryName: '',
      customerId: null,
      user: {
        roles: [],
      },
      customers: [],
      hideResults: true,
      hideOrder: true,
      options: ['Có', 'Không']
    }
  }

  componentDidMount() {
    this.getLoginUser()
  }

  async getLoginUser() {
    const user = await Authentication.loginUser();
    this.setState({ user: user });
    if (!(this.state.user.roles.includes("ROLE_ADMIN") || this.state.user.roles.includes("ROLE_SELLER") || this.state.user.roles.includes("ROLE_SHIPPER"))) {
      this.setState({ customerId: user.id })
    }
  }

  async loadCustomer(text) {
    if (text != "") {
      this.setState({ hideResults: false })
      this.state.queryName = text;
    }
    const searchUserDTO = {
      length: 8,
      start: 0,
      roleList: ["ROLE_MEMBER"],
      search: {
        value: this.state.queryName
      }
    }

    api.authFetch("/api/seller/user/list", "post", searchUserDTO, response => {
      response.json().then(responseJson => {
        if (this.state.user.roles.includes("ROLE_MEMBER")) {
          this.setState({ customers: [this.state.user].concat(responseJson.data) });
        } else {
          this.setState({ customers: (responseJson.data) });
        }
      });
    })
  }

  submit = () => {
    if (this.state.weight.length == 0) {
      this.setState({ weightInvalid: true })
    } else if (this.state.description.length == 0) {
      this.setState({ descriptionInvalid: true })
    } else {
      this.add()
    }
  }

  async addUser() {
    Actions.addCustomer({ user: this.state.user });
  }

  async add() {
    this.setState({ isLoading: true })

    api.authFetch("/api/member/order/add", "post", this.state,
      (data) => {
        this.setState({ isLoading: false })
        Alert.alert('Thành công', 'Tạo đơn hàng thành công.',
          [
            {
              text: 'OK', onPress: () => {
                Actions.pop({ refresh: {} })
              }
            },
          ]
        )
      })
  }

  renderProcessing = () => {
    if (this.state.isLoading) {
      return <RenderProcessing />
    }
    return null
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} keyboardShouldPersistTaps="handled" extraScrollHeight={120}>
        {this.renderProcessing()}

        <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/addorderbanner.png')} style={{ height: 100, width: '100%', resizeMode: 'contain' }} />
        </View>

        <View style={styles.vContainer}>
          {this.state.user.roles.includes("ROLE_ADMIN") || this.state.user.roles.includes("ROLE_SELLER") || this.state.user.roles.includes("ROLE_SHIPPER") ?
            <View>
              <View style={styles.hContainer}>
                <Text style={[styles.label]}>Nhà cung cấp</Text>
                <TouchableOpacity onPress={() => this.addUser()}>
                  <Text style={[styles.label, { color: 'red' }]}>+ Thêm mới</Text>
                </TouchableOpacity>
              </View>
              <Autocomplete
                style={{ height: 35 }}
                containerStyle={{ marginBottom: 10, width: "100%", height: this.state.hideResults ? 35 : 300 }}
                inputContainerStyle={[styles.searchInput, { justifyContent: 'center' }]}
                inputStyle={{
                  flex: 1,
                }}
                placeholder="Nhập tên nhà cung cấp"
                autoCorrect={false}
                data={this.state.customers}
                defaultValue={this.state.queryName}
                hideResults={this.state.hideResults}
                underlineColorAndroid="transparent"
                onChangeText={text => {
                  this.loadCustomer(text)
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => {
                    this.setState({ queryName: item.name, hideResults: true, customerId: item.id })
                  }}>
                    <Text style={{ margin: 5, color: '#fc712b' }} multiline={1}>{item.id} - {item.name}</Text>
                  </TouchableOpacity>
                )}
              /></View> : null}

          <Text style={[styles.label]}>Đơn vị tính</Text>
          <TextInput style={styles.inputs}
            placeholder="Kg, lít, can ..."
            underlineColorAndroid='transparent'
            value={this.state.unit}
            onChangeText={(unit) => this.setState({ unit: unit })} />

          <Text style={styles.label}>Số lượng</Text>
          <TextInput style={[styles.inputs, this.state.weightInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
            keyboardType="number-pad"
            placeholder="Số kg, lít, can cần bán..."
            underlineColorAndroid='transparent'
            value={this.state.weight}
            onChangeText={(weight) => this.setState({ weight: weight, weightInvalid: false })} />
          {this.state.weightInvalid ?
            <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
            : null}

          <Text style={styles.label}>Mô tả yêu cầu</Text>
          <TextInput style={[styles.textArea, this.state.descriptionInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
            multiline={true}
            numberOfLines={8}
            placeholder="Thông tin địa chỉ (thời gian, số nhà, v.v)"
            underlineColorAndroid='transparent'
            value={this.state.description}
            onChangeText={(description) => this.setState({ description: description, descriptionInvalid: false })} />
          {this.state.descriptionInvalid ?
            <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
            : null}

          {this.state.user.roles.includes("ROLE_ADMIN") ? 
            <View>
              <Text style={styles.label}>Ẩn Sale</Text>
              <ModalDropdown
                options={this.state.options}
                defaultValue={this.state.options[this.state.hideOrder ? 0 : 1]}
                onSelect={(index, value) => {
                  this.setState({ hideOrder: parseInt(index) == 0 ? true : false })
                }}
                
                style={{
                  backgroundColor: "#FFFFFF",
                  margin: 10,
                  padding: 10,
                  borderRadius: 5
                }}
                textStyle={{ fontSize: 14, color: "#FF6600" }}
                dropdownTextStyle={{ fontSize: 14, color: "#000000" }}
                dropdownStyle={{ width: "100%", marginLeft: 20, height: 80 }}
              />  
            </View>
          : null}
          <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', alignItems: 'center' }]} onPress={this.submit}>
            <Text style={styles.buttonText}>Tạo đơn hàng</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAwareScrollView>
    )
  }
}

