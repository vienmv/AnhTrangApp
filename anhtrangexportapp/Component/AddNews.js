import React, { Component } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { api, RenderProcessing, styles } from '../Base';

export default class AddNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      content: '',
      userGroupName: '',
      userGroups: [],
      hideResultsGroup: true,
      processing: false,
      userGroupId: null
    }
  }

  submit = () => {
    if (this.state.userGroupId) {
      this.add()
    }
  }

  async loadUserGroup(text) {
    if (text != "") {
      this.setState({ hideResultsGroup: false })
      this.state.userGroupName = text;
    }

    const searchUserGroupDTO = {
      length: 8,
      start: 0,
      search: {
        value: this.state.userGroupName
      }
    }

    api.authFetch("/api/admin/user-group/search", "post", searchUserGroupDTO, response => {
      response.json().then(responseJson => {
        this.setState({ userGroups: (responseJson.data) });
      });
    })
  }

  async add() {
    this.setState({ processing: true })

    api.authFetch("/api/admin/news/add", "post", this.state,
      (data) => {
        this.setState({ processing: false })
        Alert.alert('Thành công', 'Tạo tin thành công.',
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
            <Text style={styles.label}>Nhóm</Text>
            <Autocomplete
              style={{ height: 35 }}
              containerStyle={{ marginBottom: 10, width: "100%", height: this.state.hideResultsGroup ? 35 : 300 }}
              inputContainerStyle={[styles.searchInput, { justifyContent: 'center' }]}
              inputStyle={{
                flex: 1,
              }}
              placeholder="Nhập tên nhóm"
              autoCorrect={false}
              data={this.state.userGroups}
              defaultValue={this.state.userGroupName}
              hideResults={this.state.hideResultsGroup}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                this.setState({ userGroupName: text, hideResultsGroup: false })
                this.loadUserGroup(text)
              }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  this.setState({ userGroupName: item.name, hideResultsGroup: true, userGroupId: item.id })
                }}>
                  <Text style={{ margin: 5, color: '#fc712b' }} multiline={1}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.label}>Tiêu đề</Text>
            <TextInput style={[styles.inputs]}
              placeholder="Tiêu đề"
              underlineColorAndroid='transparent'
              value={this.state.title}
              onChangeText={(title) => this.setState({ title: title })} />

            <Text style={styles.label}>Nội dung</Text>
            <TextInput style={[styles.textArea]}
              multiline={true}
              numberOfLines={8}
              placeholder="Nội dung tin tức"
              underlineColorAndroid='transparent'
              value={this.state.content}
              onChangeText={(content) => this.setState({ content: content })} />
            <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', alignItems: 'center' }]} onPress={this.submit}>
              <Text style={styles.buttonText}>Tạo mới</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
