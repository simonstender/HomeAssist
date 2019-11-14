import React, {Component} from 'react';
import { TouchableOpacity, Image, AppRegistry, StyleSheet, Text, View } from 'react-native';
import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';

import Login from "./view/Login"
import Overview from "./view/Overview"
import RoomScreen from "./view/RoomScreen"
import AddRoom from "./view/AddRoom"
import AddDevice from "./view/AddDevice"


const AppStackNavigator = createStackNavigator({
  LoginScreen: Login,
  OverviewScreen: Overview,
  RoomScreenScreen: RoomScreen,
  AddRoomScreen: AddRoom,
  AddDeviceScreen: AddDevice
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

const AppDrawerNavigator = createDrawerNavigator({
  Stäng: AppStackNavigator,
  OverviewScreen: Overview
},
{
  drawerLockMode: "locked-closed",
  drawerBackgroundColor: "#696969",
  contentOptions:{
    labelStyle: {
      fontSize: 24,
      color: '#FFFFFF'},
    }

  }
);

const App = createAppContainer(AppStackNavigator);

export default App;

AppRegistry.registerComponent("App", () => App);
