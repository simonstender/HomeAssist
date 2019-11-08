import React, {Component} from 'react';
import { TouchableOpacity, Image, AppRegistry, StyleSheet, Text, View } from 'react-native';
import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer'

import Login from "./view/Login"
import Overview from "./view/Overview"

const AppStackNavigator = createStackNavigator({
  LoginScreen: Login,
  OverviewScreen: Overview
},
{
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#ADADAD',
      height: 80,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontSize: 32,
      paddingLeft: 30 },
      headerTintColor: '#FFFFFF',
      drawerLockMode: "locked-closed",
      gesturesEnabled: false,
    },
  }
);

const AppDrawerNavigator = createDrawerNavigator({
  Stäng: AppStackNavigator,
},
{
  drawerLockMode: "locked-closed",
  drawerBackgroundColor: "#ADADAD",
  contentOptions:{
    labelStyle: {
      fontSize: 24,
      color: '#FFFFFF'},
    }

  }
);

const App = createAppContainer(AppDrawerNavigator);

export default App;

AppRegistry.registerComponent("App", () => App);
