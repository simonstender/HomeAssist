import React, {Component} from 'react';
import {Root} from 'native-base'
import {Platform, StyleSheet, Alert, ImageBackground, TouchableOpacity, Image, FlatList, AsyncStorage} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right,View } from 'native-base';

var BUTTONS = [
	{ text: "Edit Name", icon: "edit", iconColor: "#2c8ef4" },
	{ text: "Delete", icon: "trash", iconColor: "#fa213b" },
	{ text: "Close", icon: "close", iconColor: "#25de5b" }
];
var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 2;

export default class Overview extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: navigation.getParam("title", "Overview"),
			headerLeft: null,
			headerRight: navigation.state.params && navigation.state.params.headerRight
		};
};


constructor(props){
	super(props);
	this._isMounted = false;
	this.state = {
		isFetching: false,
		numberOfDevices: [],
		tempData: [],
		data: [],
		topPos: 0,
	}
}

componentDidMount(){
	this._isMounted = true;
	this.fetchRooms();
	this.props.navigation.setParams({
		headerRight: 	<TouchableOpacity onPress={() => this.props.navigation.navigate("AddRoomScreen", {pos: this.state.topPos})}>
			<Image style={{ height: 44, width: 44, right: 10 }} source={require("../images/greenPlus.png")}/>
			</TouchableOpacity>})
	this.focusListener = this.props.navigation.addListener('didFocus', () => {
		this.updateRooms();
	});
}

fetchRooms(){
	this.setState({isFetching: true, data: []})
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
			this.state.tempData[i] = data[i]
		}
		this.insertion_Sort(this.state.tempData);
		for (var i = 0; i < Object.keys(data).length; i++) {
			this.state.data[i] = this.state.tempData[i]
		}
		if (Object.keys(data).length >= 1) {
			this.state.topPos = this.state.tempData[Object.keys(data).length - 1]._key
		}
    this.setState({isFetching: false, tempData: []})
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

updateRooms(){
  this.fetchRooms();
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
	this.focusListener.remove();
}

updateRoom(item, status, color, allLights){
	fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_r/room/" + item._key, {
		method: "PATCH",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			lights: status,
			buttonColor: color,
			allLights: allLights
		})
	})
}

onRefresh = (index) => {
	this.setState({isFetching: true})
		if (typeof index !== "undefined") {
			if (this.state.data[index].lights == "On") {
				this.state.data[index].lights = "Off";
				this.state.data[index].buttonColor = "green";
				this.updateRoom(this.state.data[index], "Off", "green", "On")
			}
			else if (this.state.data[index].lights == "Off") {
				this.state.data[index].lights = "On";
				this.state.data[index].buttonColor = "red";
				this.updateRoom(this.state.data[index], "On", "red", "Off")
			}
		}
		this.setState({isFetching: false})
}

renderItem = ({ item, index }) => {
	var image;
		if (this.state.data[index].buttonColor == "green") {
			image = require("../images/greenLight.jpg");
		}
		else if (this.state.data[index].buttonColor == "red") {
			image = require("../images/redLight.jpg");
		}
return (
	<Content padder>
		<Card>
			<CardItem button
				onPress={() => this.props.navigation.navigate("RoomScreenScreen",{name: item.name})}>
				<Left>
					<Thumbnail source={require("../images/home.png")} />
						<Body>
							<Text>{item.name}</Text>
						</Body>
				</Left>
					<Right>
						<Text>Temperature: {item.temperature}°C</Text>
					</Right>
			</CardItem>
				<CardItem style={{backgroundColor: '#EFEFF0'}}>
					<Button style={{backgroundColor: this.state.data[index].buttonColor}} rounded iconLeft onPress={() => this.onRefresh(index)}>
						<Icon name='power' />
						<Text>{"Lights " + this.state.data[index].lights}</Text>
					</Button>
						<Body>
							<Right>
								<Root>
									<Button transparent iconRight onPress={() => ActionSheet.show({
										options: BUTTONS,
										cancelButtonIndex: CANCEL_INDEX,
										destructiveButtonIndex: DESTRUCTIVE_INDEX,
										title: "Room Settings"},
										buttonIndex => {
											if (buttonIndex == 1) {
												this.deleteRoom(item._key, item.name);
											}
										}
										)}>
										<Icon name='cog' />
										<Text>Settings</Text>
									</Button>
								</Root>
							</Right>
						</Body>
				</CardItem>
		</Card>
	</Content>
);
};

deleteRoom(key, name){
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
			if (data[i].room == name) {
				fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_d/device/" + data[i]._key, {
					method: "DELETE",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					}
				})
				.then((data) => {
					if (data.status != "204") {
						alert("Something went wrong when deleting devices in the room");
					}
				})
			}
		}
	})
	.then(
	fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_r/room/" + key, {
		method: "DELETE",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	})
	.then((data) => {
		if (data.status == "204") {
			this.fetchRooms();
		} else {
			alert("Something went wrong when deleting the room");
		}
	}))
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
		backgroundColor: "#efefef"
	},
	item: {

},
	title: {
		fontSize: 24,
		textShadowColor: "white",
		textShadowRadius: 8,
	}
});
