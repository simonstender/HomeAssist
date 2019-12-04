import React, {Component} from 'react';
import {Platform, StyleSheet, Alert, ImageBackground, TouchableOpacity, Image, FlatList} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right, View, Form, Item, Input, Label, Root } from 'native-base';
import Slider from 'react-native-slider';

import Notification from '../src/notifications.js';

export default class RoomScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: navigation.getParam("name"),
			headerLeft: <TouchableOpacity onPress={() => navigation.navigate("OverviewScreen")}>
			<Icon style={{ height: 30, width: 64, left: 20 }} name="arrow-back"/>
			</TouchableOpacity>,
			headerRight: navigation.state.params && navigation.state.params.headerRight
		};
};
constructor(props){
	super(props);
	this._isMounted = false;
	this.state = {
		isFetching: false,
		numberOfDevices: 0,
		tempData: [],
		allData: [],
		data: [],
		topPos: 0,
		roomName: this.props.navigation.getParam("name"),
		db: require("../dbIp.json"),
		sliderValue: []
	}
	this.notif = new Notification(this.onNotif.bind(this));
}

componentDidMount(){
	this._isMounted = true;
	this.props.navigation.setParams({
		headerRight: <TouchableOpacity onPress={() => this.props.navigation.navigate("AddDeviceScreen", {name: this.props.navigation.getParam("name"), pos: this.state.topPos, roomKey: this.props.navigation.getParam("key")})}>
		<Icon style={{ height: 30, width: 64, left: 20, color: 'green' }} name="add"/>
		</TouchableOpacity>});
	this.focusListener = this.props.navigation.addListener('didFocus', () => {
		this.fetchDevices();
		});
}

fetchDevices(){
	this.setState({isFetching: true, data: [], tempData: [], allData: [], numberOfDevices: 0, topPos: 0})
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
			this.state.allData[i] = data[i];
			if (this.state.roomName == data[i].room) {
				this.state.tempData[this.state.numberOfDevices++] = data[i]
			}
		}
		this.insertion_Sort(this.state.tempData);
		this.insertion_Sort(this.state.allData);
		for (var i = 0; i < Object.keys(this.state.tempData).length; i++) {
			this.state.data[i] = this.state.tempData[i]
		}
		if (Object.keys(data).length >= 1) {
			this.state.topPos = this.state.allData[Object.keys(data).length - 1]._key
		}
	})
	.then(() => {this.updateDevices();})
}

insertion_Sort(data){
	for (var i = 1; i < data.length; i++){
		if (data[i]._key < data[0]._key){
			data.unshift(data.splice(i,1)[0]);
		}
		else if (data[i]._key > data[i-1]._key){
			continue;
		}
		else {
			for (var j = 1; j < i; j++){
				if (data[i]._key > data[j-1]._key && data[i]._key < data[j]._key){
					data.splice(j,0,data.splice(i,1)[0]);
				}
			}
		}
	}
}

componentWillUnmount(){
	this.focusListener.remove();
	this._isMounted = false;
}

updateDevices(){
		fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room/" + this.props.navigation.getParam("key"), {
			method: "PATCH",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				allLights: "Hold"
			})
		})
	.then(() => {this.setState({isFetching: false})})
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
	.then(() => this.notif.sendNotif())
}

updateSlider(value, key){
	fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device/" + key, {
		method: "PATCH",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sliderValue: value
		})
	})
}

onNotif(notif) {
	Alert.alert(notif.title, notif.message);
}

