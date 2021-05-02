import React, { Component } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import { Actions } from 'react-native-router-flux';

import { api, InputSearch, RenderProcessing, styles } from '../Base';

class UpdateOrderShip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.order.id,
      status: this.props.order.status,
      shippers: this.props.order.shippers,
      shipperList: [],
      shipperAll: [],
      queryShipper: this.props.order.shipperName,
      isLoading: false,
      statusOptions: ['Mới', 'Chờ ship', 'Hoàn Thành', 'Hủy'],
      checkAll: this.props.order.shippers.length == 0 ? false : true
    }
  }

  componentDidMount() {
    this.loadAllShipper()
  }

  async loadAllShipper() {
    this.setState({ isLoading: true })
    const searchDTO = {
      length: null,
      start: null,
      roleList: ["ROLE_SHIPPER"],
      searchRoad: this.props.order.cityName,
      search: {
        value: ""
      }
    }

    api.authFetch("/api/admin/accounts", "post", searchDTO,
      response => {
        response.json()
          .then(responseJson => {
            this.setState({ shipperAll: responseJson.data, shipperList: responseJson.data, isLoading: false });
          })
      })
  }

  async update() {
    this.setState({ isLoading: true })
    api.authFetch("/api/seller/order/assign-shipper", "put", this.state,
      (data) => {
        this.setState({ isLoading: false })
        Alert.alert('Thành công', 'Cập nhật thành công.',
          [
            {
              text: 'OK', onPress: () => {
                Actions.pop({ refresh: {} });
              }
            }
          ]
        )
      })
  }

  submit = () => {
    this.update()
  }

  selectType = (index, value) => {
    this.setState({ status: parseInt(index) + 1 })
  }

  toggleAllShipper = () => {
    if (this.state.shippers.length == 0) {
      let shippers = []
      this.state.shipperList.map(item => {
        shippers.push(item.id)
      })
      this.setState({ checkAll: true, shippers: shippers })
    } else {
      this.setState({ checkAll: false, shippers: [] })
    }
  }

  renderProcessing = () => {
    if (this.state.isLoading) {
      return (<RenderProcessing />)
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} keyboardShouldPersistTaps="handled" extraScrollHeight={120}>
        {this.renderProcessing()}
        <View style={styles.vContainer}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}> Chọn nhiều shippers</Text>
            <Text selectable onPress={() => this.toggleAllShipper()} style={[styles.label, this.state.checkAll ? { color: 'red' } : styles.label]}>{this.state.checkAll ? '- Bỏ chọn tất cả' : '+ Chọn tất cả'}</Text>
          </View>

          <Text style={styles.label}> {this.state.shippers.toString()} </Text>
          <InputSearch placeholder="Tìm shippers...." changeText={(text) => {
            if (text.trim().length == 0) {
              this.setState({ shipperList: this.state.shipperAll, queryShipper: "" });//set lai data cho list
            } else {
              const filterShippers = [];
              this.state.shipperAll.forEach(item => {
                if (item.name.toUpperCase().indexOf(text.toUpperCase()) != -1
                  || item.id.toString().toUpperCase().indexOf(text.toUpperCase()) != -1) {
                  filterShippers.push(item)
                }
              })

              this.setState({ shipperList: filterShippers, queryShipper: text });//set lai data cho list
            }
          }} />
          <MultiSelectList data={this.state.shipperList} shippers={this.state.shippers} checkAll={this.state.checkAll} selected={(selected) => {
            const shippers = []
            for (const entry of selected.entries()) {
              if (entry[1]) {
                shippers.push(entry[0])
              }
            }
            this.setState({ shippers })
          }} />

          <View style={{ height: 0.5, backgroundColor: '#FFC33F', margin: 10 }}></View>
          <Text style={styles.label}>Trạng thái</Text>
          <ModalDropdown
            options={this.state.statusOptions}
            onSelect={this.selectType}
            defaultValue={this.state.statusOptions[this.state.status - 1]}
            style={{
              backgroundColor: "#FFFFFF",
              margin: 10,
              padding: 10,
              borderRadius: 5
            }}
            textStyle={{ fontSize: 14, color: "#FF6600" }}
            dropdownTextStyle={{ fontSize: 14, color: "#000000" }}
            dropdownStyle={{ width: "100%", marginLeft: 20, height: 160 }}
          />
          <TouchableOpacity style={[styles.buttonContainer]} onPress={this.submit}>
            <Text style={styles.buttonText}>Cập Nhật</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }

}
export default UpdateOrderShip;

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
            {this.props.name} - (ID: {this.props.id} )
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class MultiSelectList extends React.PureComponent {
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
    for (var i = 0; i < this.props.shippers.length; i++) {
      this.state.selected.set(this.props.shippers[i], true);
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