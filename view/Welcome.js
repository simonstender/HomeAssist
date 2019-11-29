import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Left, Body, Right, View, Form, Item, Input, Label, Root, ListItem, CheckBox, List} from 'native-base';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {Icon} from 'native-base';
import Notification from '../src/notifications.js';

export default class Welcome extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };

constructor(props){
  super(props);
  this._isMounted = false;
  this.state = {
    name: "",
    db: require("../dbIp.json"),
    rememberMe: this.props.navigation.getParam("rememberMe")
  }

  this.notif = new Notification(this.onNotif.bind(this));
}

componentDidMount(){
  this._isMounted = true;
  this.identifyUser(DeviceInfo.getUniqueId());
  this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.identifyUser(DeviceInfo.getUniqueId());
      this.notif.sendNotif();
  });
}

componentWillUnmount(){
  this._isMounted = false;
}

onSwipeLeft() {
	this.props.navigation.navigate("OverviewScreen")
}

identifyUser(id){
  fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_u/user/" + id, {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.errorNum == "404") {
      this.props.navigation.navigate("AddUserScreen", {id: id, rememberMe: this.state.rememberMe});
    } else {
      this.setState({name: data.name})
    }
  })
}

 onNotif(notif) {
   Alert.alert(notif.title, notif.message);
 }

render() {
	const config = {
		velocityThreshold: 0.3,
		directionalOffsetThreshold: 80
	};
	return (
		<GestureRecognizer
		onSwipeLeft={() => this.onSwipeLeft()}
		config={config}
		style={styles.container}>
		<Icon style={styles.icon} name= "ios-log-out"/>
		<Text style={styles.title}>Welcome {this.state.name}</Text>
		<Content padder>
			<Card>
				<CardItem>
					<Thumbnail source={require("../images/energy.png")} />
						<Body>
							<Text style={{left: 8, top: 12}}>Energy Consumption:</Text>
						</Body>
						<Right>
							<Icon style={{color: 'blue', fontSize: 24, position: "absolute", right: "10%", top: "-20%" }}
							name='information-circle-outline'
							onPress={() => Alert.alert("Information", "An overview of the electricity consumption.")}/>
						</Right>
				</CardItem>
					<CardItem style={{backgroundColor: '#EFEFF0'}}>
					<List>
						<ListItem style={{position: "relative", right: "40%"}}>
							<Text style={styles.text}>CALCULATION ITEM</Text>
						</ListItem>
						<ListItem style={{position: "relative", right: "40%" }}>
							<Text style={styles.text}>CALCULATION ITEM</Text>
						</ListItem>
					</List>
					</CardItem>
				</Card>
				<Card>
					<CardItem>
						<Thumbnail source={require("../images/bulb.png")} />
							<Body>
								<Text style={{left: 8, top: 12}}>Light observation:</Text>
							</Body>
							<Right>
								<Icon style={{color: 'blue', fontSize: 24, position: "absolute", right: "10%", top: "-20%"}}
								name='information-circle-outline'
								onPress={() => Alert.alert("Information", "An indication of the light bulb's remaining service life")}/>
							</Right>
					</CardItem>
						<CardItem style={{backgroundColor: '#EFEFF0'}}>
						<List>
							<ListItem style={{position: "relative", right: "40%"}}>
								<Text style={styles.text}>LAMP DEVICE ITEM</Text>
							</ListItem>
							<ListItem style={{position: "relative", right: "40%"}}>
								<Text style={styles.text}>LAMP DEVICE ITEM</Text>
							</ListItem>
						</List>
						</CardItem>
					</Card>
			</Content>
		<Image style={styles.swipeFinger} source={require('../images/swipeFinger.png')}/>
		<Text style={styles.swipeText}>Swipe to continue</Text>
		</GestureRecognizer>
	);
 }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white"
	},
	icon: {
		marginTop:14,
		fontSize: 38,
		position:"absolute",
		left: "88%",
		color: "#f55858"
	},
	text: {
		fontSize: 14,
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
		flexDirection: "column",
		justifyContent: "space-between",
		backgroundColor: '#696969',
		padding: 8,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		marginTop:20,
		fontSize: 20,
		textShadowColor: "#EFEFF0",
		textShadowRadius: 8,
		alignSelf: "center"
	},
});