renderItem = ({ item, index }) => {
	if (this.state.data[index].isLight == true) {
		var BUTTONS = [
			{ text: "Edit name", icon: "create", iconColor: "#2c8ef4" },
			{ text: "Light bulb",icon:"md-bulb", iconColor: "#c2bc04" },
			{ text: "Delete", icon: "trash", iconColor: "#fa213b" },
			{ text: "Close", icon: "close", iconColor: "#25de5b" }
		];
		var DESTRUCTIVE_INDEX = 2;
		var CANCEL_INDEX = 3;

		return (
		<Content padder>
			<Card>
				<CardItem>
					<Left>
						<Thumbnail source={require("../images/plug.png")} />
							<Body>
								<Text>{item.name}</Text>
							</Body>
					</Left>
						<Right>
							<Text>
								<Slider style={{alignSelf: "center", width: 120, height: 40}} minimumValue={0} maximumValue={10} value={this.state.data[index].sliderValue} onSlidingComplete={(value) => this.updateSlider(value, this.state.data[index]._key)} minimumTrackTintColor="#FFFFFF" maximumTrackTintColor="#000000"></Slider>
							</Text>
						</Right>
				</CardItem>
					<CardItem style={{backgroundColor: '#EFEFF0'}}>
						<Button style={{backgroundColor: this.state.data[index].buttonColor, height: 40, width: 40, left: -2}} rounded iconLeft onPress={() => this.onRefresh(index)}>
							<Icon style={{left: 8}} name='power' />
							<Text></Text>
						</Button>
							<Body>
								<Right>
									<Root>
										<Button style={{position: "absolute", left: "40%"}} transparent iconRight onPress={() => ActionSheet.show({
											options: BUTTONS,
											cancelButtonIndex: CANCEL_INDEX,
											destructiveButtonIndex: DESTRUCTIVE_INDEX,
											title: "Device Settings"},
											buttonIndex => {
												if (buttonIndex == 0) {
													this.props.navigation.navigate("EditNameScreen", {object: "CRUD_d/device", key: this.state.data[index]._key, returnScreen: "RoomScreenScreen"})
												}
												if (buttonIndex == 1) {
													var reply = (this.state.data[index].remainingLight).toString() + " hours of estimated time remaining."
													alert(reply);
												}
												if (buttonIndex == 2) {
													Alert.alert(
															'Are you sure?',
															"",
															[
																{
																	text: 'Yes',
																	onPress: () => this.deleteDevice(item._key),
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
											<Icon name='cog'/>
										</Button>
									</Root>
								</Right>
							</Body>
					</CardItem>
				</Card>
			</Content>
		);
	}
	else if (this.state.data[index].isLight == false) {
		var BUTTONS = [
			{ text: "Edit name", icon: "create", iconColor: "#2c8ef4" },
			{ text: "Delete", icon: "trash", iconColor: "#fa213b" },
			{ text: "Close", icon: "close", iconColor: "#25de5b" }
		];
		var DESTRUCTIVE_INDEX = 1;
		var CANCEL_INDEX = 2;

		return (
			<Content padder>
				<Card>
					<CardItem>
						<Left>
							<Thumbnail source={require("../images/plug.png")} />
								<Body>
									<Text>{item.name}</Text>
								</Body>
						</Left>
							<Right>
								<Text></Text>
							</Right>
					</CardItem>
						<CardItem style={{backgroundColor: '#EFEFF0'}}>
							<Button style={{backgroundColor: this.state.data[index].buttonColor, height: 40, width: 40, left: -2}} rounded iconLeft onPress={() => this.onRefresh(index)}>
								<Icon style={{left: 8}} name='power' />
								<Text></Text>
							</Button>
								<Body>
									<Right>
										<Root>
											<Button style={{position: "absolute", left: "40%"}} transparent iconRight onPress={() => ActionSheet.show({
												options: BUTTONS,
												cancelButtonIndex: CANCEL_INDEX,
												destructiveButtonIndex: DESTRUCTIVE_INDEX,
												title: "Device Settings"},
												buttonIndex => {
													if (buttonIndex == 0) {
														this.props.navigation.navigate("EditNameScreen", {object: "CRUD_d/device", key: this.state.data[index]._key, returnScreen: "RoomScreenScreen"})
													}
													if (buttonIndex == 1) {
														Alert.alert(
																'Are you sure?',
																"",
																[
																	{
																		text: 'Yes',
																		onPress: () => this.deleteDevice(item._key),
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
												<Icon name='cog'/>
											</Button>
										</Root>
									</Right>
								</Body>
						</CardItem>
					</Card>
				</Content>
		);
	}
};

onRefresh = (index) => {
	this.setState({isFetching: true})
	if (typeof index !== "undefined") {
		if (this.state.data[index].lights == "On") {
			this.state.data[index].lights = "Off";
			this.state.data[index].buttonColor = "red";
			this.updateDevice(this.state.data[index], "Off", "red")
		}
		else if (this.state.data[index].lights == "Off") {
			this.state.data[index].lights = "On";
			this.state.data[index].buttonColor = "green";
			this.updateDevice(this.state.data[index], "On", "green")
		}
	}
	this.setState({isFetching: false})
}

deleteDevice(key){
	fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device/" + key, {
		method: "DELETE",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	})
	.then((data) => {
		if (data.status == "204") {
			fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room/" + this.props.navigation.getParam("key"), {
				method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
		})
			.then((response) => response.json())
			.then((data) => {
				fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_r/room/" + this.props.navigation.getParam("key"), {
					method: "PATCH",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						devices: data.devices - 1
					})
				})
				.then((data) => {
					if (data.status == "200") {
						this.fetchDevices();
					} else {
						alert("Something went wrong when deleting your device in the room");
					}
				})
			})
		} else {
			alert("Something went wrong when deleting devices in the room");
		}
	})
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
