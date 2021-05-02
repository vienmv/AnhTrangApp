import React, { Component } from 'react';
import { Alert, Text, TextInput, Image, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { api, RenderProcessing, styles } from '../Base';

export default class UpdateMemberOrder extends Component {
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
    }
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
      this.update()
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
        {this.renderProcessing()}

        <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/addorderbanner.png')} style={{ height: 100, width: '100%', resizeMode: 'contain' }} />
        </View>

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

          <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', alignItems: 'center' }]} onPress={this.submit}>
            <Text style={styles.buttonText}>Cập Nhật</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}