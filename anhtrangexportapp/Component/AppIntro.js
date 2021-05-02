import React from 'react';
import { Image, Text, View, AsyncStorage, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Actions } from 'react-native-router-flux';

import { Authentication, RenderProcessing } from '../Base';

const slides = [
  {
    key: '1',
    title: 'THU MUA DẦU ĂN ĐÃ QUA SỬ DỤNG',
    text: 'Ánh Trang Export',
    image: require('../assets/intro1.png'),
  },
  {
    key: '2',
    title: 'MUA BÁN TIỆN LỢI QUA ỨNG DỤNG',
    text: 'Ánh Trang Export',
    image: require('../assets/intro2.png'),
  },
  {
    key: '3',
    title: 'GIAO DỊCH NHANH CHÓNG',
    text: 'Ánh Trang Export',
    image: require('../assets/intro3.png'),
  }
]

export default class AppIntro extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: true, bottomButton: false }
    this.checkIsFirst()
  }

  checkIsFirst = async () => {
    const isFisrt = await Authentication.loginUser()
    if (isFisrt) {
      this.checkAuthen()
    } else {
      this.setState({ isLoading: false })
    }
  }

  _renderNextButton = () => {
    return (
      <Text style={{ fontSize: 14, padding: 15, color: '#4F4F4F' }}>TIẾP</Text>
    )
  }
  _renderSkipButton = () => {
    return (
      <Text style={{ fontSize: 14, padding: 15, color: '#E0E0E0' }}>BỎ QUA</Text>
    )
  }
  _renderDoneButton = () => {
    return (
      <View style={{ backgroundColor: '#089101', height: 50, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>BẮT ĐẦU</Text>
      </View>
    );
  }

  _onSlideChange = (index) => {
    if (index == 2) {
      this.setState({ bottomButton: true })
    } else {
      this.setState({ bottomButton: false })
    }
  }

  _renderItem = ({ item }) => {
    return (
      <View style={{
        flex: 1, backgroundColor: '#fff'
      }}>
        <Image source={item.image} style={{ flex: 3, width: '100%' }} />
        <View style={{
          flex: 1,
          alignItems: 'center',
          marginTop: 10
        }}>
          <Text style={{ fontSize: 20, lineHeight: 24, color: '#089101', fontWeight: "bold" }}>{item.title}</Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '300',
            color: '#333333',
            marginTop: 12,
            marginLeft: 50,
            marginRight: 50,
            textAlign: 'center'
          }}>{item.text}</Text>
        </View>
      </View >
    );
  }

  _onDone = async () => {
    await AsyncStorage.setItem("isFisrt", "false");
    this.checkAuthen()
  }

  checkAuthen = async () => {
    this.setState({ isLoading: true })

    const user = await Authentication.loginUser()
    if (user) {
      Actions.reset("home")
    } else {
      Actions.reset("login")
    }
  }

  render() {
    if (this.state.isLoading) {
      return <RenderProcessing />
    } else {
      return (
        <View style={{ flex: 1 }}>
          <AppIntroSlider renderDoneButton={this._renderDoneButton} showSkipButton={true} onSlideChange={this._onSlideChange}
            bottomButton={this.state.bottomButton}
            renderNextButton={this._renderNextButton} renderSkipButton={this._renderSkipButton}
            renderItem={this._renderItem} slides={slides} onSkip={this._onDone} onDone={this._onDone} dotStyle={{ backgroundColor: '#C2DEC0' }} activeDotStyle={{ backgroundColor: '#247158' }} />
        </View>
      )
    }
  }
}