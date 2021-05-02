import React, { Component } from 'react';
import { Alert, Linking, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import { api, Authentication, NumberUtils, RenderProcessing, styles } from '../Base';

var radio_props = [
  { label: 'Hài lòng', value: 1 },
  { label: 'Bình thường', value: 2 },
  { label: 'Không hài lòng', value: 3 }
];

class InforOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.order ? this.props.order.id : this.props.orderId,
      review: this.props.order ? this.props.order.review : null,
      starRating: this.props.order && this.props.order.starRating ? this.props.order.starRating : 0,
      order: this.props.order ? this.props.order : {},
      isLoading: false,
      user: {
        roles: []
      }
    }
  }

  componentDidMount() {
    this.getLoginUser();
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

  async getLoginUser() {
    const user = await Authentication.loginUser();
    if (!user) {
      await Authentication.logout();
      return;
    }
    this.setState({ user: user });

    if (this.props.orderId) {
      this.setState({ isLoading: true })

      api.authFetchWithGet("/api/member/order/" + this.props.orderId, response => {
        response.json().then(responseJson => {
          this.setState({ isLoading: false })
          this.setState({
            order: responseJson,
            review: responseJson.review,
            starRating: responseJson.starRating
          });
        });
      })
    }
  }

  acceptOrder = (item) => {
    this.setState({ processing: true })
    api.authFetch("/api/shipper/order/assignment/" + item.id, "put", {},
      (data) => {
        this.setState({ processing: false })
        Alert.alert('Thành công', 'Nhận đơn thành công. Đang chờ vận chuyển',
          [
            {
              text: 'OK', onPress: () => {
                this.refresh()
              }
            },
          ]
        )
      }, status => {
        this.setState({ processing: false })
        Alert.alert('Thất bại', 'Đơn đã có người khác nhận rồi.',
          [
            {
              text: 'OK', onPress: () => {
                this.refresh()
              }
            },
          ]
        )
      })
  }

  refresh = () => {
    Actions.pop({ refresh: {} });
  }

  updateReview = async () => {
    this.setState({ isLoading: true })
    api.authFetch("/api/member/order/update-review", "put", this.state,
      (data) => {
        this.setState({ isLoading: false })
        Alert.alert('Thành công', 'Đánh giá thành công.',
          [
            {
              text: 'OK', onPress: () => {
                Actions.pop({ refresh: {} });
              }
            },
          ]
        )
      })
  }

  renderProcessing = () => {
    if (this.state.isLoading) {
      return <RenderProcessing />
    }
    return null
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

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} keyboardShouldPersistTaps="handled" extraScrollHeight={120}>
        {this.renderProcessing()}
        <View style={styles.item}>
          <View style={styles.itemHead}>
            <Text style={styles.itemHeadText}>ID: {this.state.order.id} - {this.setStatus(this.state.order.status)}</Text>
          </View>
          <View style={styles.itemBody}>
            <View style={styles.vContainer}>
              <View style={styles.hContainer}>
                <Text style={styles.title}>Số lượng: </Text>
                <Text style={styles.info}>{(this.state.order.weight)} {this.state.order.unit}</Text>
              </View>
              <View style={styles.hContainer}>
                <Text style={styles.title}>Mô tả: </Text>
                <Text style={[styles.info, { fontStyle: 'italic' }]}>{(this.state.order.description)}</Text>
              </View>
              <View style={styles.hContainer}>
                <Text style={styles.title}>Địa chỉ: </Text>
                <Text style={[styles.info, { fontStyle: 'italic' }]} selectable onPress={() => Linking.openURL("https://www.google.com/maps/place/" + (this.state.order.address + ',' + this.state.order.wardsName + ',' + this.state.order.districtName + ',' + this.state.order.cityName))}>{(this.state.order.address)} - {(this.state.order.wardsName)} - {(this.state.order.districtName)} - {(this.state.order.cityName)}</Text>
              </View>
              <View style={styles.hContainer}>
                <Text style={styles.title}>Điện thoại: </Text>
                <Text style={[styles.info, { fontStyle: 'italic' }]} selectable onPress={() => Linking.openURL(`tel:${this.state.order.phoneCustomer}`)}>{this.state.order.phoneCustomer}</Text>
              </View>
              <View style={{ height: 0.5, backgroundColor: '#FFC33F', margin: 10 }}></View>
              <View style={styles.hContainer}>
                <Text style={styles.title}>Thực nhận: </Text>
                <Text style={styles.info}>{(this.state.order.realWeight)}</Text>
              </View>
              <View style={styles.hContainer}>
                <Text style={styles.title}>Giá: </Text>
                <Text style={styles.info}>{NumberUtils.formatNumber(this.state.order.price)}</Text>
              </View>
              <View style={styles.hContainer}>
                <Text style={styles.title}>Chú thích : </Text>
                <Text style={[styles.info, { fontStyle: 'italic' }]}> {this.state.order.note}</Text>
              </View>

              {this.state.order.status == 3 || this.state.order.status == 4 ?
                <View>
                  {this.state.order.shipperId == this.state.user.id ?
                    <View><View style={styles.hContainer}>
                      <Text style={styles.title}>Giá ship : </Text>
                      <Text style={[styles.info, { fontStyle: 'italic' }]}> {NumberUtils.formatNumber(this.state.order.cost)}</Text>
                    </View>
                      <View style={styles.hContainer}>
                        <Text style={styles.title}>Tiền ship : </Text>
                        <Text style={[styles.info, { fontStyle: 'italic' }]}> {NumberUtils.formatNumber(this.state.order.realWeight * this.state.order.cost)}</Text>
                      </View>
                    </View> : null}
                  <View style={{ height: 0.5, backgroundColor: '#FFC33F', margin: 10 }}></View>
                  <View style={styles.hContainer}>
                    <Text style={styles.title}>Đánh giá : </Text>
                    <Text style={[styles.info]}> {this.setStarRating(this.state.starRating)}</Text>
                  </View>
                  <View style={styles.hContainer}>
                    <Text style={styles.title}>Nhận xét : </Text>
                    <Text style={[styles.info]}> {this.state.review}</Text>
                  </View>
                </View> : null}
            </View>
          </View>
          <View style={styles.itemFoot}>
            <View style={styles.hContainer}>
              <Text style={styles.info} >{this.state.order.createdDate}</Text>
            </View>
            <View style={[styles.hContainer, { justifyContent: "flex-end" }]}>
              <Text style={[styles.info, { textAlign: 'right' }]}>Seller: {this.state.order.createdBy}</Text>
            </View>
          </View>
        </View>
        {(this.state.order.status == 3 || this.state.order.status == 4) && this.state.user.roles.includes("ROLE_MEMBER") ?
          <View>
            <View style={styles.textAreaNCC}>
              <Text>
                Để nâng cao chất lượng dịch vụ, Quý khách vui lòng lựa chọn một trong ba tiêu chí sau.
              </Text>
            </View>
            <View style={styles.vContainer}>
              <Text style={styles.label}>Đánh giá</Text>
              <RadioForm formHorizontal={true} animation={true} style={[styles.inputs]}>
                {
                  radio_props.map((obj, i) => (
                    <RadioButton labelHorizontal={true} key={i} >
                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={(this.state.starRating - 1) === i}
                        onPress={(value) => {
                          { this.setState({ starRating: value }) }
                        }}
                        borderWidth={1}
                        buttonInnerColor={'#089101'}
                        buttonOuterColor={(this.state.starRating - 1) === i ? '#089101' : '#000'}
                        buttonSize={15}
                        buttonOuterSize={20}
                        buttonStyle={{}}
                      />
                      <RadioButtonLabel
                        obj={obj}
                        index={i}
                        labelHorizontal={true}
                        onPress={(value) => {
                          { this.setState({ starRating: value }) }
                        }}
                        labelStyle={{ fontSize: 14 }}
                        labelWrapStyle={{ marginRight: 5 }}
                      />
                    </RadioButton>
                  ))
                }
              </RadioForm>
              <Text style={styles.label}>Nhận xét</Text>
              <TextInput style={[styles.textArea]}
                placeholder="Nhận xét"
                multiline={true}
                numberOfLines={8}
                underlineColorAndroid='transparent'
                value={this.state.review}
                onChangeText={(review) => this.setState({ review: review })} />

              <TouchableOpacity style={[styles.buttonContainer, { flexDirection: 'row', alignItems: 'center' }]} onPress={this.updateReview}>
                <Text style={styles.buttonText}>Gửi đánh giá</Text>
              </TouchableOpacity>
            </View>
          </View>
          : null
        }
        {
          this.state.user.roles.includes("ROLE_ADMIN") ?
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: '#FFC33F' }} onPress={() => Actions.updateOrder({ order: this.state.order })}>
                  <Text style={{
                    fontSize: 15,
                    lineHeight: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#ffffff',
                    textTransform: 'uppercase'
                  }}>Cập nhập đơn</Text>
                </TouchableOpacity>
                {this.state.order.status == 3 ? null 
                : 
                  <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: 'red' }} onPress={() => Actions.UpdateOrderShip({ order: this.state.order })}>
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
                {(this.state.order.status == 3) ?
                  <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: 'coral' }} onPress={() => Actions.updateCost({ order: this.state.order })}>
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
            : null
        }
        {
          this.state.user.roles.includes("ROLE_SELLER") && this.state.order.status == 1 ?
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: '#FFC33F' }} onPress={() => Actions.sellerUpdateOrder({ order: this.state.order })}>
                  <Text style={{
                    fontSize: 15,
                    lineHeight: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#ffffff',
                    textTransform: 'uppercase'
                  }}>Cập nhập đơn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 10, padding: 10, flex: 1, backgroundColor: 'red' }} onPress={() => Actions.sellerUpdateOrderShip({ order: this.state.order })}>
                  <Text style={{
                    fontSize: 15,
                    lineHeight: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#ffffff',
                    textTransform: 'uppercase'
                  }}>Chọn shipper</Text>
                </TouchableOpacity>

              </View>
            </View>
            : null
        }
        {
          this.state.user.roles.includes("ROLE_SHIPPER") && this.state.order.status == 1 ?
          <TouchableOpacity style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#089101' }} onPress={() => this.acceptOrder(this.state.order)}>
            <Text style={{
              fontSize: 15,
              lineHeight: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#089101',
              textTransform: 'uppercase'
            }}>Nhận đơn</Text>
          </TouchableOpacity>
            : null
        }
        {
          this.state.user.roles.includes("ROLE_SHIPPER") && this.state.order.status == 2 ?
          <TouchableOpacity style={{ marginTop: 10, padding: 10, backgroundColor: '#FFC33F' }} onPress={() => Actions.updateOrderShipper({ order: this.state.order })}>
            <Text style={{
              fontSize: 15,
              lineHeight: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#ffffff',
              textTransform: 'uppercase'
            }}>Cập nhập đơn</Text>
          </TouchableOpacity>
            : null
        }
      </KeyboardAwareScrollView>
    )
  }
}
export default InforOrder;
