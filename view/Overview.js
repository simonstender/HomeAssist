import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity, Image, FlatList, AsyncStorage} from 'react-native';

export default class Overview extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Overview"),
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
      data: require("../db/Rooms.json")
    }
  }

  componentDidMount(){
    this._isMounted = true;
  }

  componentWillReceiveProps(devices){
    var found = false;
    for (var i = 0; i < Object.keys(devices.roomData).length; i++) {
      if (devices.roomData[i].buttonColor == 'green') {
        for (var j = 0; j < Object.keys(this.state.data).length; j++) {
          if (this.state.data[j].title == devices.roomData[i].room) {
            this.state.data[j].buttonColor = 'green';
            this.state.data[j].lights = "Off"
            found = true;
          }
        }
      }
      else if (devices.roomData[i].buttonColor == 'red' && found == false) {
        for (var j = 0; j < Object.keys(this.state.data).length; j++) {
          if (this.state.data[j].title == devices.roomData[i].room) {
            this.state.data[j].buttonColor = 'red';
            this.state.data[j].lights = "On"
          }
        }
      }
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  onRefresh = (index) => {
    this.setState({isFetching: true})
    if (typeof index !== "undefined") {
      if (this.state.data[index].lights == "On") {
        this.state.data[index].lights = "Off";
        this.state.data[index].buttonColor = "green";
      }
      else if (this.state.data[index].lights == "Off") {
        this.state.data[index].lights = "On";
        this.state.data[index].buttonColor = "red";
      }
    }
    this.setState({isFetching: false})
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}  </Text><Text>{item.activity}  </Text>
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
          keyExtractor={item => item.room}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
        />
        <Button
        title="Blick"
        onPress={() => alert(JSON.stringify(this.state.data))}
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
