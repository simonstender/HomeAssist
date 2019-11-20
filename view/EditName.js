import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right,View, Form, Item, Input, Label } from 'native-base';
import Slider from 'react-native-slider';

export default class EditName extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Edit name",
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
      db: require("../dbIp.json"),
      object: this.props.navigation.getParam("object"),
      key: this.props.navigation.getParam("key"),
      returnScreen: this.props.navigation.getParam("returnScreen"),
      roomName: this.props.navigation.getParam("roomName")
    }
  }

  componentDidMount(){
    this._isMounted = true;
  }


  componentWillUnmount(){
    this._isMounted = false;
  }

editName(){
  if (this.state.name != "") {
    fetch("http://" + this.state.db.ip + "/_db/HomeAssist/" + this.state.object + "/" + this.state.key, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name
      })
    })
    .then((data) => {
      if (data.status == "200") {
        if (this.state.object == "CRUD_r/room") {
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
              if (data[i].room == this.state.roomName) {
                fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_d/device/" + data[i]._key, {
            			method: "PATCH",
            			headers: {
            				'Accept': 'application/json',
            				'Content-Type': 'application/json',
            			},
            			body: JSON.stringify({
            				room: this.state.name
            			})
            		})
                .then((data) => {
                  if (data.status != "200") {
                    alert("Something went wrong when changing name of the device room")
                  }
                })
              }
            }
          })
          .then(() => this.props.navigation.navigate(this.state.returnScreen))
        } else
        this.props.navigation.navigate(this.state.returnScreen)
      } else {
        alert("Something went wrong when editing the name");
      }
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
					<Text style={{marginTop: 30, left: 13, fontSize: 24}}>Enter name</Text>
					<Item floatingLabel>
						<Label>New name</Label>
						<Input onChangeText={(name) => this.setState({ name })}/>
					</Item>
					<Button style={{marginTop: 30, backgroundColor: 'green' }} onPress={() => this.editName()}>
						<Icon name="add"/>
						<Text style={{left: -263}} >Edit name</Text>
					</Button>
					<Button style={{marginTop: 2, backgroundColor: '#f55858'}} onPress={() => this.props.navigation.navigate(this.state.returnScreen)}>
						<Icon name="close"/>
						<Text style={{left: -280}}>Cancel</Text>
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
