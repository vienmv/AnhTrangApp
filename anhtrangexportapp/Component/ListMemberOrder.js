import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { AddFloatingButton, api, DateTimePicker, InputSearch, NumberUtils, RenderProcessing, styles, Authentication } from '../Base';

export default class ListMemberOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      recordsFiltered: 0,
      isLoading: true,
      processing: false,
      refresh: false,
      hasMore: false,
      user: {
        roles: []
      }
    };
  }

  componentWillReceiveProps() {
    this.searchDTO = this.props.searchDTO;
    this.setState({
      orders: [], refresh: false,
      fromDate: this.searchDTO.fromDate,
      toDate: this.searchDTO.toDate
    });
    this.refresh();
  }

  async loadData() {
    this.setState({ isLoading: true });
    api.authFetch(
      "/api/member/order/list",
      "post",
      this.searchDTO,
      response => {
        response.json().then(responseJson => {
          let orders = this.state.orders
          if (this.state.refresh) {
            orders = []
          }
          //prevent duplicated
          orders = orders.concat(responseJson.data)
          orders = orders.filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.id === item.id
            ))
          )

          this.setState({
            orders: orders,
            isLoading: false, refresh: false,
            recordsFiltered: responseJson.recordsFiltered,
            hasMore: responseJson.data.length == this.searchDTO.length
          })
        })
      }
    )
  }

  refresh = () => {
    this.setState({ refresh: true });
    this.searchDTO.start = 0;
    this.loadData();
  }

  setStatus(status) {
    if (status == 1) {
      return "Mới"
    } else if (status == 2) {
      return "Chờ Ship"
    } else if (status == 3) {
      return "Hoàn Thành"
    } else {
      return "Hủy"
    }
  }

  setStarRating(status) {
    if (status == 1) {
      return "Hài lòng"
    } else if (status == 2) {
      return "Bình thường"
    } else if (status == 3) {
      return "Không hài lòng"
    } else {
      return ""
    }
  }

  onEndReached() {
    if (this.state.hasMore) {
      this.searchDTO.start = this.searchDTO.start + this.searchDTO.length;
      this.loadData();
    }
  }

  ///SEARCH COMPONENT
  setSearchFromDate = (text) => {
    this.searchDTO.fromDate = text;
    this.setState({ fromDate: text })
    this.refresh()
  }

  setSearchToDate = (text) => {
    this.searchDTO.toDate = text;
    this.setState({ toDate: text })
    this.refresh()
  }

  setKeyword = (text) => {
    this.searchDTO.search.value = text;
    this.refresh();
  }

  componentDidMount() {
    this.getLoginUser();
  }

  async getLoginUser() {
    const user = await Authentication.loginUser();
    if (!user) {
      await Authentication.logout();
      return;
    }
    this.setState({ user: user });

    // if (this.props.orderId) {
    //   this.setState({ isLoading: true })

    //   api.authFetchWithGet("/api/member/order/" + this.props.orderId, response => {
    //     response.json().then(responseJson => {
    //       this.setState({ isLoading: false })
    //       this.setState({
    //         order: responseJson,
    //         review: responseJson.review,
    //         starRating: responseJson.starRating
    //       });
    //     });
    //   })
    // }
  }

  renderSearchSection = () => (
    <View>
      <View style={{ flexDirection: "row" }}>
        <DateTimePicker date={this.state.fromDate} onDateChange={this.setSearchFromDate} placeholder="Từ ngày" />
        <DateTimePicker date={this.state.toDate} onDateChange={this.setSearchToDate} placeholder="Đến ngày" />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <InputSearch placeholder="Tìm kiếm đơn hàng…" defaultValue={this.props.searchDTO.search.value} changeText={this.setKeyword} search={this.refresh} />
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
  //END SEARCH

  renderRowItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHead}>
        <Text style={styles.itemHeadText} selectable onPress={() => Actions.inforOrder({ order: item })}>ID: {item.id} - {this.setStatus(item.status)}</Text>
        <View style={[styles.hContainer, { justifyContent: "flex-end" }]}>
          {item.status == 1 ? (
            <TouchableOpacity onPress={() => Actions.UpdateMemberOrder({ order: item })}>
              <Image
                source={require("../assets/trash.png")}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <View style={styles.itemBody}>
        <View style={styles.vContainer}>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Số lượng: </Text>
            <Text style={styles.info}>{(item.weight)} {item.unit}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Mô tả: </Text>
            <Text style={[styles.info, { fontStyle: 'italic' }]}>{(item.description)}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Địa chỉ: </Text>
            <Text style={[styles.info, { fontStyle: 'italic' }]} selectable onPress={() => Linking.openURL("https://www.google.com/maps/place/" + (item.address + ',' + item.wardsName + ',' + item.districtName + ',' + item.cityName))}>{(item.address)} - {(item.wardsName)} - {(item.districtName)} - {(item.cityName)}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Điện thoại: </Text>
            <Text style={[styles.info, { fontStyle: 'italic' }]} selectable onPress={() => Linking.openURL(`tel:${item.phoneCustomer}`)}>{item.phoneCustomer}</Text>
          </View>
          <View style={{ height: 0.5, backgroundColor: '#FFC33F', margin: 10 }}></View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Thực nhận: </Text>
            <Text style={styles.info}>{(item.realWeight)}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Giá: </Text>
            <Text style={styles.info}>{NumberUtils.formatNumber(item.price)}</Text>
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Chú thích : </Text>
            <Text style={[styles.info, { fontStyle: 'italic' }]}> {item.note}</Text>
          </View>
          {item.status == 3 ?
            <View style={styles.hContainer}>
              <Text style={styles.title}>Đánh giá : </Text>
              <Text style={[styles.info]}> {this.setStarRating(item.starRating)}</Text>
            </View> : null}
          {item.status == 3 ?
            <View style={styles.hContainer}>
              <Text style={styles.title}>Nhận xét : </Text>
              <Text style={[styles.info]}> {item.review}</Text>
            </View> : null}
        </View>
      </View>

      <View style={styles.itemFoot}>
        <View style={styles.hContainer}>
          <Text style={styles.info} >{item.createdDate}</Text>
        </View>
        <View style={[styles.hContainer, { justifyContent: "flex-end" }]}>
          <Text style={[styles.info, { textAlign: 'right' }]}>Tạo bởi: {item.createdBy}</Text>
        </View>
      </View>
      {item.status == 2 && this.state.user.roles.includes("ROLE_SHIPPER") ?
        <TouchableOpacity style={{ marginTop: 10, padding: 10, backgroundColor: '#FFC33F' }} onPress={() => Actions.updateOrderShipper({ order: item })}>
          <Text style={{
            fontSize: 15,
            lineHeight: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#ffffff',
            textTransform: 'uppercase'
          }}>Sửa đơn</Text>
        </TouchableOpacity> 
      : null}
      {item.status == 1 && this.state.user.roles.includes("ROLE_SELLER") ? 
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: '#FFC33F' }} onPress={() => Actions.sellerUpdateOrder({ order: item })}>
            <Text style={{
              fontSize: 15,
              lineHeight: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#ffffff',
              textTransform: 'uppercase'
            }}>Sửa đơn</Text>
          </TouchableOpacity>
        
          <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: 'red' }} onPress={() => Actions.sellerUpdateOrderShip({ order: item })}>
            <Text style={{
              fontSize: 15,
              lineHeight: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#ffffff',
              textTransform: 'uppercase'
            }}>Gán shipper</Text>
          </TouchableOpacity>
        </View>
      : null}
    </View>
  );

  renderProcessing = () => {
    if (this.state.processing) {
      return (<RenderProcessing />)
    }
    return null;
  }

  renderNoDataComponent = () => {
    if (this.state.orders.length == 0 && this.state.isLoading == false) {
      return (
        <Text style={{ flex: 1, textAlign: 'center' }}>Không có đơn hàng nào!</Text>
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

  renderAddButton = () => (
    <AddFloatingButton action={() => Actions.addOrder()} />
  )

  renderData() {
    return (
      <FlatList
        refreshing={this.state.isLoading}
        onRefresh={() => this.refresh()}
        data={this.state.orders}
        renderItem={this.renderRowItem}
        onEndReachedThreshold={0.5}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          this.onEndReached()
        }}
        ListEmptyComponent={this.renderNoDataComponent}
        ListFooterComponent={this.renderLoadMore}
      />
    )
  }

  render() {
    return (
      <View style={styles.vContainer}>
        {this.renderProcessing()}
        {this.renderSearchSection()}
        <View style={{ height: 0.5, backgroundColor: '#828282', marginLeft: 10, marginRight: 10 }}></View>
        <View style={{ height: 30, backgroundColor: '#52B897', margin: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff' }}>Số hoá đơn: {this.state.recordsFiltered}</Text>
        </View>
        {this.renderData()}
        {this.renderAddButton()}
      </View>
    )
  }
}