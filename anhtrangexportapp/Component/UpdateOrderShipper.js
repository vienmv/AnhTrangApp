import React, { Component } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import { Actions } from 'react-native-router-flux';

import { api, RenderProcessing, styles, NumberUtils } from '../Base';

class UpdateOrderShipper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.order.id,
      note: this.props.note,
      status: 3,
      realWeight: this.props.realWeight,
      price: this.props.price,
      realWeightInvalid: false,
      priceInvalid: false,
      isLoading: false
    }
  }

  async update() {
    this.setState({ isLoading: true })
    api.authFetch("/api/shipper/order/update/shipper", "put", this.state,
      (data) => {
        this.setState({ isLoading: false })
        Alert.alert('Thành công', 'Cập nhật đơn hàng thành công.',
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
    if (this.state.realWeight == undefined || this.state.realWeight.length == 0) {
      this.setState({ realWeightInvalid: true })
    } else if (this.state.price == undefined || this.state.price.length == 0) {
      this.setState({ priceInvalid: true })
    } else {
      this.setState({ price: NumberUtils.getOnlyDigit(this.state.price) }, () => {
        this.update()
      })
    }
  }

  selectType = (index) => {
    this.setState({ status: index + 3 })
  }

  renderProcessing = () => {
    if (this.state.isLoading) {
      return (<RenderProcessing />)
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} keyboardShouldPersistTaps="handled" extraScrollHeight={60}>
        {this.renderProcessing()}
        <View style={styles.vContainer}>
          <Text style={styles.label}>Trạng thái:</Text>
          <ModalDropdown
            options={['Hoàn Thành', 'Hủy']}
            onSelect={this.selectType}
            defaultValue={'Hoàn Thành'}
            style={{
              backgroundColor: "#FFFFFF",
              margin: 10,
              padding: 10,
              borderRadius: 5
            }}
            textStyle={{ fontSize: 16, color: "#FF6600" }}
            dropdownTextStyle={{ fontSize: 16, color: "#000000" }}
            dropdownStyle={{ width: "100%", marginLeft: -10, height: 80 }}
          />

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

          <TouchableOpacity style={[styles.buttonContainer]} onPress={this.submit}>
            <Text style={styles.buttonText}>Cập Nhật</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
export default UpdateOrderShipper;