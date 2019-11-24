import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right,View, Form, Item, Input, Label, List, ListItem, CheckBox } from 'native-base';
import Slider from 'react-native-slider';

var BUTTONS = [
{ text: "Philips Glödlampa Standard 25W E27 230V P45", icon: "md-bulb", iconColor: "#c2bc04" },
{ text: "Glödlampa normal 220lm E27 25W", icon: "md-bulb", iconColor: "#c2bc04" },
{ text: "Philips CorePro LEDbulb E27 A60 8W 827 Matt", icon: "md-bulb", iconColor: "#c2bc04" },
{ text: "Close", icon: "close", iconColor: "red" }
];

var DESTRUCTIVE_INDEX = 11;
var CANCEL_INDEX = 12;

export default class AddRoom extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Add Device",
      headerLayoutPreset: "center",
      headerLeft: <TouchableOpacity onPress={() => navigation.navigate("RoomScreenScreen")}>
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

addDevice(){
  if (this.state.name != "") {
    fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device", {
      method: "POST",
      headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       _key: (this.state.pos).toString(),
       name: this.state.name,
       isLight: this.state.itemSelected,
       remainingLight: 0,
       lights: "On",
       buttonColor: "red",
       room: this.props.navigation.getParam("name")
     })
    })
    .then((data) => {
      if (data.status == "201") {
        fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room/" + this.props.navigation.getParam("roomKey"), {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
      })
        .then((response) => response.json())
        .then((data) => {
          fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room/" + this.props.navigation.getParam("roomKey"), {
        		method: "PATCH",
        		headers: {
        			'Accept': 'application/json',
        			'Content-Type': 'application/json',
        		},
        		body: JSON.stringify({
        			devices: data.devices + 1
        		})
        	})
          .then((data) => {
            if (data.status == "200") {
              this.props.navigation.navigate("RoomScreenScreen")
            } else {
              alert("Something went wrong when creating your device");
            }
          })
        })
      } else
      alert("Something went wrong when creating your device");
    })
  } else if (this.state.name == "") {
    alert("You have not entered a name!");
  }
}


render() {
	let button =
  <Button disabled style={{marginTop: 25, justifyContent: "center" }} onPress={() => ActionSheet.show({
			options: BUTTONS,
			cancelButtonIndex: CANCEL_INDEX,
			title: "Light Bubls Range "
		},
			buttonIndex => {
			this.setState({ clicked: BUTTONS[buttonIndex] });
		}
	)}>
  <Icon name="close" style={{position: "absolute", right: "86%"}}/>
  <Text>Category Options</Text></Button>

	if (this.state.itemSelected == 'true') {
		button =
    <Button style={{marginTop: 25, justifyContent: "center" }} onPress={() => ActionSheet.show({
				options: BUTTONS,
				cancelButtonIndex: CANCEL_INDEX,
				title: "Light Bubls Range "
			},
				buttonIndex => {
				this.setState({ clicked: BUTTONS[buttonIndex] });
				}
			)}>
      <Icon name="open" style={{position: "absolute", right: "86%"}}/>
      <Text>Category Options</Text></Button>
	}
		return (
			<Container>
					<Content padder>
						<Form>
							<Item floatingLabel>
								<Label>Device name</Label>
								<Input onChangeText={(name) => this.setState({ name })}/>
							</Item>
							<Text style={{left: 15, marginTop: 40  }}>Device Category</Text>
							<List>
								<ListItem>
									<CheckBox onPress={() => (this.setState({itemSelected: 'true' }))} checked={this.state.itemSelected == 'true'}/>
									<Text style={{left: 10 }}>Lamp Category</Text>
								</ListItem>
								<ListItem>
									<CheckBox onPress={() => (this.setState({itemSelected: 'false' }))} checked={this.state.itemSelected == 'false'}/>
									<Text style={{left: 10 }}>Other Category</Text>
								</ListItem>
							</List>
							{button}
							<Button style={{marginTop: 2, backgroundColor: 'green', justifyContent: "center" }} onPress={() => this.addDevice()}>
								<Icon name="add" style={{position: "absolute", right: "86%"}}/>
								<Text>Add Device</Text>
							</Button>
							<Button style={{marginTop: 2, backgroundColor: '#f55858', justifyContent: "center" }} onPress={() => this.props.navigation.navigate("RoomScreenScreen")}>
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
