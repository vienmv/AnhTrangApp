import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { AddFloatingButton, api, InputSearch, RenderProcessing, styles } from '../Base';

class ListUserGroup extends Component {
  searchDTO = {
    length: 12,
    start: 0,
    search: {
      value: ""
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      userGroups: [],
      isLoading: true,
      refresh: true
    };
  }
  componentDidMount() {
    this.refresh()
  }

  componentWillReceiveProps() {
    this.refresh();
  }

  async loadData() {
    this.setState({ isLoading: true });
    api.authFetch(
      "/api/admin/user-group/search",
      "post",
      this.searchDTO,
      response => {
        response.json().then(responseJson => {
          let userGroups = this.state.userGroups
          if (this.state.refresh) {
            userGroups = []
          }
          //prevent duplicated
          userGroups = userGroups.concat(responseJson.data)
          userGroups = userGroups.filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.id === item.id
            ))
          )
          this.setState({
            refresh: false,
            userGroups: userGroups,
            isLoading: false,
            hasMore: responseJson.data.length == this.searchDTO.length
          });
        });
      }
    );
  }

  refresh = () => {
    this.setState({ refresh: true });
    this.searchDTO.start = 0;
    this.loadData();
  }

  _onEndReached() {
    if (this.state.hasMore) {
      this.searchDTO.start = this.searchDTO.start + this.searchDTO.length;
      this.loadData();
    }
  }

  edit(userGroup) {
    Actions.updateUserGroup({ userGroup: userGroup })
  }

  setKeyword = (text) => {
    this.searchDTO.search.value = text;
    this.refresh();
  }

  async viewUserGroup(userGroup) {
    Actions.listCustomerOfUserGroup({ userGroup: userGroup, title: userGroup.name })
  }

  async delete(userGroup) {
    Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xoá: ' + userGroup.name + ' ?',
      [
        {
          text: 'OK', onPress: () => {
            this.setState({
              processing: true,
            })
            api.authFetch("/api/admin/user-group/delete/" + userGroup.id, "delete", {},
              (data) => {
                this.setState({ processing: false })
                this.refresh()
              }, status => {
                if (status == 409) {
                  Alert.alert('Lỗi', 'Nhóm đang sử dụng.')
                }
                this.setState({ processing: false })
              })
          }
        },
        {
          text: 'Không', onPress: () => { },
          style: 'cancel'
        },
      ]
    )
  }

  async addUserGroup() {
    Actions.addUserGroup();
  }

  renderAddButton = () => (
    <AddFloatingButton action={this.addUserGroup} />
  )

  renderRowItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHead}>
        <Text style={styles.itemHeadText}>{item.name}</Text>
        <View style={[styles.hContainer, { justifyContent: "flex-end" }]} >
          <TouchableOpacity onPress={() => this.viewUserGroup(item)}>
            <Image
              source={require("../assets/view.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.edit(item)}>
            <Image
              source={require("../assets/edit.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.delete(item)}>
            <Image
              source={require("../assets/trash.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemFoot}>
        <View style={styles.hContainer}>
          <Text style={styles.info} >ID:{item.id}</Text>
        </View>
      </View>
    </View>
  )

  renderNoDataComponent = () => {
    if (this.state.userGroups.length == 0 && this.state.isLoading == false) {
      return (
        <Text style={{ flex: 1, textAlign: 'center' }}>Không tìm thấy Nhóm nào!</Text>
      )
    }
    return null;
  }

  renderLoadMore = () => {
    if (this.state.hasMore) {
      return (<ActivityIndicator size="small" color="#000" />)
    }
    return null
  }

  renderData() {
    return (
      <FlatList
        refreshing={this.state.isLoading}
        onRefresh={() => this.refresh()}
        data={this.state.userGroups}
        renderItem={this.renderRowItem}
        onEndReachedThreshold={1}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          this._onEndReached();
        }}
        ListEmptyComponent={this.renderNoDataComponent}
        ListFooterComponent={this.renderLoadMore}
      />
    )
  }

  renderSearchSection = () => {
    return (
      <View>
        <InputSearch placeholder="Tìm kiếm nhóm" changeText={this.setKeyword} search={this.refresh} />
      </View>
    )
  }

  renderProcessing = () => {
    if (this.state.processing) {
      return (<RenderProcessing />)
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderProcessing()}
        {this.renderSearchSection()}
        {this.renderData()}
        {this.renderAddButton()}
      </View>
    )
  }
}

export default ListUserGroup;