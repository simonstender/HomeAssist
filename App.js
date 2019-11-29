import React, {Component} from 'react';
import { TouchableOpacity, Image, AppRegistry, StyleSheet, Text, View } from 'react-native';
import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from "./view/Login"
import Overview from "./view/Overview"
import RoomScreen from "./view/RoomScreen"
import AddRoom from "./view/AddRoom"
import AddDevice from "./view/AddDevice"
import Welcome from "./view/Welcome"
import AddUser from "./view/AddUser"
import EditName from "./view/EditName"

const AppStackNavigator = createStackNavigator({
  LoginScreen: Login,
  OverviewScreen: Overview,
  RoomScreenScreen: RoomScreen,
  AddRoomScreen: AddRoom,
  AddDeviceScreen: AddDevice,
  WelcomeScreen: Welcome,
  AddUserScreen: AddUser,
  EditNameScreen: EditName,
},
{
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#EFEFF0',
      height: 80,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontSize: 32,
      paddingLeft: 30 },
      headerTintColor: 'black',
      drawerLockMode: "locked-closed",
      gesturesEnabled: false,
    },
  }
);

const App = createAppContainer(AppStackNavigator);

export default App;

AppRegistry.registerComponent("App", () => App);
