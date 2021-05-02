import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import ImageView from 'react-native-image-view';
import { Actions } from 'react-native-router-flux';

import { AddFloatingButton, api, InputSearch, MultipleImageViewer, RenderProcessing, styles } from '../Base';

class ListCustomerOfUserGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.userGroup.id,
      name: this.props.userGroup.name,
      users: [],
      recordsFiltered: 0,
      isLoading: true,
      processing: false,
      refresh: true,
      hasMore: false,
      imageSources: [],
      isImageViewVisible: false,
      imageIndex: 0
    }

    this.searchDTO = {
      length: 12,
      start: 0,
      userGroupId: this.props.userGroup.id,
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
    this.refresh();
  }

  componentWillReceiveProps() {
    this.refresh()
  }

  async loadData() {
    this.setState({ isLoading: true });
    api.authFetch(
      "/api/admin/user-group-infor/search",
      "post",
      this.searchDTO,
      response => {
        response.json().then(responseJson => {
          let users = this.state.users
          if (this.state.refresh) {
            users = []
          }

          users = users.concat(responseJson.data)
          users = users.filter((user, index, self) =>
            index === self.findIndex((t) => (
              t.id === user.id
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
    this.searchDTO.start = 0
    this.setState({ refresh: true })
    this.loadData()
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

  setKeyword = (text) => {
    this.searchDTO.search.value = text;
    this.refresh();
  }

  async delete(user) {
    Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xoá khỏi nhóm: ' + user.userDTO.name + ' ?',
      [
        {
          text: 'OK', onPress: () => {
            this.setState({ processing: true })
            api.authFetch("/api/admin/user-group/delete-user/" + user.id, "delete", {},
              (response) => {
                this.setState({ processing: false })
                this.refresh()
              }, status => {
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
      Actions.addCustomerOfUserGroup({ userGroup: this.props.userGroup });
    }} />
  )

  renderRowItem = ({ item }) => (

    <View style={styles.item}>
      <View style={styles.itemHead}>
        <Text style={styles.itemHeadText}>{item.userDTO.name}</Text>
        <View style={[styles.hContainer, { justifyContent: "flex-end" }]} >
          <TouchableOpacity onPress={() => this.delete(item)} >
            <Image
              source={require("../assets/trash.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemBody}>
        <View style={styles.vContainer}>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Điện thoại: </Text>
            <Text style={[styles.info]} selectable onPress={() => Linking.openURL(`tel:${item.userDTO.phone}`)}>{item.userDTO.phone}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Nhóm: </Text>
            <Text style={styles.info}>{item.userDTO.userGroupNames}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Tạo bởi: </Text>
            <Text style={styles.info}>{item.userDTO.createdBy}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Địa chỉ: </Text>
            <Text style={styles.info} selectable onPress={() => Linking.openURL("https://www.google.com/maps/place/" + (item.userDTO.address + ',' + item.userDTO.wardsName + ',' + item.userDTO.districtName + ',' + item.userDTO.cityName))}>{item.userDTO.cityName + ' - ' + item.userDTO.districtName + ' - ' + item.userDTO.wardsName + '\n' + item.userDTO.address}</Text>
          </View>
          {item.userDTO.images.length > 0 && (
            <MultipleImageViewer
              photos={item.userDTO.images}
              renderGallery={this.renderGallery}
            />
          )}
        </View>
      </View>
      <View style={styles.itemFoot}>
        <View style={styles.hContainer}>
          <Text style={styles.info} >ID: {item.userDTO.id}</Text>
        </View>
        <View style={[styles.hContainer, { justifyContent: "flex-end" }]}>
          <Text style={[styles.info, { textAlign: 'right' }]}> {item.userDTO.createdDate}</Text>
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
    );
  }

  renderSearchSection = () => (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <InputSearch placeholder="Tìm kiếm theo sđt…" changeText={this.setKeyword} search={this.refresh} />
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

export default ListCustomerOfUserGroup;