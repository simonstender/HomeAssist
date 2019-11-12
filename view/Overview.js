import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity, Image, FlatList, AsyncStorage} from 'react-native';

export default class Overview extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title"),
      headerLeft: <TouchableOpacity
      onPress={() => navigation.openDrawer()}>
      <Image
      style={{ height: 44, width: 44, left: 10 }}
      source={require("../images/Hamburger_icon.svg.png")}
      />
      </TouchableOpacity>
    };
  };
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      isFetching: false,
      numberOfDevices: [],
      data: []
    }
  }

  componentDidMount(){
    this._isMounted = true;
    this.fetchRooms();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.updateRooms();
    });
  }

  fetchRooms(){
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
        this.state.data[i] = data[i]
      }
    })
    .then(this.setState({isFetching: false}))
  }

  updateRooms(){
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
      for (var i = 0; i < Object.keys(this.state.data).length; i++) {
        this.state.numberOfDevices[i] = 0;
      }
      for (var i = 0; i < Object.keys(data).length; i++) {
        if (data[i].lights == 'Off') {
          for (var j = 0; j < Object.keys(this.state.data).length; j++) {
            if (this.state.data[j]._key == data[i].room) {
              this.state.data[j].lights = "Off";
              this.state.data[j].buttonColor = 'green';
            }
          }
        } else if (data[i].lights == "On") {
          for (var j = 0; j < Object.keys(this.state.data).length; j++) {
            if (this.state.data[j]._key == data[i].room) {
              this.state.numberOfDevices[j]++;
              if (this.state.numberOfDevices[j] == this.state.data[j].devices) {
                this.state.data[j].lights = "On";
                this.state.data[j].buttonColor = "red";
              }
            }
          }
        }
      }
      this.setState({isFetching: false})
    })
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  updateRoom(item, status, color){
    fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_r/room/" + item._key, {
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
    if (typeof index !== "undefined") {
      if (this.state.data[index].lights == "On") {
        this.state.data[index].lights = "Off";
        this.state.data[index].buttonColor = "green";
        this.updateRoom(this.state.data[index], "Off", "green")
      }
      else if (this.state.data[index].lights == "Off") {
        this.state.data[index].lights = "On";
        this.state.data[index].buttonColor = "red";
        this.updateRoom(this.state.data[index], "On", "red")
      }
    }
    this.setState({isFetching: false})
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity
         onPress={() => this.props.navigation.navigate("RoomScreenScreen", {title: item._key})}>
        <Text style={styles.title}>{item._key}  </Text><Text>{item.activity}  </Text>
        </TouchableOpacity>
        <Button
          title={"Lights " + this.state.data[index].lights}
          color={this.state.data[index].buttonColor}
          onPress={() => this.onRefresh(index)}
        />
      </View>
      );
  };

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
    alignItems: "flex-start",
    backgroundColor: "black"
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#708090',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 31,
  },
  title: {
    fontSize: 30,
    textShadowColor: "white",
    textShadowRadius: 8,
  },
});
