import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity, Alert, View, Text, Button} from 'react-native';
import DeviceInfo from 'react-native-device-info';

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
    db: require("../dbIp.json")
  }
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
      this.props.navigation.navigate("AddUserScreen", {id: id});
    } else {
      this.setState({name: data.name})
    }
  })
}

render() {
	return (
		<View style={styles.container}>
      <Text style={styles.text}>Welcome {this.state.name}</Text>
      <Button
      title="To overview"
      onPress={() => this.props.navigation.navigate("OverviewScreen")}
      />
    </View>
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
    textAlign: "center"
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
  });
