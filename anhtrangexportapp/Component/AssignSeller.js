import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { api, RenderProcessing, styles } from '../Base';

class AssignSeller extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: this.props.user.id,
      isLoading: false,
      hideResults: true,
      users: [],
      userName: "",
    }
  }

  submit = () => {
    this.add()
  }

  async add() {
    this.setState({ isLoading: true })
    api.authFetch("/api/admin/update-created-by", "put", this.state,
      (data) => {
        this.setState({ isLoading: false })
        Alert.alert('Thành công', ' Gán Seller thành công.',
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

  async loadCustomer(text) {
    if (text != "") {
      this.setState({ hideResults: false })
      this.state.userName = text;
    }

    const searchDTO = {
      length: 12,
      start: 0,
      search: {
        value: this.state.userName
      }
    }

    api.authFetch("/api/admin/accounts", "post", searchDTO,
      response => {
        response.json()
          .then(responseJson => {
            this.setState({ users: (responseJson.data) });
          })
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

          <Text style={styles.label}>Người dùng</Text>
          <Autocomplete
            style={{ height: 35 }}
            containerStyle={{ marginBottom: 10, width: "100%", height: this.state.hideResults ? 35 : 300 }}
            inputContainerStyle={[styles.searchInput, { justifyContent: 'center' }]}
            inputStyle={{
              flex: 1,
            }}
            placeholder="Nhập tên người"
            autoCorrect={false}
            data={this.state.users}
            defaultValue={this.state.userName}
            hideResults={this.state.hideResults}
            underlineColorAndroid="transparent"
            onChangeText={text => {
              this.loadCustomer(text)
            }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                this.setState({ userName: item.name, hideResults: true, createdById: item.id })
              }}>
                <Text style={{ margin: 5, color: '#fc712b' }} multiline={1}>{item.id} - {item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', alignItems: 'center' }]} onPress={this.submit}>
            <Text style={styles.buttonText}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}
export default AssignSeller;
