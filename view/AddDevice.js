import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right,View, Form, Item, Input, Label, List, ListItem, CheckBox } from 'native-base';
import Slider from 'react-native-slider';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

var radio_props = [
	{label: 'Lamp Connected', value: 1 },
	{label: 'No Lamp', value: 0 }
];

export default class AddRoom extends Component {
static navigationOptions = ({ navigation }) => {
	return {
		title: "Add Device",
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
		itemSelected: 'false'
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
    fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_d/device", {
      method: "POST",
      headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       _key: (this.state.pos).toString(),
       name: this.state.name,
       isLight: true,
       remainingLight: 0,
       lights: "On",
       buttonColor: "red",
       room: this.props.navigation.getParam("name")
     })
    })
    .then((data) => {
      if (data.status == "201") {
        fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_r/room/" + this.props.navigation.getParam("roomKey"), {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
      })
        .then((response) => response.json())
        .then((data) => {
          fetch("http://80.78.219.10:8529/_db/HomeAssist/CRUD_r/room/" + this.props.navigation.getParam("roomKey"), {
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
								<CheckBox onPress={() => this.setState({ itemSelected: 'true' })} checked={this.state.itemSelected == 'true'}/>
								<Text style={{left: 10 }}>Lamp</Text>
							</ListItem>
							<ListItem>
								<CheckBox onPress={() => this.setState({ itemSelected: 'false' })} checked={this.state.itemSelected == 'false'}/>
								<Text style={{left: 10 }}>Other</Text>
							</ListItem>
						</List>
						<Button style={[(this.state.itemSelected == true) ? styles.buttonEnabled : styles.buttonDisabled]} onPress={() => this.addDevice()}>
							<Icon name="add"/>
							<Text style={{left: -195 }}>Catagory Options</Text>
						</Button>
						<Button style={{marginTop: 2 }} onPress={() => this.addDevice()}>
							<Icon name="add"/>
							<Text style={{left: -255 }}>Add Room</Text>
						</Button>
						<Button style={{marginTop: 2 }} onPress={() => this.props.navigation.navigate("RoomScreenScreen")}>
							<Icon name="close"/>
							<Text style={{left: -273 }}>Cancel</Text>
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
	buttonDisabled: {
		fontSize: 24,
		textShadowColor: "white",
		textShadowRadius: 8,
		alignSelf: "center"
	},
	buttonEnabled: {
		fontSize: 24,
		textShadowColor: "white",
		textShadowRadius: 8,
		alignSelf: "center"
	},
});

//						<RadioForm radio_props={radio_props} initial={4} onPress={(value) => {
//							if (this.state.value)) {
//								this.setState({value:value})
//							}
//							else {
//								this.setState({value:value})
//							}
//						}}/>
