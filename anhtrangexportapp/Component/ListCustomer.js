import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import ImageView from 'react-native-image-view';
import { Actions } from 'react-native-router-flux';

import { AddFloatingButton, api, Authentication, InputSearch, MultipleImageViewer, RenderProcessing, styles } from '../Base';

class ListCustomer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      recordsFiltered: 0,
      isLoading: true,
      processing: false,
      refresh: false,
      hasMore: false,
      user: {
        roles: [],
      },
      imageSources: [],
      isImageViewVisible: false,
      imageIndex: 0
    }

    this.searchDTO = {
      length: 12,
      start: 0,
      roleList: ["ROLE_MEMBER"],
      search: {
        value: ""
      },
      columns: [{ data: "id" }],
      order: [
        {
          column: 0,
          dir: "desc"
        }
      ]
    };
  }

  componentDidMount() {
    this.getLoginUser();
  }

  componentWillReceiveProps() {
    this.refresh()
  }

  async getLoginUser() {
    const user = await Authentication.loginUser();
    if (!user) {
      await Authentication.logout();
      return;
    }
    this.setState({ user: user });
    if (!user.roles.includes("ROLE_ADMIN")) {
      this.searchDTO.createdById = user.id
    }
    this.refresh();
  }

  async loadData() {
    this.setState({ isLoading: true });
    api.authFetch(
      "/api/seller/user/list",
      "post",
      this.searchDTO,
      response => {
        response.json().then(responseJson => {
          let users = this.state.users
          if (this.state.refresh) {
            users = []
          }
          //prevent duplicated
          users = users.concat(responseJson.data)
          users = users.filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.id === item.id
            ))
          )

          this.setState({
            refresh: false,
            users: users,
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

  _onEndReached = () => {
    if (this.state.hasMore) {
      this.searchDTO.start = this.searchDTO.start + this.searchDTO.length;
      this.loadData();
    }
  }

  renderGallery = (imageSources, index) => {
    this.setState({
      imageSources: imageSources,
      isImageViewVisible: true,
      imageIndex: index
    });
  };

  assignSeller(user) {
    Actions.assignSeller({ user: user })
  }

  edit(user) {
    Actions.updateCustomer({ user: user })
  }

  setKeyword = (text) => {
    this.searchDTO.search.value = text;
    this.refresh();
  }

  resetRole(user) {
    Actions.resetRole({ user: user })
  }

  resetGroup(user) {
    Actions.resetGroup({ user: user })
  }

  async delete(user) {
    Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xoá Nhà cung cấp: ' + user.name + ' ?',
      [
        {
          text: 'OK', onPress: () => {
            this.setState({ processing: true })
            api.authFetch("/api/admin/user/delete/" + user.id, "delete", {},
              (response) => {
                this.setState({ processing: false })
                this.refresh()
              }, status => {
                if (status == 409) {
                  Alert.alert('Lỗi', 'Nhà cung cấp đang sử dụng.')
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

  renderAddButton = () => (
    <AddFloatingButton action={() => {
      Actions.addCustomer({ user: this.state.user });
    }} />
  )

  renderRowItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHead}>
        <Text style={styles.itemHeadText}>{item.name}</Text>
        <View style={[styles.hContainer, { justifyContent: "flex-end" }]} >
          {this.state.user.roles.includes("ROLE_ADMIN") ?
            <TouchableOpacity onPress={() => this.resetRole(item)} >
              <Image
                source={require("../assets/team.png")}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            : null}
          {this.state.user.roles.includes("ROLE_ADMIN") ?
            <TouchableOpacity onPress={() => this.resetGroup(item)} >
              <Image
                source={require("../assets/group.png")}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            : null}
          {this.state.user.roles.includes("ROLE_ADMIN") ?
            <TouchableOpacity onPress={() => this.assignSeller(item)} >
              <Image
                source={require("../assets/ganSeller.png")}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            : null}
          {(this.state.user.roles.includes("ROLE_ADMIN") || this.state.user.roles.includes("ROLE_SELLER") || this.state.user.roles.includes("ROLE_SHIPPER")) ? <TouchableOpacity onPress={() => this.edit(item)} >
            <Image
              source={require("../assets/edit.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity> : null}

          {this.state.user.roles.includes("ROLE_ADMIN") ?
            <TouchableOpacity onPress={() => this.delete(item)} >
              <Image
                source={require("../assets/trash.png")}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            : null}
        </View>
      </View>
      <View style={styles.itemBody}>
        <View style={styles.vContainer}>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Điện thoại: </Text>
            <Text style={[styles.info]} selectable onPress={() => Linking.openURL(`tel:${item.phone}`)}>{item.phone}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Nhóm: </Text>
            <Text style={styles.info}>{item.userGroupNames.toString()}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Tạo bởi: </Text>
            <Text style={styles.info}>{item.createdBy}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Địa chỉ: </Text>
            <Text style={styles.info} selectable onPress={() => Linking.openURL("https://www.google.com/maps/place/" + (item.address + ',' + item.wardsName + ',' + item.districtName + ',' + item.cityName))}>{item.address + ' - ' + item.wardsName + ' - ' + item.districtName + '\n' + item.cityName}</Text>
          </View>
          {item.images.length > 0 && (
            <MultipleImageViewer
              photos={item.images}
              renderGallery={this.renderGallery}
            />
          )}
        </View>
      </View>
      <View style={styles.itemFoot}>
        <View style={styles.hContainer}>
          <Text style={styles.info} >ID: {item.id}</Text>
        </View>
        <View style={[styles.hContainer, { justifyContent: "flex-end" }]}>
          <Text style={[styles.info, { textAlign: 'right' }]}> {item.createdDate}</Text>
        </View>
      </View>
    </View>
  )

  renderProcessing = () => {
    if (this.state.processing) {
      return (<RenderProcessing />)
    }
    return null
  }

  renderImageView() {
    return (
      <ImageView
        images={this.state.imageSources}
        imageIndex={this.state.imageIndex}
        isVisible={this.state.isImageViewVisible}
        onClose={() => this.setState({ isImageViewVisible: false })}
      />
    )
  }

  renderSearchSection = () => (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <InputSearch placeholder="Tìm kiếm theo tên, sđt…" changeText={this.setKeyword} search={this.refresh} />
        </View>
        <TouchableOpacity style={{
          width: 87, backgroundColor: '#089101', borderRadius: 4, justifyContent: 'center',
          alignItems: 'center', margin: 10
        }} onPress={() => this.refresh()} >
          <Text style={{ fontSize: 13, color: '#fff', textAlign: 'center' }}>TÌM KIẾM</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  renderNoDataComponent = () => {
    if (this.state.users.length == 0 && this.state.isLoading == false) {
      return (
        <Text style={{ flex: 1, textAlign: 'center' }}>Không có mục nào!</Text>
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
        data={this.state.users}
        renderItem={this.renderRowItem}
        onEndReachedThreshold={0.5}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          this._onEndReached();
        }}
        ListEmptyComponent={this.renderNoDataComponent}
        ListFooterComponent={this.renderLoadMore}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderImageView()}
        {this.renderProcessing()}
        {this.renderSearchSection()}
        {this.renderData()}
        {this.renderAddButton()}
      </View>
    )
  }
}

export default ListCustomer;