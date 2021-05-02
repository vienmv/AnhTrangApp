import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { AddFloatingButton, api, DateTimePicker, InputSearch, NumberUtils, RenderProcessing, styles } from '../Base';

class ListOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      recordsFiltered: 0,
      isLoading: true,
      processing: false,
      refresh: false,
      hasMore: false
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
          this.setState({
            orders: orders.concat(responseJson.data),
            recordsFiltered: responseJson.recordsFiltered,
            hasMore: responseJson.data.length == this.searchDTO.length
          })
          this.setState({ isLoading: false, refresh: false });
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

  setCustomer = (text) => {
    this.searchDTO.customerName = text;
  }

  delete = async (order) => {
    Alert.alert("Xác nhận", "Bạn chắc chắn muốn xoá : " + order.id + " ?", [
      {
        text: "OK",
        onPress: () => {
          this.setState({
            processing: true
          });
          api.authFetch(
            "/api/admin/order/delete/" + order.id,
            "delete",
            {},
            response => {
              this.setState({ processing: false });
              this.refresh();
            }
          );
        }
      },
      {
        text: "Không",
        style: "cancel"
      }
    ]);
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

  renderSearchSection = () => (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <InputSearch placeholder="Tên shipper…" changeText={(text) => { this.searchDTO.shiperName = text }} search={this.refresh} />
        </View>
        <View style={{ flex: 1 }}>
          <InputSearch placeholder="Tên seller…" changeText={(text) => { this.searchDTO.sellerName = text }} search={this.refresh} />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <DateTimePicker date={this.state.fromDate} onDateChange={this.setSearchFromDate} placeholder="Từ ngày" />
        <DateTimePicker date={this.state.toDate} onDateChange={this.setSearchToDate} placeholder="Đến ngày" />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <InputSearch placeholder="Tên Nhà cung cấp…" changeText={this.setCustomer} search={this.refresh} />
        </View>
        <View style={{ flex: 1 }}>
          <InputSearch placeholder="Mô tả, ghi chú đơn hàng…" defaultValue={this.props.searchDTO.search.value} changeText={this.setKeyword} search={this.refresh} />
        </View>

      </View>
      <View style={{ flexDirection: "row" }}>

        <View style={{ flex: 1 }}>
          <InputSearch placeholder="Thành phố…" changeText={(text) => { this.searchDTO.searchCity = text }} search={this.refresh} />
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
          <TouchableOpacity onPress={() => this.delete(item)}>
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
            <Text style={styles.title}>Nhà Cung Cấp : </Text>
            <Text style={styles.info}>{(item.customerName)}</Text>
          </View>
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
          <View style={{ height: 0.5, backgroundColor: '#FFC33F', margin: 10 }}></View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Shipper: </Text>
            {item.shipperId != null ?
              <Text style={styles.info}>{(item.shipperName) + '(ID: ' + item.shipperId + ')'}</Text>
              : null
            }
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Sale: </Text>
            {item.sellerId != null ?
              <Text style={styles.info}>{(item.sellerName + '(ID: ' + item.sellerId + ')')} - Bị ẩn: {item.hideOrder ? 'Có' : 'Không'}</Text>
              : null}
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Giá ship: </Text>
            {item.cost != null ?
              <Text style={styles.info}>{NumberUtils.formatNumber(item.cost)}</Text>
              : null
            }
          </View>
          <View style={styles.hContainer}>
            <Text style={styles.title}>Tổng tiền: </Text>
            {item.realWeight != null && item.cost != null ?
              <Text style={styles.info}>{NumberUtils.formatNumber(item.cost * item.realWeight)}</Text>
              : null
            }
          </View>
          <View style={{ height: 0.5, backgroundColor: '#FFC33F', margin: 10 }}></View>
          {item.review != null ?
            <View style={styles.hContainer}>
              <Text style={styles.title}>Nhận xét : </Text>
              <Text style={[styles.info]}> {item.review}</Text>
            </View>
            : null}
          {item.starRating != null ?
            <View style={styles.hContainer}>
              <Text style={styles.title}>Đánh giá : </Text>
              <Text style={[styles.info]}> {this.setStarRating(item.starRating)}</Text>
            </View>
            : null}
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
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: '#FFC33F' }} onPress={() => Actions.updateOrder({ order: item })}>
          <Text style={{
            fontSize: 15,
            lineHeight: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#ffffff',
            textTransform: 'uppercase'
          }}>Cập nhập đơn</Text>
        </TouchableOpacity>
        {item.status == 3 ? null 
          : 
          <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: 'red' }} onPress={() => Actions.UpdateOrderShip({ order: item })}>
            <Text style={{
              fontSize: 15,
              lineHeight: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#ffffff',
              textTransform: 'uppercase'
            }}>Chọn shipper</Text>
          </TouchableOpacity>
        }
        {(item.status == 3) ?
          <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: 'coral' }} onPress={() => Actions.updateCost({ order: item })}>
            <Text style={{
              fontSize: 15,
              lineHeight: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#ffffff',
              textTransform: 'uppercase'
            }}>Giá ship</Text>
          </TouchableOpacity>
          : null}
      </View>
    </View>
  )

  renderProcessing = () => {
    if (this.state.processing) {
      return (<RenderProcessing />)
    }
    return null
  }

  renderNoDataComponent = () => {
    if (this.state.orders.length == 0 && this.state.isLoading == false) {
      return (
        <Text style={{ flex: 1, textAlign: 'center' }}>Không có đơn hàng nào!</Text>
      )
    }
    return null
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

export default ListOrder;
