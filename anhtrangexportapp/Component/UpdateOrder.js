import React, { Component } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import { Actions } from 'react-native-router-flux';

import { api, RenderProcessing, styles, NumberUtils } from '../Base';

class UpdateOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.order.id,
      customerId: this.props.order.customerId,
      unit: this.props.order.unit,
      price: String(this.props.order.price == null ? "" : this.props.order.price),
      description: this.props.order.description,
      note: this.props.order.note,
      weight: String(this.props.order.weight),
      realWeight: String(this.props.order.realWeight == null ? "" : this.props.order.realWeight),
      status: this.props.order.status,
      sellerId: this.props.order.sellerId,
      sellerName: this.props.order.sellerName,
      shipperId: this.props.order.shipperId,
      shipperName: this.props.order.shipperName,
      type: this.props.order.type,
      hideOrder: this.props.order.hideOrder,
      shippers: this.props.order.shippers,
      customers: [],
      sellers: [],
      shipperList: [],
      shipperAll: [],
      queryCustomer: this.props.order.customerName,
      querySeller: this.props.order.sellerName,
      queryShipper: this.props.order.shipperName,
      hideResults: true,
      isLoading: false,
      statusOptions: ['Mới', 'Chờ ship', 'Hoàn Thành', 'Hủy'],
      selected: new Map(),
      options: ['Có', 'Không'],
      user: {
        roles: [],
      }
    }
    this.loadAllShipper()
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

    api.authFetch("/api/staff/user/list", "post", searchDTO,
      response => {
        response.json()
          .then(responseJson => {
            this.setState({ customers: [{ name: 'Chọn Nhà cung cấp', id: '', phone: '' }].concat(responseJson.data) });
          })
      })
  }

  async loadSeller() {
    const searchDTO = {
      length: 6,
      start: 0,
      roleList: ["ROLE_SELLER"],
      //typeList: [1],
      search: {
        value: this.state.querySeller
      }
    }

    api.authFetch("/api/admin/accounts", "post", searchDTO,
      response => {
        response.json()
          .then(responseJson => {
            this.setState({ sellers: [{ name: 'Chọn sale', id: '', phone: '' }].concat(responseJson.data) });
          })
      })
  }

  async loadShipper() {
    const searchDTO = {
      length: 6,
      start: 0,
      roleList: ["ROLE_SHIPPER"],
      search: {
        value: this.state.queryShipper
      }
    }

    api.authFetch("/api/admin/accounts", "post", searchDTO,
      response => {
        response.json()
          .then(responseJson => {
            this.setState({ shipperList: [{ name: 'Chọn shipper', id: '', phone: '' }].concat(responseJson.data) });
          })
      })
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

  async loadAllShipper() {
    const searchDTO = {
      length: null,
      start: null,
      roleList: ["ROLE_SHIPPER"],
      search: {
        value: ""
      }
    }

    api.authFetch("/api/admin/accounts", "post", searchDTO,
      response => {
        response.json()
          .then(responseJson => {
            this.setState({ shipperAll: responseJson.data });
          })
      })
  }

  async update() {
    this.setState({ isLoading: true })
    api.authFetch("/api/admin/order/update", "put", this.state,
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

  renderCustomers = () => {
    return (
      <Autocomplete
        containerStyle={{ margin: 10 }}
        placeholder="Nhập Nhà cung cấp"
        autoCorrect={false}
        data={this.state.customers}
        defaultValue={this.state.queryCustomer}
        hideResults={this.state.hideResults}
        onChangeText={text => {
          this.setState({ queryCustomer: text, hideResults: false })
          this.loadCustomer()
        }}
        underlineColorAndroid="transparent"
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            this.setState({ queryCustomer: item.name, customerId: item.id, hideResults: true })
          }}>
            {item.id != '' ?
              <Text style={{ margin: 5, color: '#fc712b' }}>ID: {item.id} - {item.name} - {item.phone}</Text>
              : <Text style={{ margin: 5, color: '#fc712b' }}>{item.name}</Text>
            }
          </TouchableOpacity>
        )}
      />
    );
  }

  renderSellers = () => {
    return (
      <Autocomplete
        containerStyle={{ margin: 10 }}
        placeholder="Nhập sale"
        autoCorrect={false}
        data={this.state.sellers}
        defaultValue={this.state.querySeller}
        hideResults={this.state.hideResults}
        onChangeText={text => {
          this.setState({ querySeller: text, hideResults: false })
          this.loadSeller()
        }}
        underlineColorAndroid="transparent"
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            this.setState({ querySeller: item.name, sellerId: item.id, hideResults: true })
          }}>
            {item.id != '' ?
              <Text style={{ margin: 5, color: '#fc712b' }}>ID: {item.id} - {item.name} - {item.phone}</Text>
              : <Text style={{ margin: 5, color: '#fc712b' }}>{item.name}</Text>
            }
          </TouchableOpacity>
        )}
      />
    );
  }

  renderShippers = () => {
    return (
      <Autocomplete
        containerStyle={{ margin: 10 }}
        placeholder="Nhập shipper"
        autoCorrect={false}
        data={this.state.shipperList}
        defaultValue={this.state.queryShipper}
        hideResults={this.state.hideResults}
        onChangeText={text => {
          this.setState({ queryShipper: text, hideResults: false })
          this.loadShipper()
        }}
        underlineColorAndroid="transparent"
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            this.setState({ queryShipper: item.name, shipperId: item.id, hideResults: true })
          }}>
            {item.id != '' ?
              <Text style={{ margin: 5, color: '#fc712b' }}>ID: {item.id} - {item.name} - {item.phone}</Text>
              : <Text style={{ margin: 5, color: '#fc712b' }}>{item.name}</Text>
            }
          </TouchableOpacity>
        )}
      />
    );
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

          <View style={{ height: 0.5, backgroundColor: '#FFC33F', margin: 10 }}></View>
          <Text style={styles.label}>Thực nhận:</Text>
          <TextInput style={[styles.inputs, this.state.realWeightInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
            placeholder="Số kg,lit, can,... thực nhận khi lấy hàng"
            keyboardType="decimal-pad"
            underlineColorAndroid='transparent'
            value={this.state.realWeight}
            onChangeText={(realWeight) => this.setState({ realWeight: realWeight, realWeightInvalid: false })} />
          {this.state.realWeightInvalid ?
            <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
            : null}

          <Text style={styles.label}>Giá:</Text>
          <TextInput style={[styles.inputs, this.state.priceInvalid ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
            placeholder="Giá tiền thanh toán"
            keyboardType="number-pad"
            underlineColorAndroid='transparent'
            value={this.state.price}
            onChangeText={(price) => this.setState({ price: NumberUtils.formatNumber(price), priceInvalid: false })} />
          {this.state.priceInvalid ?
            <Text style={styles.errorLabel}>Vui lòng nhập giá trị</Text>
            : null}

          <Text style={styles.label}>Ghi chú:</Text>
          <TextInput style={styles.textArea}
            multiline={true}
            numberOfLines={10}
            placeholder="Ghi chú thêm đơn hàng"
            underlineColorAndroid='transparent'
            value={this.state.note}
            onChangeText={(note) => this.setState({ note: note })} />

          <View style={{ height: 0.5, backgroundColor: '#FFC33F', margin: 10 }}></View>
          
          <Text style={styles.label}>Nhà cung cấp</Text>
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

          {/* <Text style={styles.label}>Sale</Text>
          {this.renderSellers()}  */}
          <Text style={styles.label}>Ẩn Sale</Text>
          <ModalDropdown
            options={this.state.options}
            onSelect={(index, value) => {
              this.setState({ hideOrder: parseInt(index) == 0 ? true : false })
            }}
            defaultValue={this.state.options[this.state.hideOrder ? 0 : 1]}
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

          <View style={{ height: 0.5, backgroundColor: '#FFC33F', margin: 10 }}></View>
          <Text style={styles.label}>Trạng thái</Text>
          <ModalDropdown
            options={this.state.statusOptions}
            onSelect={this.selectType}
            defaultValue={this.state.statusOptions[this.state.status - 1]}
            style={{
              backgroundColor: "#FFFFFF",
              margin: 10,
              padding: 10,
              borderRadius: 5
            }}
            textStyle={{ fontSize: 14, color: "#FF6600" }}
            dropdownTextStyle={{ fontSize: 14, color: "#000000" }}
            dropdownStyle={{ width: "100%", marginLeft: 20, height: 160 }}
          />

          <TouchableOpacity style={[styles.buttonContainer]} onPress={this.submit}>
            <Text style={styles.buttonText}>Cập Nhật</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }

}
export default UpdateOrder;

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