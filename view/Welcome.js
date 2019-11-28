import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity, Alert, View, Text, Button} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {Icon} from 'native-base';
import Notification from '../src/notifications.js';

export default class Welcome extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };

constructor(props){
  super(props);
  this._isMounted = false;
  this.state = {
    name: "",
    db: require("../dbIp.json"),
    rememberMe: this.props.navigation.getParam("rememberMe")
  }

  this.notif = new Notification(this.onNotif.bind(this));
}

componentDidMount(){
  this._isMounted = true;
  this.identifyUser(DeviceInfo.getUniqueId());
  this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.identifyUser(DeviceInfo.getUniqueId());
  });
}

componentWillUnmount(){
  this._isMounted = false;
}

onSwipeLeft() {
	this.props.navigation.navigate("OverviewScreen")
}

identifyUser(id){
  fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_u/user/" + id, {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.errorNum == "404") {
      this.props.navigation.navigate("AddUserScreen", {id: id, rememberMe: this.state.rememberMe});
    } else {
      this.setState({name: data.name})
    }
  })
}

 onNotif(notif) {
   Alert.alert(notif.title, notif.message);
 }

render() {
	const config = {
		velocityThreshold: 0.3,
		directionalOffsetThreshold: 80
	};
	return (
		<GestureRecognizer
		onSwipeLeft={() => this.onSwipeLeft()}
		config={config}
		style={styles.container}>
		<Text style={styles.text}>Welcome {this.state.name}</Text>
		<Text style={styles.text}>Swipe left to continue</Text>
        <Text style={styles.text}>{ this.notif.sendNotif() }</Text>
		</GestureRecognizer>
	);
 }
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  text: {
    textAlign: "center",
    fontSize: 20,
  },
  item: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: '#696969',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
    textShadowColor: "white",
    textShadowRadius: 8,
    alignSelf: "center"
  },
  button: {
    borderWidth: 1,
    borderColor: "#000000",
    margin: 5,
    padding: 5,
    width: "70%",
    backgroundColor: "#DDDDDD",
    borderRadius: 5,
  }
 });
