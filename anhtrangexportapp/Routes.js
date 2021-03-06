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
                        <Scene key="login" component={Login} title="????ng Nh???p" hideNavBar={true} />
                        <Scene key="AppIntro" component={AppIntro} initial={true} hideNavBar={true} />
                        <Scene key="home" component={Home} renderTitle={() => { return <AppLogo />; }} backButtonImage={() => null} />
                        <Scene key="changePassword" component={ChangePassword} title="?????i m???t kh???u" />
                        <Scene key="profile" component={Profile} title="H??? s?? c?? nh??n" />
                        <Scene key="register" component={Register} title="????ng k??" hideNavBar={true} />
                        <Scene key="ForgotPassword" component={ForgotPassword} title="Qu??n m???t kh???u" />

                        <Scene key="listUserGroup" component={ListUserGroup} title="Danh S??ch Nh??m" />
                        <Scene key="updateUserGroup" component={UpdateUserGroup} title="C???p nh???t Nh??m" />
                        <Scene key="addUserGroup" component={AddUserGroup} title="Th??m Nh??m" />

                        <Scene key="listCustomerOfUserGroup" component={ListCustomerOfUserGroup} />
                        <Scene key="addCustomerOfUserGroup" component={AddCustomerOfUserGroup} title="Th??m Ng?????i D??ng trong nh??m" />

                        <Scene key="listRoadOfShipper" component={ListRoadOfShipper} />
                        <Scene key="addRoadOfShipper" component={AddRoadOfShipper} title="Th??m Th??nh Ph??? " />

                        <Scene key="assignSeller" component={AssignSeller} title="G??n Seller" />

                        <Scene key="resetRole" component={ResetRole} title="Thay ?????i vai Tr??" />
                        <Scene key="resetGroup" component={ResetGroup} title="Thay ?????i Nh??m" />

                        <Scene key="OrderTabLayout" component={OrderTabLayout} title="Qu???n l?? ????n h??ng" />
                        <Scene key="addOrder" component={AddOrder} title="T???o ????n h??ng" />
                        <Scene key="updateOrder" component={UpdateOrder} title="C???p nh???t ????n h??ng" />
                        <Scene key="UpdateOrderShip" component={UpdateOrderShip} title="C???p nh???t ship ????n h??ng" />
                        <Scene key="UpdateMemberOrder" component={UpdateMemberOrder} title="C???p nh???t ????n h??ng" />
                        <Scene key="updateOrderShipper" component={UpdateOrderShipper} title="C???p nh???t ????n h??ng" />
                        <Scene key="updateCost" component={UpdateCost} title="C???p nh???t g??a ship" />

                        <Scene key="listUser" component={ListUser} title="Danh s??ch nh??n vi??n" />
                        <Scene key="updateUser" component={UpdateUser} title="C???p nh???t nh??n vi??n" />
                        <Scene key="addUser" component={AddUser} title="Th??m nh??n vi??n" />

                        <Scene key="listCustomer" component={ListCustomer} title="Danh s??ch ncc" />
                        <Scene key="updateCustomer" component={UpdateCustomer} title="C???p nh???t ncc" />
                        <Scene key="addCustomer" component={AddCustomer} title="Th??m ncc" />

                        <Scene key="updateProfile" component={UpdateProfile} title="C???p nh???t h??? s??" />
                        <Scene key="listNotification" component={ListNotification} title="Th??ng b??o" />
                        <Scene key="ImagePickup" component={ImagePickup} hideNavBar={true} />

                        <Scene key="listNews" component={ListNews} title="Tin T???c" />
                        <Scene key="inforOrder" component={InforOrder} title="Th??ng tin order" />

                        <Scene key="updateNews" component={UpdateNews} title="C???p nh???t tin t???c" />
                        <Scene key="addNews" component={AddNews} title="Th??m tin t???c" />

                        <Scene key="sellerUpdateOrder" component={SellerUpdateOrder} title="Seller s???a th??ng tin ????n" />
                        <Scene key="sellerUpdateOrderShip" component={SellerUpdateOrderShip} title="Seller s???a th??ng tin shipper" />
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