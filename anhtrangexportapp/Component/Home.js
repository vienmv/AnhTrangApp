import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Authentication } from '../Base';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        roles: []
      },
      keyword: ''
    }
  }

  componentDidMount() {
    this.getLoginUser()
  }

  async getLoginUser() {
    const user = await Authentication.loginUser();
    this.setState({ user: user });
  }

  // refresh = () => {
  //   Actions.OrderTabLayout({ keyword: this.state.keyword, user: this.state.user })
  // }

  setKeyword = (text) => {
    this.setState({ keyword: text })

  }

  render() {
    return (
      <ScrollView style={[styles.vContainer]}>
        <Text style={{
          margin: 20,
          fontWeight: 'bold',
          fontSize: 20,
          lineHeight: 23,
          color: '#333333'
        }}>Xin chào, {this.state.user.name}</Text>
        <View style={[styles.vContainer, { marginLeft: 10, marginRight: 10 }]}>
          {/* {this.state.user.roles.includes("ROLE_MEMBER") || this.state.user.roles.includes("ROLE_ADMIN") ?
            <InputSearch placeholder="Tìm kiếm…" changeText={this.setKeyword} search={this.refresh} />
            : null} */}
          <Text style={{
            margin: 10,
            fontWeight: 'bold',
            fontSize: 15,
            lineHeight: 18,
            color: '#333333'
          }}>Menu</Text>
          
          {this.state.user.roles.includes("ROLE_ADMIN") ? this.menuAdmin() : (
             this.state.user.roles.includes("ROLE_SHIPPER") ? this.menuShipper(): (
              this.state.user.roles.includes("ROLE_SELLER") ? this.menuSeller():  this.menuMember()
              )
          )}
        </View>
      </ScrollView>
    )
  }

  menuMember = () => {
    return (
      <View>
        <View style={styles.buttonContainter}>
          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.OrderTabLayout({ customerId: this.state.user.id, user: this.state.user, title: 'Đơn hàng' });
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/order.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Đơn hàng</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonList}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listNotification();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/bell.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Thông Báo</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonList, { alignItems: 'flex-end' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listNews();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/order.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Tin Tức</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainter}>
          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.profile();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/iconuser.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Hồ sơ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  menuShipper = () => {
    return (
      <View>
        <View style={styles.buttonContainter}>

          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listNews();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/order.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Tin Tức</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonList}>

            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.OrderTabLayout({ shipperId: this.state.user.id, user: this.state.user, title: 'Đơn ship' });
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/tracking.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Đơn ship</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonList, { alignItems: 'flex-end' }]}>
            <TouchableOpacity
                style={styles.buttonBox}
                onPress={() => {
                  Actions.profile();
                }}
              >
                <View style={styles.buttonImage}>
                  <Image
                    source={require("../assets/iconuser.png")}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.textStyle}>Hồ sơ</Text>
                </View>
              </TouchableOpacity>
          </View>
          
        </View>

        <View style={styles.buttonContainter}>

          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listNotification();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/bell.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Thông Báo</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonList}>
            {this.state.user.roles.includes("ROLE_SELLER") ? 
              <TouchableOpacity
                style={styles.buttonBox}
                onPress={() => {
                  Actions.OrderTabLayout({ sellerId: this.state.user.id, user: this.state.user, title: 'Đơn sale' });
                }}
              >
                <View style={styles.buttonImage}>
                  <Image
                    source={require("../assets/check.png")}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.textStyle}>Đơn sale</Text>
                </View>
              </TouchableOpacity>
            :null}
          </View>
          <View style={[styles.buttonList, { alignItems: 'flex-end' }]}>
            {this.state.user.roles.includes("ROLE_SELLER") ?
              <TouchableOpacity
                style={styles.buttonBox}
                onPress={() => {
                  Actions.listCustomer();
                }}
              >
                <View style={styles.buttonImage}>
                  <Image
                    source={require("../assets/team.png")}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.textStyle}>Nhà cung cấp</Text>
                </View>
              </TouchableOpacity>
            : null}
          </View>
          
        </View>
        <View style={styles.buttonContainter}>
          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            {this.state.user.roles.includes("ROLE_MEMBER") ?
              <TouchableOpacity
                style={styles.buttonBox}
                onPress={() => {
                  Actions.OrderTabLayout({ customerId: this.state.user.id, user: this.state.user, title: 'Đơn hàng' });
                }}
              >
                <View style={styles.buttonImage}>
                  <Image
                    source={require("../assets/order.png")}
                    style={styles.imageStyle}
                  />
                  <Text style={styles.textStyle}>Đơn hàng</Text>
                </View>
              </TouchableOpacity>
            : null}
          </View>
        </View>
      </View>
    )
  }

  menuSeller = () => {
    return (
      <View>
        <View style={styles.buttonContainter}>
          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listCustomer();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/addorder.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Nhà cung cấp</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonList}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.OrderTabLayout({ sellerId: this.state.user.id, user: this.state.user, title: 'Đơn sale' });
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/check.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Đơn sale</Text>
              </View>
            </TouchableOpacity>

          </View>
          <View style={[styles.buttonList, { alignItems: 'flex-end' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listNotification();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/check.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Thông Báo</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.buttonContainter}>
          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listNews();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/order.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Tin Tức</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonList}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.profile();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/iconuser.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Hồ sơ</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonList, { alignItems: 'flex-end' }]}>
            {
              this.state.user.roles.includes("ROLE_MEMBER") ? 
              <TouchableOpacity
                  style={styles.buttonBox}
                  onPress={() => {
                    Actions.OrderTabLayout({ customerId: this.state.user.id, user: this.state.user, title: 'Đơn hàng' });
                  }}
                >
                  <View style={styles.buttonImage}>
                    <Image
                      source={require("../assets/order.png")}
                      style={styles.imageStyle}
                    />
                    <Text style={styles.textStyle}>Đơn hàng</Text>
                  </View>
                </TouchableOpacity>
            : null}
          </View>
        </View>

        <View style={styles.buttonContainter}>
          
          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            
          </View>
          
          <View style={[styles.buttonList, { alignItems: 'flex-end' }]}>
            
          </View>
        </View>
        
      </View>

    )
  }

  menuAdmin = () => {
    return (
      <View>
        <View style={styles.buttonContainter}>
          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.OrderTabLayout({ user: this.state.user, title: 'Đơn hàng' });
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/tracking.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Đơn hàng</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.buttonList]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listNews();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/order.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Tin Tức</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonList, { alignItems: 'flex-end' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listNotification();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/bell.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Thông Báo</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainter}>
          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listCustomer();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/team.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Nhà Cung Cấp</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonList}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listUser();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/team.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Nhân Viên</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonList, { alignItems: 'flex-end' }]}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.listUserGroup();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/marker.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Nhóm</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainter}>
          <View style={[styles.buttonList, { alignItems: 'flex-start' }]}>

            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => {
                Actions.profile();
              }}
            >
              <View style={styles.buttonImage}>
                <Image
                  source={require("../assets/iconuser.png")}
                  style={styles.imageStyle}
                />
                <Text style={styles.textStyle}>Hồ sơ</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonList}>

          </View>
          <View style={[styles.buttonList, { alignItems: 'flex-end' }]}>
          </View>

        </View>

      </View>
    )
  }
}
export default Home;

const styles = StyleSheet.create({
  buttonContainter: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  buttonBox: {
    height: 90,
    width: 90,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    padding: 5,
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { height: 0, width: 0 },
    alignItems: "center",
    justifyContent: "center",
  },
  buttonList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    color: "#4F4F4F",
    fontSize: 14,
    lineHeight: 16,
    textAlign: "center"
  },
  imageStyle: {
    height: 30,
    width: 28,
    resizeMode: 'contain',
    marginBottom: 10,
    marginRight: 15,
    marginLeft: 15
  },
});
