import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { AddFloatingButton, api, InputSearch, RenderProcessing, styles } from '../Base';

class ListRoadOfShipper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roads: [],
      user: this.props.user,
      isLoading: true,
      refresh: false
    }
  }

  componentDidMount() {
    this.refresh();
  }

  componentWillReceiveProps() {
    this.refresh();
  }

  searchDTO = {
    length: 12,
    start: 0,
    userId: this.props.user.id,
    search: {
      value: ""
    },
  };

  async loadData() {
    this.setState({ isLoading: true });
    api.authFetch("/api/shipper/road/search", "post", this.searchDTO,
      (response) => {
        response.json().then(responseJson => {
          let currentRoad = this.state.roads;
          if (this.state.refresh) {
            roads = []
          }
          //prevent duplicated
          currentRoad = currentRoad.concat(responseJson.data)
          currentRoad = currentRoad.filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.id === item.id
            ))
          )
          this.setState({
            refresh: false,
            roads: currentRoad,
            isLoading: false,
            hasMore: responseJson.data.length == this.searchDTO.length
          });
        })
      })
  }

  refresh = () => {
    this.setState({ refresh: true });
    this.setState({
      roads: []
    });
    this.searchDTO.start = 0;
    this.loadData();
  }

  _onEndReached() {
    if (this.state.hasMore) {
      this.searchDTO.start = this.searchDTO.start + this.searchDTO.length;
      this.loadData();
    }
  }

  setKeyword = (text) => {
    this.searchDTO.search.value = text;
    this.refresh()
  }

  async delete(road) {
    Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xóa thành phố này : ' + road.cityName + ' ?',
      [
        {
          text: 'OK', onPress: () => {
            this.setState({
              processing: true,
            })
            api.authFetch("/api/shipper/road/delete/" + road.id, "delete", {},
              (data) => {
                this.setState({
                  processing: false,
                })
                this.refresh()
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


  addRoadOfShipper = () => {
    var nameCity = [];
    this.state.roads.map(item => {
      nameCity.push(item.cityName);
    })
    Actions.addRoadOfShipper({ user: this.props.user, roads: nameCity });
  }

  renderAddButton = () => (
    <AddFloatingButton action={this.addRoadOfShipper} />
  )

  renderRowItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHead}>
        <Text style={styles.itemHeadText}>{item.cityName}</Text>
        <View style={[styles.hContainer, { justifyContent: "flex-end" }]} >
          <TouchableOpacity onPress={() => this.delete(item)}>
            <Image
              source={require("../assets/trash.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  renderNoDataComponent = () => {
    if (this.state.roads.length == 0 && this.state.isLoading == false) {
      return (
        <Text style={{ flex: 1, textAlign: 'center' }}>Không tìm thấy thành phố nào!</Text>
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
        data={this.state.roads}
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
        <InputSearch placeholder="Tìm kiếm tên tp" changeText={this.setKeyword} search={this.refresh} />
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

export default ListRoadOfShipper;