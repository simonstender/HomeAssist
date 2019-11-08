import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity, Image} from 'react-native';

export default class Overview extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Navigering"),
      headerLeft: <TouchableOpacity
      onPress={() => navigation.openDrawer()}>
      <Image
      style={{ height: 90, width: 90, paddingLeft: 30 }}
      source={require("../assets/icon.png")}
      />
      </TouchableOpacity>,
      headerRight: <TouchableOpacity
      onPress={() => navigation.navigate("LoginScreen")}>
      <Image
      style={{ height: 60, width: 60, paddingRight: 30, left: -20 }}
      source={require("../assets/icon.png")}
      />
      </TouchableOpacity>
    };
  };
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {

    }
  }

  componentDidMount(){
    this._isMounted = true;

  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Hej</Text>
      </View>
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
