import React, { Component } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { api, RenderProcessing, styles } from '../Base';

class UpdateUserGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.userGroup.id,
      name: this.props.userGroup.name,
      isLoading: false,
      nameInvalid: false,
      addressInvalid: false
    }
  }

  submit = () => {
    if (this.state.name.length == 0) {
      this.setState({ nameInvalid: true })
    }  else {
      this.update()
    }
  }

  async update() {
    this.setState({ isLoading: true })
    api.authFetch("/api/admin/user-group/update", "put", this.state,
      (data) => {
        this.setState({ isLoading: false })
        Alert.alert('Thành công', 'Cập nhật địa chỉ công ty thành công.',
          [
            {
              text: 'OK', onPress: () => {
                Actions.pop({ refresh: {} });
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
        <View style={styles.vContainer}>

          <Text style={styles.label}>Tên nhóm</Text>
          <TextInput style={[styles.inputs, (this.state.nameInvalid) ? { borderColor: '#F15931' } : { borderColor: '#c4c4c4' }]}
            placeholder="Tên nhóm"
            underlineColorAndroid='transparent'
            value={this.state.name}
            onChangeText={(name) => this.setState({ name: name, nameInvalid: false })} />
          {this.state.nameInvalid ?
            <Text style={styles.errorLabel}>Vui lòng nhập</Text>
            : null}

          <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', alignItems: 'center' }]} onPress={this.submit}>
            <Text style={styles.buttonText}>Thêm</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}
export default UpdateUserGroup;
