import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../Base';
import ListMemberOrder from './ListMemberOrder';
import ListOrder from './ListOrder';
import ListSaleOrder from './ListSaleOrder';
import ListShipOrder from './ListShipOrder';

class OrderTabLayout extends Component {
  constructor(props) {
    super(props)
    this.searchDTO = {
      length: 12,
      start: 0,
      fromDate: this.props.fromDate ? this.props.fromDate : "",
      toDate: this.props.toDate ? this.props.toDate : "",
      status: this.props.tabId ? this.props.tabId : 1,
      columns: [{ data: "createdDate" }],
      order: [{ column: 0, dir: "desc" }],
      search: {
        value: this.props.keyword ? this.props.keyword : ""
      },
      sellerId: this.props.sellerId ? this.props.sellerId : null,
      shipperId: this.props.shipperId ? this.props.shipperId : null,
      customerId: this.props.customerId ? this.props.customerId : null
    }
    this.state = {
      tabId: this.props.tabId ? this.props.tabId : 1,
      fromDate: this.props.fromDate ? this.props.fromDate : "",
      toDate: this.props.toDate ? this.props.toDate : ""
    }
  }

  componentDidMount() {
    this.setState({
      tabId: this.props.tabId ? this.props.tabId : 1,
      fromDate: this.props.fromDate ? this.props.fromDate : "",
      toDate: this.props.toDate ? this.props.toDate : ""
    })
  }

  _onPressButton(tabId) {
    if (this.state.tabId != tabId) {
      this.searchDTO.status = tabId
      this.setState({ tabId: tabId })
    }
  }

  renderTabLayout() {
    const buttonStyle1 =
      this.state.tabId == 1 ? styles.active : styles.inactive;
    const textStyle1 =
      this.state.tabId == 1 ? styles.activeText : styles.inactiveText;

    const buttonStyle2 =
      this.state.tabId == 2 ? styles.active : styles.inactive;
    const textStyle2 =
      this.state.tabId == 2 ? styles.activeText : styles.inactiveText;

    const buttonStyle3 =
      this.state.tabId == 3 ? styles.active : styles.inactive;
    const textStyle3 =
      this.state.tabId == 3 ? styles.activeText : styles.inactiveText;

    const buttonStyle4 =
      this.state.tabId == 4 ? styles.active : styles.inactive;
    const textStyle4 =
      this.state.tabId == 4 ? styles.activeText : styles.inactiveText;

    return (
      <View style={styles.buttonList}>
        <TouchableOpacity onPress={text => this._onPressButton(1)} style={buttonStyle1}>
          <View style={{ alignItems: "center", height: "100%" }}>
            <Text style={textStyle1}>Mới</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={text => this._onPressButton(2)} style={buttonStyle2}>
          <View style={{ alignItems: "center", height: "100%" }}>
            <Text style={textStyle2}>Chờ Ship</Text>
          </View>
        </TouchableOpacity>
        {!this.props.shipperId &&

          <TouchableOpacity onPress={text => this._onPressButton(3)} style={buttonStyle3}>
            <View style={{ alignItems: "center", height: "100%" }}>
              <Text style={textStyle3}>Hoàn Thành</Text>
            </View>
          </TouchableOpacity>}

        {!this.props.shipperId &&
          <TouchableOpacity onPress={text => this._onPressButton(4)} style={buttonStyle4}>
            <View style={{ alignItems: "center", height: "100%" }}>
              <Text style={textStyle4}>Huỷ</Text>
            </View>
          </TouchableOpacity>}
      </View>)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        {this.renderTabLayout()}
        <View style={{ flex: 1 }}>
          {this.props.customerId ?
            <ListMemberOrder searchDTO={this.searchDTO} />
            : null}
          {this.props.sellerId ?
            <ListSaleOrder searchDTO={this.searchDTO} />
            : null}
          {this.props.shipperId ?
            <ListShipOrder searchDTO={this.searchDTO} />
            : null}
          {this.props.user.roles.includes("ROLE_ADMIN") ?
            <ListOrder searchDTO={this.searchDTO} />
            : null}
        </View>
      </View>
    );
  }
}
export default OrderTabLayout;