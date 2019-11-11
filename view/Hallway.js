import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity, Image, FlatList} from 'react-native';
import Slider from 'react-native-slider';

import Overview from "../view/Overview"

export default class Hallway extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Hallway"),
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
      data: require("../db/Hallway.json")
    }
  }

  componentDidMount(){
    this._isMounted = true;
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

  componentWillUnmount(){
    this._isMounted = false;
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
    this.setState({isFetching: true});
    this.state.data[Object.keys(this.state.data).length] = {id: "2", name: "Small lamp", isLight: true, remainingLight: 200, lights: "On", buttonColor: "red", room: "Hallway"}
    this.setState({isFetching: false});
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

  onRefresh = (index) => {
    this.setState({isFetching: true})
    if (this.state.data[index].lights == "On") {
      this.state.data[index].lights = "Off";
      this.state.data[index].buttonColor = "green";
    }
    else if (this.state.data[index].lights == "Off") {
      this.state.data[index].lights = "On";
      this.state.data[index].buttonColor = "red";
    }
    this.setState({isFetching: false})
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
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
