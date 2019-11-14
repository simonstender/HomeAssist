import React, {Component} from 'react';
import {Platform, StyleSheet, Alert, ImageBackground, TouchableOpacity, Image, FlatList} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right, View, Form, Item, Input, Label } from 'native-base';
import Slider from 'react-native-slider';

export default class RoomScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("name"),
      headerLeft: <TouchableOpacity onPress={() => navigation.navigate("OverviewScreen")}>
  			<Icon style={{ height: 30, width: 64, left: 20 }} name="arrow-back"/>
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
      tempData: [],
      allData: [],
      data: [],
      topPos: 0,
      roomName: this.props.navigation.getParam("name")
    }
  }

  componentDidMount(){
    this._isMounted = true;
    this.fetchDevices();
    this.props.navigation.setParams({
      headerRight: <TouchableOpacity onPress={() => this.props.navigation.navigate("AddDeviceScreen", {name: this.props.navigation.getParam("name"), pos: this.state.topPos})}>
      <Icon style={{ height: 30, width: 64, left: 20 }} name="add"/>
      </TouchableOpacity>});
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.updateDevices();
    });
  }

  fetchDevices(){
    this.setState({isFetching: true, data: [], tempData: [], allData: [], numberOfDevices: 0})
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
        this.state.allData[i] = data[i];
        if (this.state.roomName == data[i].room) {
          this.state.tempData[this.state.numberOfDevices++] = data[i]
        }
  		}
  		this.insertion_Sort(this.state.tempData);
      this.insertion_Sort(this.state.allData);
  		for (var i = 0; i < Object.keys(this.state.tempData).length; i++) {
  			this.state.data[i] = this.state.tempData[i]
  		}
  		if (Object.keys(data).length >= 1) {
  			this.state.topPos = this.state.allData[Object.keys(data).length - 1]._key

  		}
      this.setState({isFetching: false})
    })
  }

  insertion_Sort(data)
  {
    for (var i = 1; i < data.length; i++)
    {
      if (data[i]._key < data[0]._key)
      {
        data.unshift(data.splice(i,1)[0]);
      }
      else if (data[i]._key > data[i-1]._key)
      {
        continue;
      }
      else {
        for (var j = 1; j < i; j++) {
          if (data[i]._key > data[j-1]._key && data[i]._key < data[j]._key)
          {
            data.splice(j,0,data.splice(i,1)[0]);
          }
        }
      }
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.focusListener.remove();
  }

  updateDevices(){
    this.fetchDevices();
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
        if (data[i].name == this.props.navigation.getParam("name")) {
          if (data[i].allLights == "On") {
            for (var j = 0; j < Object.keys(this.state.data).length; j++) {
              this.state.data[j].lights = "Off";
              this.state.data[j].buttonColor = "green";
              this.updateDevice(this.state.data[j], "Off", "green")
            }
          } else if (data[i].allLights == "Off") {
            for (var j = 0; j < Object.keys(this.state.data).length; j++) {
              this.state.data[j].lights = "On";
              this.state.data[j].buttonColor = "red";
              this.updateDevice(this.state.data[j], "On", "red")
            }
          }
        }
      }
      fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_r/room/" + this.props.navigation.getParam("name"), {
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

  renderItem = ({ item, index }) => {
    if (this.state.data[index].isLight == true) {
      return (
        <View style={styles.item}>
          <Text style={styles.title}>{item.name} </Text>
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
          <Text style={styles.title}>{item.name} </Text>
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
    fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_d/device/" + item.name, {
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
