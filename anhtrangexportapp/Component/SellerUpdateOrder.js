import React, { Component } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { api, RenderProcessing, styles, NumberUtils } from '../Base';

class SellerUpdateOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.order.id,
      unit: this.props.order.unit,
      description: this.props.order.description,
      weight: String(this.props.order.weight),
      customerId: this.props.order.customerId,
      isLoading: false,
      weightInvalid: false,
      descriptionInvalid: false,
      customers: [],
      queryCustomer: this.props.order.customerName,
      user: {
        roles: [],
      }
    }
  }

  async loadCustomer() {
    const searchDTO = {
      length: 6,
      start: 0,
      roleList: ["ROLE_MEMBER"],
      search: {
        value: this.state.queryCustomer
      }
    }

    api.authFetch("/api/seller/user/list", "post", searchDTO,
      response => {
        response.json()
          .then(responseJson => {
            this.setState({ customers: [{ name: 'Chọn Nhà cung cấp', id: '', phone: '' }].concat(responseJson.data) });
          })
      })
  }

  async update() {
    this.setState({ isLoading: true })
    api.authFetch("/api/member/order/update", "put", this.state,
      (data) => {
        this.setState({ isLoading: false })
        Alert.alert('Thành công', 'Cập nhật thành công.',
          [
            {
              text: 'OK', onPress: () => {
                Actions.pop({ refresh: {} });
              }
            }
          ]
        )
      })
  }

  submit = () => {
    if (this.state.weight.length == 0) {
      this.setState({ weightInvalid: true })
    } else if (this.state.description.length == 0) {
      this.setState({ descriptionInvalid: true })
    } else {
      this.setState({ price: NumberUtils.getOnlyDigit(this.state.price) }, () => {
        this.update()
      })
    }
  }

  selectType = (index, value) => {
    this.setState({ status: parseInt(index) + 1 })
  }

  async addUser() {
    Actions.addCustomer({ user: this.state.user });
  }

  async loadCustomer(text) {
    if (text != "") {
      this.setState({ hideResults: false })
      this.state.queryCustomer = text;
    }
    const searchUserDTO = {
      length: 8,
      start: 0,
      roleList: ["ROLE_MEMBER"],
      search: {
        value: this.state.queryCustomer
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

  renderProcessing = () => {
    if (this.state.isLoading) {
      return (<RenderProcessing />)
    }
  }

  render() {
    this.data = [{ id: 1, title: "hello" }, { id: 2, title: "goodbye" }]
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} keyboardShouldPersistTaps="handled" extraScrollHeight={120}>
        {this.renderProcessing()}
        <View style={styles.vContainer}>
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
              defaultValue={this.state.queryCustomer}
              hideResults={this.state.hideResults}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                this.loadCustomer(text)
              }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  this.setState({ queryCustomer: item.name, hideResults: true, customerId: item.id })
                }}>
                  <Text style={{ margin: 5, color: '#fc712b' }} multiline={1}>{item.id} - {item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <Text style={styles.label}>Đơn vị tính</Text>
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
          <TouchableOpacity style={[styles.buttonContainer]} onPress={this.submit}>
            <Text style={styles.buttonText}>Cập Nhật</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }

}
export default SellerUpdateOrder;

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
            {this.props.name} - (ID: {this.props.id} )
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
    for (var i = 0; i < this.props.shippers.length; i++) {
      this.state.selected.set(this.props.shippers[i], true);
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