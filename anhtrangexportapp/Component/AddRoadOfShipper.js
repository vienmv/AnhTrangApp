import React, { Component } from 'react';
import { FlatList, Text, TouchableOpacity, View, Alert } from 'react-native';

import { api, InputSearch, RenderProcessing, styles } from '../Base';
import local from '../local.json';
import { Actions } from 'react-native-router-flux';

class AddRoadOfShipper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cityName: '',
      isLoading: false,
      userId: this.props.user.id,
      hideResultsCity: true,
      nameCityInvalid: false,
      cities: this.props.roads,
      listCity: [],
      queryCities: '',
      checkAll: false,
      cityList: [],
      cityAll: [],
      listCityName: null,
    }
  }

  componentDidMount() {
    this.loadAllCities()
  }

  async loadAllCities() {
    const options = [];
    local.map(item => {
      options.push(item)
    })
    this.setState({ cityAll: options, cityList: options });
  }

  submit = () => {
    this.add();
  }

  async add() {
    this.setState({ isLoading: true })
    api.authFetch('/api/shipper/road/add', "post", this.state, () => {
      this.setState({ isLoading: false });
      Alert.alert("Thành công",
        "Thêm khu vực ship thành công.",
        [
          {
            text: "OK",
            onPress: () => {
              Actions.pop({ refresh: {} });
            }
          }
        ]);
    }, err => {
      this.setState({ isLoading: false });
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
      <View style={styles.vContainer}>
        {this.renderProcessing()}
        <Text style={styles.label}>Thành Phố</Text>
        <Text style={styles.label}> {this.state.cities.toString()} </Text>
        <InputSearch placeholder="Tìm thành phố...." changeText={(text) => {
          if (text.trim().length == 0) {
            this.setState({ cityList: this.state.cityAll });//set lai data cho list
          } else {
            const filterShippers = [];
            this.state.cityAll.forEach(item => {
              if (item.name.toUpperCase().indexOf(text.toUpperCase()) != -1) {
                filterShippers.push(item)
              }
            })

            this.setState({ cityList: filterShippers });//set lai data cho list
          }
        }} />
        <MultiSelectList data={this.state.cityList} cities={this.state.cities} checkAll={this.state.checkAll} selected={(selected) => {
          const cities = []
          for (const entry of selected.entries()) {
            if (entry[1]) {
              cities.push(entry[0])
            }
          }
          this.setState({ cities })
        }} />

        <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', alignItems: 'center' }]} onPress={this.submit}>
          <Text style={styles.buttonText}>Thêm</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
export default AddRoadOfShipper;

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
    for (var i = 0; i < this.props.cities.length; i++) {
      this.state.selected.set(this.props.cities[i], true);
    }
  }

  _renderItem = ({ item }) => (
    item.name != '' ?
      <MyListItem
        id={item.name}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(item.name)}
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