import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import ImageView from 'react-native-image-view';
import { Actions } from 'react-native-router-flux';

import { AddFloatingButton, api, InputSearch, MultipleImageViewer, RenderProcessing, styles } from '../Base';

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

      imageSources: [],
      isImageViewVisible: false,
      imageIndex: 0
    }

    this.searchDTO = {
      length: 12,
      start: 0,
      roleList: ["ROLE_SELLER", "ROLE_SHIPPER", "ROLE_ADMIN"],
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
    this.refresh()
  }

  componentWillReceiveProps() {
    this.refresh()
  }

  async loadData() {
    this.setState({ isLoading: true });
    api.authFetch(
      "/api/admin/accounts",
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

  setKeyword = (text) => {
    this.searchDTO.search.value = text;
    this.refresh();
  }

  renderAddButton = () => (
    <AddFloatingButton action={() => {
      Actions.addUser();
    }} />
  )

  listRoad(user) {
    Actions.listRoadOfShipper({ title: 'Cung ???????ng Ship: ' + user.name, user: user })
  }

  resetRole(user) {
    Actions.resetRole({ user: user })
  }

  resetGroup(user) {
    Actions.resetGroup({ user: user })
  }

  edit(user) {
    Actions.updateUser({ user: user })
  }

  changeValueRole(roles) {
    var role = [];
    if (roles.includes("ROLE_SELLER")) {
      role.push("SELLER");
    } if (roles.includes("ROLE_SHIPPER")) {
      role.push("SHIPPER");
    } if (roles.includes("ROLE_ADMIN")) {
      role.push("ADMIN");
    } if (roles.includes("ROLE_MEMBER")) {
      role.push("Nh?? cung c???p");
    }
    return role;
  }

  async delete(user) {
    Alert.alert('X??c nh???n', 'B???n ch???c ch???n mu???n xo?? ng?????i d??ng: ' + user.name + ' ?',
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
                  Alert.alert('L???i', 'Ngu???i d??ng ??ang s??? d???ng.')
                }
                this.setState({ processing: false })
              })
          }
        },
        {
          text: 'Kh??ng', onPress: () => { },
          style: 'cancel'
        },
      ]
    )
  }

  renderGallery = (imageSources, index) => {
    this.setState({
      imageSources: imageSources,
      isImageViewVisible: true,
      imageIndex: index
    });
  };

  renderRowItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHead}>
        <Text style={styles.itemHeadText}>{item.name}</Text>
        <View style={[styles.hContainer, { justifyContent: "flex-end" }]} >
          <TouchableOpacity onPress={() => this.resetRole(item)} >
            <Image
              source={require("../assets/team.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.resetGroup(item)} >
            <Image
              source={require("../assets/group.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          {item.roles.includes("ROLE_SHIPPER") ?
            <TouchableOpacity onPress={() => this.listRoad(item)} >
              <Image
                source={require("../assets/road.png")}
                style={styles.iconStyle}
              />
            </TouchableOpacity> : null}
          <TouchableOpacity onPress={() => this.edit(item)} >
            <Image
              source={require("../assets/edit.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
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
            <Text style={styles.title}>??i???n tho???i: </Text>
            <Text style={[styles.info]} selectable onPress={() => Linking.openURL(`tel:${item.phone}`)}>{item.phone}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Nh??m: </Text>
            <Text style={styles.info}>{item.userGroupNames.toString()}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>T???o b???i: </Text>
            <Text style={styles.info}>{item.createdBy}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Vai tr??: </Text>
            <Text style={styles.info}>{this.changeValueRole(item.roles) + ", "}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>?????a ch???: </Text>
            <Text style={styles.info} selectable onPress={() => Linking.openURL("https://www.google.com/maps/place/" + (item.address + ',' + item.wardsName + ',' + item.districtName + ',' + item.cityName))}>{item.address + ' - ' + item.wardsName + ' - ' + item.districtName + ' - ' + item.cityName}</Text>
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

  renderSearchSection = () => (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <InputSearch placeholder="T??m ki???m theo t??n, s??t???" changeText={this.setKeyword} search={this.refresh} />
        </View>
        <TouchableOpacity style={{
          width: 87, backgroundColor: '#089101', borderRadius: 4, justifyContent: 'center',
          alignItems: 'center', margin: 10
        }} onPress={() => this.refresh()} >
          <Text style={{ fontSize: 13, color: '#fff', textAlign: 'center' }}>T??M KI???M</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  renderNoDataComponent = () => {
    if (this.state.users.length == 0 && this.state.isLoading == false) {
      return (
        <Text style={{ flex: 1, textAlign: 'center' }}>Kh??ng c?? m???c n??o!</Text>
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

  renderProcessing = () => {
    if (this.state.processing) {
      return (<RenderProcessing />)
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