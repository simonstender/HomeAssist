import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right,View, Form, Item, Input, Label } from 'native-base';
import Slider from 'react-native-slider';

export default class AddRoom extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Add Room",
      headerLayoutPreset: "center",
      headerLeft: <TouchableOpacity onPress={() => navigation.navigate("OverviewScreen")}>
  			<Icon style={{ height: 30, width: 64, left: 20 }} name="arrow-back"/>
  			</TouchableOpacity>,
      headerRight: null
    };
  };

  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      name: "",
      pos: parseInt(this.props.navigation.getParam("pos")) + 1,
      db: require("../dbIp.json")
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
		fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room", {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then((response) => response.json())
		.then((data) => {
			fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					_key: (this.state.pos).toString(),
					name: this.state.name,
					lights: "Off",
					buttonColor: "red",
					allLights: "Hold",
					devices: 0,
					temperature: (Math.floor(Math.random() * 10)+20).toString()
				})
			})
			.then((data) => {
				if (data.status == "201") {
					this.props.navigation.navigate("OverviewScreen")
				}
				else
				alert("Something went wrong when creating your room");
			})
		})
	}
	else if (this.state.name == "") {
		alert("You have not entered a name!");
	}
}

render() {
	return (
		<Container>
			<Content padder>
				<Form>
					<Text style={{marginTop: 30, left: 13, fontSize: 24}}>Enter room name</Text>
					<Item floatingLabel>
						<Label>Room name</Label>
						<Input onChangeText={(name) => this.setState({ name })}/>
					</Item>
					<Button style={{marginTop: 30, backgroundColor: 'green', justifyContent: "center" }} onPress={() => this.addRoom()}>
						<Icon name="add" style={{position: "absolute", right: "86%"}}/>
						<Text style={{}}>Add Room</Text>
					</Button>
					<Button style={{marginTop: 2, backgroundColor: '#f55858', justifyContent: "center"}} onPress={() => this.props.navigation.navigate("OverviewScreen")}>
						<Icon name="close" style={{position: "absolute", right: "86%"}}/>
						<Text>Cancel</Text>
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
