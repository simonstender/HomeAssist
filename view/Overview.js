import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity, Image, FlatList} from 'react-native';

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
      bajs: "bajs",
      data: [{room: "0", title: "Hallway", lights: "On", buttonColor: "red"},
      {room: "1", title: "Livingroom", lights: "On", buttonColor: "red"},
      {room: "2", title: "Bathroom", lights: "On", buttonColor: "red"},
      {room: "3", title: "Kitchen", lights: "On", buttonColor: "red"},
      {room: "4", title: "Bedroom", lights: "On", buttonColor: "red"}]
    }
  }

  componentDidMount(){
    this._isMounted = true;
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

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
