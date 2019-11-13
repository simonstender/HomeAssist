import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity, Image, FlatList} from 'react-native';
import Slider from 'react-native-slider';

export default class RoomScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Room"),
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
      isFetching: false,
      numberOfDevices: 0,
      data: []
    }
  }

  componentDidMount(){
    this._isMounted = true;
    this.fetchDevices();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.updateDevices();
    });
    this.props.navigation.setParams({
      headerRight: <TouchableOpacity
      onPress={() => this.addObjectAlert()}
      >
      <Image
      style={{ height: 44, width: 44, right: 10 }}
      source={require("../images/greenPlus.png")}
      />
      </TouchableOpacity>
    })
  }

  fetchDevices(){
    this.setState({isFetching: true})
    fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_d/device", {
      method: "GET",
      headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
   },
    })
    .then((response) => response.json())
    .then((data) => {
      for (var i = 0; i < Object.keys(data).length; i++) {
        if (this.props.navigation.getParam("title") == data[i].room) {
          this.state.data[this.state.numberOfDevices++] = data[i]
        }
      }
      this.setState({isFetching: false})
    })
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.focusListener.remove();
  }

  updateDevices(){
    this.setState({isFetching: true})
    fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_r/room", {
      method: "GET",
      headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
   },
    })
    .then((response) => response.json())
    .then((data) => {
      for (var i = 0; i < Object.keys(data).length; i++) {
        if (this.props.navigation.getParam("title") == data[i].room) {
          this.state.data[this.state.numberOfDevices++] = data[i]
        }
      }
      for (var i = 0; i < Object.keys(data).length; i++) {
        if (data[i]._key == this.props.navigation.getParam("title")) {
          if (data[i].allLights == "On") {
            for (var j = 0; j < this.state.numberOfDevices; j++) {
              this.state.data[j].lights = "Off";
              this.state.data[j].buttonColor = "green";
              this.updateDevice(this.state.data[j], "Off", "green")
            }
          } else if (data[i].allLights == "Off") {
            for (var j = 0; j < this.state.numberOfDevices; j++) {
              this.state.data[j].lights = "On";
              this.state.data[j].buttonColor = "red";
              this.updateDevice(this.state.data[j], "On", "red")
            }
          }
        }
      }
      fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_r/room/" + this.props.navigation.getParam("title"), {
        method: "PATCH",
        headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         allLights: "Hold"
       })
      })
      this.setState({isFetching: false})
    })
  }

  addObjectAlert(){
    Alert.alert(
      'New device detected',
      'Would you like to add it?',
      [
        {
          text: 'Yes',
          onPress: () => this.addObject(),
          style: 'cancel',
        },
        {
          text: "No",
          style: 'cancel',
        }
      ]
    )
  }

  addObject(){

  }

  renderItem = ({ item, index }) => {
    if (this.state.data[index].isLight == true) {
      return (
        <View style={styles.item}>
          <Text style={styles.title}>{item._key} </Text>
          <Button
            title={"Power " + this.state.data[index].lights}
            color={this.state.data[index].buttonColor}
            onPress={() => this.onRefresh(index)}
          />
          <Slider
            style={{alignSelf: "center", width: 200, height: 40}}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
        </View>
        );
    } else if (this.state.data[index].isLight == false) {
      return (
        <View style={styles.item}>
          <Text style={styles.title}>{item._key} </Text>
          <Button
            title={"Power " + this.state.data[index].lights}
            color={this.state.data[index].buttonColor}
            onPress={() => this.onRefresh(index)}
          />
        </View>
        );
    }

  };

  updateDevice(item, status, color){
    fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_d/device/" + item._key, {
      method: "PATCH",
      headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       lights: status,
       buttonColor: color,
     })
    })
  }

  onRefresh = (index) => {
    this.setState({isFetching: true})
    if (this.state.data[index].lights == "On") {
      this.state.data[index].lights = "Off";
      this.state.data[index].buttonColor = "green";
      this.updateDevice(this.state.data[index], "Off", "green")
    }
    else if (this.state.data[index].lights == "Off") {
      this.state.data[index].lights = "On";
      this.state.data[index].buttonColor = "red";
      this.updateDevice(this.state.data[index], "On", "red")
    }
    this.setState({isFetching: false})
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={item => item._key}
        onRefresh={() => this.onRefresh()}
        refreshing={this.state.isFetching}
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
    backgroundColor: "black"
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
