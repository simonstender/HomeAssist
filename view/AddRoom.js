import React, {Component} from 'react';
import {Platform, StyleSheet,} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right,View, Form, Item, Input, Label } from 'native-base';
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
      pos: 0,
      temp: (Math.floor(Math.random() * 10)+20).toString(),
    }
  }

  componentDidMount(){
    this._isMounted = true;
  }


  componentWillUnmount(){
    this._isMounted = false;
  }

addRoom(){
  if (this.state.name != "") {
    fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_r/room", {
  		method: "GET",
  		headers: {
  			'Accept': 'application/json',
  			'Content-Type': 'application/json',
  		},
  })
  	.then((response) => response.json())
  	.then((data) => {
      pos = Object.keys(data).length;
      fetch("http://192.168.0.181:8529/_db/HomeAssist/CRUD_r/room", {
        method: "POST",
        headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         _key: this.state.name,
         lights: "On",
         buttonColor: "red",
         allLights: "Hold",
         devices: 0,
         temperature: this.state.temp,
         position: pos
       })
      })
      .then((data) => {
        if (data.status == "201") {
          this.props.navigation.navigate("OverviewScreen")
        } else
        alert("Something went wrong when creating your room");
      })
  	})
  } else if (this.state.name == "") {
    alert("You have not entered a name!");
  }
}

render() {
	return (
		<Container>
				<Content padder>
					<Form>
						<Item floatingLabel>
							<Label>Room name</Label>
							<Input
              onChangeText={(name) => this.setState({ name })}
              />
						</Item>
						<Button
            onPress={() => this.addRoom()}
            >
							<Text>Add Room</Text>
						</Button>
					</Form>
				</Content>
		</Container>
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
