import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator, FlatList} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Left, Body, Right, View, Form, Item, Input, Label, Root, ListItem, CheckBox, List, Icon} from 'native-base';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

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
    rememberMe: this.props.navigation.getParam("rememberMe"),
    totalEnergyConsumption: 0,
    totalActiveDevices: 0,
    isFetching: false,
    lowRemainingLightData: [{name: "No light bulb needs to be changed", room: ""}],
    doneLoading: false,
  }
  this.notif = new Notification(this.onNotif.bind(this));
}

componentDidMount(){
  this._isMounted = true;
  this.identifyUser(DeviceInfo.getUniqueId());
  this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.energyConsumptionAndLightBulb();
      this.identifyUser(DeviceInfo.getUniqueId());
  });
}

componentWillUnmount(){
	this.focusListener.remove();
  this._isMounted = false;
}

energyConsumptionAndLightBulb(){
  fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device", {
		method: "GET",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})
  .then((response) => response.json())
  .then((data) => {
    var numberOfDevices = 0;
    var activeDevices = 0;
    this.state.totalEnergyConsumption = 0;
    for (var i = 0; i < Object.keys(data).length; i++) {
      if (data[i].lights == "On") {
          this.state.totalEnergyConsumption = this.state.totalEnergyConsumption + data[i].powerUsage;
          activeDevices++;
      }
      if (data[i].remainingLight > 0) {
        this.state.lowRemainingLightData[numberOfDevices++] = data[i];
      }
    }
    this.state.totalActiveDevices = activeDevices;
    this.insertion_Sort(this.state.lowRemainingLightData)
    this.state.doneLoading = true;
    this.forceUpdate();
  })
}

