import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity, Image} from 'react-native';

import ControlPanel from "../components/ControlPanel"

export default class Kitchen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Kitchen"),
      headerLeft: <TouchableOpacity
      onPress={() => navigation.openDrawer()}>
      <Image
      style={{ height: 44, width: 44, left: 10 }}
      source={require("../images/Hamburger_icon.svg.png")}
      />
      </TouchableOpacity>,
      headerRight: navigation.state.params && navigation.state.params.headerRight
    };
  };
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      data: [{id: "0", name: "Roof lamp", isLight: true, remainingLight: 500, lights: "On", buttonColor: "red"},
            {id: "1", name: "Oven", isLight: false, remainingLight: 200, lights: "On", buttonColor: "red"}]
    }
  }

  componentDidMount(){
    this._isMounted = true;
    this.props.navigation.setParams({
      headerRight: <TouchableOpacity
      onPress={() => this.addObject()}
      >
      <Image
      style={{ height: 44, width: 44, right: 10 }}
      source={require("../images/greenPlus.png")}
      />
      </TouchableOpacity>
    })
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  addObject(){
    Alert.alert(
      'Select type',
      '',
      [
        {
          text: 'Add light',
          onPress: () => this.props.navigation.navigate("AddLightScreen"),
          style: 'cancel',
        },
        {
          text: "Add other",
          onPress: () => this.props.navigation.navigate("AddOtherScreen"),
          style: 'cancel',
        }
      ]
    )
  }

  render() {
    return (
      <ControlPanel data={this.state.data} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
