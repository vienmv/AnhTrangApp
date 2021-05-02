import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { Router, Scene, Stack } from 'react-native-router-flux';

import AddCustomer from './Component/AddCustomer';
import AddCustomerOfUserGroup from './Component/AddCustomerOfUserGroup';
import AddNews from './Component/AddNews';
import AddOrder from './Component/AddOrder';
import AddRoadOfShipper from './Component/AddRoadOfShipper';
import AddUser from './Component/AddUser';
import AddUserGroup from './Component/AddUserGroup';
import AppIntro from './Component/AppIntro';
import AssignSeller from './Component/AssignSeller';
import ChangePassword from './Component/ChangePassword';
import ForgotPassword from './Component/ForgotPassword';
import Home from './Component/Home';
import ImagePickup from './Component/ImagePickup';
import InforOrder from './Component/InforOrder';
import ListCustomer from './Component/ListCustomer';
import ListCustomerOfUserGroup from './Component/ListCustomerOfUserGroup';
import ListNews from './Component/ListNews';
import ListNotification from './Component/ListNotification';
import ListRoadOfShipper from './Component/ListRoadOfShipper';
import ListUser from './Component/ListUser';
import ListUserGroup from './Component/ListUserGroup';
import Login from './Component/Login';
import OrderTabLayout from './Component/OrderTabLayout';
import Profile from './Component/Profile';
import Register from './Component/Register';
import ResetRole from './Component/ResetRole';
import UpdateCost from './Component/UpdateCost';
import UpdateCustomer from './Component/UpdateCustomer';
import UpdateMemberOrder from './Component/UpdateMemberOrder';
import UpdateNews from './Component/UpdateNews';
import UpdateOrder from './Component/UpdateOrder';
import UpdateOrderShip from './Component/UpdateOrderShip';
import UpdateOrderShipper from './Component/UpdateOrderShipper';
import UpdateProfile from './Component/UpdateProfile';
import UpdateUser from './Component/UpdateUser';
import UpdateUserGroup from './Component/UpdateUserGroup';
import SellerUpdateOrder from './Component/SellerUpdateOrder';
import SellerUpdateOrderShip from './Component/SellerUpdateOrderShip';
import ResetGroup from './Component/ResetGroup';

const Routes = () => {
      return (
            <Router navigationBarStyle={styles.navBar} titleStyle={{ color: '#089101', textTransform: 'uppercase', fontSize: 14 }}>
                  <Stack key="root" tintColor='#089101' backTitle=" ">
                        <Scene key="login" component={Login} title="Đăng Nhập" hideNavBar={true} />
                        <Scene key="AppIntro" component={AppIntro} initial={true} hideNavBar={true} />
                        <Scene key="home" component={Home} renderTitle={() => { return <AppLogo />; }} backButtonImage={() => null} />
                        <Scene key="changePassword" component={ChangePassword} title="Đổi mật khẩu" />
                        <Scene key="profile" component={Profile} title="Hồ sơ cá nhân" />
                        <Scene key="register" component={Register} title="Đăng ký" hideNavBar={true} />
                        <Scene key="ForgotPassword" component={ForgotPassword} title="Quên mật khẩu" />

                        <Scene key="listUserGroup" component={ListUserGroup} title="Danh Sách Nhóm" />
                        <Scene key="updateUserGroup" component={UpdateUserGroup} title="Cập nhật Nhóm" />
                        <Scene key="addUserGroup" component={AddUserGroup} title="Thêm Nhóm" />

                        <Scene key="listCustomerOfUserGroup" component={ListCustomerOfUserGroup} />
                        <Scene key="addCustomerOfUserGroup" component={AddCustomerOfUserGroup} title="Thêm Người Dùng trong nhóm" />

                        <Scene key="listRoadOfShipper" component={ListRoadOfShipper} />
                        <Scene key="addRoadOfShipper" component={AddRoadOfShipper} title="Thêm Thành Phố " />

                        <Scene key="assignSeller" component={AssignSeller} title="Gán Seller" />

                        <Scene key="resetRole" component={ResetRole} title="Thay Đổi vai Trò" />
                        <Scene key="resetGroup" component={ResetGroup} title="Thay Đổi Nhóm" />

                        <Scene key="OrderTabLayout" component={OrderTabLayout} title="Quản lý đơn hàng" />
                        <Scene key="addOrder" component={AddOrder} title="Tạo đơn hàng" />
                        <Scene key="updateOrder" component={UpdateOrder} title="Cập nhật đơn hàng" />
                        <Scene key="UpdateOrderShip" component={UpdateOrderShip} title="Cập nhật ship đơn hàng" />
                        <Scene key="UpdateMemberOrder" component={UpdateMemberOrder} title="Cập nhật đơn hàng" />
                        <Scene key="updateOrderShipper" component={UpdateOrderShipper} title="Cập nhật đơn hàng" />
                        <Scene key="updateCost" component={UpdateCost} title="Cập nhật gía ship" />

                        <Scene key="listUser" component={ListUser} title="Danh sách nhân viên" />
                        <Scene key="updateUser" component={UpdateUser} title="Cập nhật nhân viên" />
                        <Scene key="addUser" component={AddUser} title="Thêm nhân viên" />

                        <Scene key="listCustomer" component={ListCustomer} title="Danh sách ncc" />
                        <Scene key="updateCustomer" component={UpdateCustomer} title="Cập nhật ncc" />
                        <Scene key="addCustomer" component={AddCustomer} title="Thêm ncc" />

                        <Scene key="updateProfile" component={UpdateProfile} title="Cập nhật hồ sơ" />
                        <Scene key="listNotification" component={ListNotification} title="Thông báo" />
                        <Scene key="ImagePickup" component={ImagePickup} hideNavBar={true} />

                        <Scene key="listNews" component={ListNews} title="Tin Tức" />
                        <Scene key="inforOrder" component={InforOrder} title="Thông tin order" />

                        <Scene key="updateNews" component={UpdateNews} title="Cập nhật tin tức" />
                        <Scene key="addNews" component={AddNews} title="Thêm tin tức" />

                        <Scene key="sellerUpdateOrder" component={SellerUpdateOrder} title="Seller sửa thông tin đơn" />
                        <Scene key="sellerUpdateOrderShip" component={SellerUpdateOrderShip} title="Seller sửa thông tin shipper" />
                  </Stack>
            </Router>
      )
}

const AppLogo = () => {
      return (
            <View style={styles.logo}>
                  <Image source={require('./assets/icon.png')}
                        style={{
                              width: 30, height: 30, borderRadius: 15
                        }} />
            </View>
      );
};


const styles = StyleSheet.create({
      logo: {
            flex: 1,
            alignItems: 'center',
            marginLeft: Platform.OS === 'android' ? -50 : 0
      },
      navBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff', // changing navbar color
            borderBottomColor: 'transparent',
            borderBottomWidth: 0,
            color: '#089101'
      }
})

export default Routes 