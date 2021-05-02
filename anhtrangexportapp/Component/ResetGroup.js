import React, { Component } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { api, RenderProcessing, styles } from '../Base';

const userGroup_prop = [];
const searchUserGroupDTO = {
  length: 8,
  start: 0,

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

class ResetGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.user.id,
      userGroupIds: this.props.user.userGroupIds,
      isLoading: false,
    }
  }

  submit = () => {
    this.update()
  }

  async update() {
    this.setState({ isLoading: true })
    api.authFetch("/api/admin/user/update-group", "put", this.state,
      (data) => {
        this.setState({ isLoading: false })
        Alert.alert('Thành công', 'Cập nhật nhóm thành công.',
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
          <Text style={styles.label}>Chọn Nhóm</Text>
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
            <Text style={styles.buttonText}>Cập Nhật</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
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

export default ResetGroup;
