import React, {Component} from 'react';
import {Root} from 'native-base'
import {Platform, StyleSheet, Alert, ImageBackground, TouchableOpacity, Image, FlatList, AsyncStorage} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right,View } from 'native-base';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

var BUTTONS = [
	{ text: "Edit Name", icon: "create", iconColor: "#2c8ef4" },
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
		db: require("../dbIp.json")
	}
}

componentDidMount(){
	this._isMounted = true;
	this.props.navigation.setParams({
		headerRight: <TouchableOpacity onPress={() => this.props.navigation.navigate("AddRoomScreen", {pos: this.state.topPos})}>
			<Icon style={{ height: 30, width: 64, left: 20, color: 'green' }} name="add"/>
			</TouchableOpacity>})
	this.focusListener = this.props.navigation.addListener('didFocus', () => {
	  this.fetchRooms();
	});
}

fetchRooms(){
	this.setState({isFetching: true, data: []})
	fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room", {
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
	})
	.then(() => {this.updateRooms();})
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
	fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device", {
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
			if (data[i].lights === 'Off') {
				for (var j = 0; j < Object.keys(this.state.data).length; j++) {
					if (this.state.data[j].name == data[i].room) {
						this.state.data[j].lights = "Off";
						this.state.data[j].buttonColor = 'green';
						this.updateRoom(this.state.data[j], "Off", "green", "Hold")
					}
				}
			} else if (data[i].lights === "On") {
				for (var j = 0; j < Object.keys(this.state.data).length; j++) {
					if (this.state.data[j].name == data[i].room) {
						this.state.numberOfDevices[j]++;
					}
					if (this.state.data[j].devices == this.state.numberOfDevices[j] ) {
						this.state.data[j].lights = "On";
						this.state.data[j].buttonColor = "red";
						this.updateRoom(this.state.data[j], "On", "red", "Hold")
					}
				}
			}
		}
	})
	.then(() => {this.setState({isFetching: false, tempData: []})})
}

componentWillUnmount(){
	this._isMounted = false;
	this.focusListener.remove();
}

updateRoom(item, status, color, allLights){
	fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room/" + item._key, {
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
	.then((data) => {
		if (data.status == "200") {
			fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device", {
				method: "GET",
				headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				},
			})
			.then((response) => response.json())
			.then((data) => {
				for (var i = 0; i < Object.keys(data).length; i++) {
					if (data[i].room == item.name) {
						if (allLights == "On") {
							this.updateDevice(data[i], "Off", "green")
						} else if (allLights == "Off") {
					 		this.updateDevice(data[i], "On", "red");
						}
					}
				}
			})
		}
	})
}

updateDevice(item, status, color){
	fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device/" + item._key, {
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
return (
	<Content padder>
		<Card>
			<CardItem button
				onPress={() => this.props.navigation.navigate("RoomScreenScreen",{name: item.name, key: item._key})}>
				<Left>
					<Thumbnail source={require("../images/home.jpg")} />
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
									<Button style={{position: "absolute", left: "35%"}} transparent iconRight onPress={() => ActionSheet.show({
										options: BUTTONS,
										cancelButtonIndex: CANCEL_INDEX,
										destructiveButtonIndex: DESTRUCTIVE_INDEX,
										title: "Room Settings"},
										buttonIndex => {
											if (buttonIndex == 0) {
												this.props.navigation.navigate("EditNameScreen", {object: "CRUD_r/room", key: this.state.data[index]._key, returnScreen: "OverviewScreen", roomName: this.state.data[index].name})
											}
											if (buttonIndex == 1) {
												Alert.alert(
														'Are you sure?',
														"",
														[
															{
																text: 'Yes',
																onPress: () => this.deleteRoom(item._key, item.name),
															},
															{
																text: 'No',
															},
														],
														{cancelable: false},
													);
											}
										}
										)}>
										<Icon name='cog' />
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
	fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device", {
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
				fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device/" + data[i]._key, {
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
	fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room/" + key, {
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

onSwipeRight() {
	this.props.navigation.navigate("WelcomeScreen")
}

render() {
	const config = {
		velocityThreshold: 0.3,
		directionalOffsetThreshold: 80
	};
	return (
		<GestureRecognizer
		onSwipeRight={() => this.onSwipeRight()}
		config={config}
		style={styles.container}>
		<FlatList
			data={this.state.data}
			renderItem={this.renderItem}
			keyExtractor={item => item._key}
			onRefresh={() => this.onRefresh()}
			refreshing={this.state.isFetching}
		/>
		<Image style={styles.swipeFinger} source={require('../images/swipeFingerRight.png')}/>
		<Text style={styles.swipeText}>Swipe to continue</Text>
		</GestureRecognizer>
	);
}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "white"
	},
	swipeFinger: {
		position: "absolute",
		bottom: "1.2%",
		alignSelf: "center",
		height: 40,
		width: 40
	},
	swipeText: {
		textAlign: "center",
		fontSize: 20,
	},
	item: {

},
	title: {
		fontSize: 24,
		textShadowColor: "white",
		textShadowRadius: 8,
	}
});