insertion_Sort(data)
{
  for (var i = 1; i < data.length; i++)
  {
    if (data[i].remainingLight < data[0].remainingLight)
    {
      data.unshift(data.splice(i,1)[0]);
    }
    else if (data[i].remainingLight > data[i-1].remainingLight)
    {
      continue;
    }
    else {
      for (var j = 1; j < i; j++) {
        if (data[i].remainingLight > data[j-1].remainingLight && data[i].remainingLight < data[j].remainingLight)
        {
          data.splice(j,0,data.splice(i,1)[0]);
        }
      }
    }
  }
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

 onRefresh = (index) => {
   this.setState({isFetching: true})
 	if (typeof index !== "undefined") {
 	}
 	this.setState({isFetching: false})
 }

 renderItem = ({ item, index }) => {
    return(
      <ListItem style={{position: "relative", right: "20%"}}>
        <Text style={styles.text}>Device:{item.name} in room: {item.room}</Text>
      </ListItem>
    );
 }

render() {
	const config = {
		velocityThreshold: 0.3,
		directionalOffsetThreshold: 80
	};
	if (this.state.doneLoading == false) {
    return (
  		<GestureRecognizer
  		onSwipeLeft={() => this.onSwipeLeft()}
  		config={config}
  		style={styles.container}>
  		<Icon onPress={() => this.props.navigation.navigate("LoginScreen", {logout: true})} style={styles.icon} name= "ios-log-out"/>
  		<Text style={styles.title}>Welcome {this.state.name}</Text>
  		<Content padder>
  			<Card>
  				<CardItem>
  					<Thumbnail source={require("../images/energy.png")} />
  						<Body>
  							<Text style={{left: 8, top: 12}}>Monthly Energy Consumption</Text>
  						</Body>
  						<Right>
  							<Icon style={{color: 'blue', fontSize: 24, position: "absolute", right: "10%", top: "-20%" }}
  							name='information-circle-outline'
  							onPress={() => Alert.alert("Information", "An overview of the energy consumption")}/>
  						</Right>
  				</CardItem>
  					<CardItem style={{backgroundColor: '#EFEFF0'}}>
  					<List>
  						<ListItem style={{right: "40%"}}>
  							<ActivityIndicator size="small" color="black" />
  						</ListItem>
  					</List>
  					</CardItem>
  				</Card>
  				<Card>
  					<CardItem>
  						<Thumbnail source={require("../images/bulb.png")} />
  							<Body>
  								<Text style={{left: 8, top: 12}}>Light Bulb Expectancy</Text>
  							</Body>
  							<Right>
  								<Icon style={{color: 'blue', fontSize: 24, position: "absolute", right: "10%", top: "-20%"}}
  								name='information-circle-outline'
  								onPress={() => Alert.alert("Information", "Light bulb which needs to be replaced soon")}/>
  							</Right>
  					</CardItem>
  						<CardItem style={{backgroundColor: '#EFEFF0'}}>
                <List>
    							<ListItem style={{position: "relative", right: "40%"}}>
    								<ActivityIndicator size="small" color="black" />
    							</ListItem>
    						</List>
  						</CardItem>
  					</Card>
  			</Content>
  		<Image style={styles.swipeFinger} source={require('../images/swipeFingerLeft.png')}/>
  		<Text style={styles.swipeText}>Swipe to continue</Text>
  		</GestureRecognizer>
  	);
  } else if (this.state.lowRemainingLightData[0].name == "No light bulb needs to be changed"){
    return (
  		<GestureRecognizer
  		onSwipeLeft={() => this.onSwipeLeft()}
  		config={config}
  		style={styles.container}>
  		<Icon onPress={() => this.props.navigation.navigate("LoginScreen", {logout: true})} style={styles.icon} name= "ios-log-out"/>
  		<Text style={styles.title}>Welcome {this.state.name}</Text>
  		<Content padder>
  			<Card>
  				<CardItem>
  					<Thumbnail source={require("../images/energy.png")} />
  						<Body>
  							<Text style={{left: 8, top: 12}}>Monthly Energy Consumption</Text>
  						</Body>
  						<Right>
  							<Icon style={{color: 'blue', fontSize: 24, position: "absolute", right: "10%", top: "-20%" }}
  							name='information-circle-outline'
  							onPress={() => Alert.alert("Information", "An overview of the energy consumption")}/>
  						</Right>
  				</CardItem>
  					<CardItem style={{backgroundColor: '#EFEFF0'}}>
  					<List>
  						<ListItem style={{right: "40%"}}>
  							<Text style={styles.text}>{this.state.totalEnergyConsumption} kWh ({this.state.totalActiveDevices} devices active)</Text>
  						</ListItem>
  					</List>
  					</CardItem>
  				</Card>
  				<Card>
  					<CardItem>
  						<Thumbnail source={require("../images/bulb.png")} />
  							<Body>
  								<Text style={{left: 8, top: 12}}>Light Bulb Expectancy</Text>
  							</Body>
  							<Right>
  								<Icon style={{color: 'blue', fontSize: 24, position: "absolute", right: "10%", top: "-20%"}}
  								name='information-circle-outline'
  								onPress={() => Alert.alert("Information", "Light bulb which needs to be replaced soon")}/>
  							</Right>
  					</CardItem>
  						<CardItem style={{backgroundColor: '#EFEFF0'}}>
                <List>
    							<ListItem style={{position: "relative", right: "40%"}}>
    								<Text style={styles.text}>{this.state.lowRemainingLightData[0].name}</Text>
    							</ListItem>
    						</List>
  						</CardItem>
  					</Card>
  			</Content>
  		<Image style={styles.swipeFinger} source={require('../images/swipeFingerLeft.png')}/>
  		<Text style={styles.swipeText}>Swipe to continue</Text>
  		</GestureRecognizer>
  	);
  } else {
    return (
  		<GestureRecognizer
  		onSwipeLeft={() => this.onSwipeLeft()}
  		config={config}
  		style={styles.container}>
  		<Icon onPress={() => this.props.navigation.navigate("LoginScreen", {logout: true})} style={styles.icon} name= "ios-log-out"/>
  		<Text style={styles.title}>Welcome {this.state.name}</Text>
  		<Content padder>
  			<Card>
  				<CardItem>
  					<Thumbnail source={require("../images/energy.png")} />
  						<Body>
  							<Text style={{left: 8, top: 12}}>Monthly Energy Consumption</Text>
  						</Body>
  						<Right>
  							<Icon style={{color: 'blue', fontSize: 24, position: "absolute", right: "10%", top: "-20%" }}
  							name='information-circle-outline'
  							onPress={() => Alert.alert("Information", "An overview of the energy consumption")}/>
  						</Right>
  				</CardItem>
  					<CardItem style={{backgroundColor: '#EFEFF0'}}>
  					<List>
  						<ListItem style={{right: "40%"}}>
  							<Text style={styles.text}>{this.state.totalEnergyConsumption} kWh ({this.state.totalActiveDevices} devices active)</Text>
  						</ListItem>
  					</List>
  					</CardItem>
  				</Card>
  				<Card>
  					<CardItem>
  						<Thumbnail source={require("../images/bulb.png")} />
  							<Body>
  								<Text style={{left: 8, top: 12}}>Light Bulb Expectancy</Text>
  							</Body>
  							<Right>
  								<Icon style={{color: 'blue', fontSize: 24, position: "absolute", right: "10%", top: "-20%"}}
  								name='information-circle-outline'
  								onPress={() => Alert.alert("Information", "Light bulb which needs to be replaced soon")}/>
  							</Right>
  					</CardItem>
  						<CardItem style={{backgroundColor: '#EFEFF0'}}>
                <List>
    							<ListItem style={{position: "relative", right: "40%"}}>
    								<Text style={styles.text}>{this.state.lowRemainingLightData[0].name}({this.state.lowRemainingLightData[0].room})</Text>
    							</ListItem>
    						</List>
  						</CardItem>
  					</Card>
  			</Content>
  		<Image style={styles.swipeFinger} source={require('../images/swipeFingerLeft.png')}/>
  		<Text style={styles.swipeText}>Swipe to continue</Text>
  		</GestureRecognizer>
  	);
  }
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
		fontSize: 16,
	},
	swipeFinger: {
		position: "absolute",
		bottom: "6.2%",
		alignSelf: "center",
		height: 40,
		width: 40
	},
	swipeText: {
		textAlign: "center",
		fontSize: 20,
    bottom: "5%"
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
