import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity, Image, FlatList, TextInput} from 'react-native';
import Slider from 'react-native-slider';

export default class AddRoom extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Add Room",
      headerLayoutPreset: "center",
      headerLeft: null,
      headerRight: null
    };
  };
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      name: "",
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
        <Text>Name of room</Text>
        <TextInput />
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
