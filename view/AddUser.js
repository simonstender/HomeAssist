import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right,View, Form, Item, Input, Label } from 'native-base';

export default class AddUser extends Component {
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
  }

  componentDidMount(){
    this._isMounted = true;
  }


  componentWillUnmount(){
    this._isMounted = false;
  }

addUser(){
  if (this.state.name != "") {
    fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_u/user", {
      method: "POST",
      headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       _key: this.props.navigation.getParam("id"),
       name: this.state.name,
       rememberMe: false
     })
    })
    .then((data) => {
      if (data.status == "201") {
        if (this.state.rememberMe == true) {
          fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_u/user/" + this.props.navigation.getParam("id"), {
        		method: "PATCH",
        		headers: {
        			'Accept': 'application/json',
        			'Content-Type': 'application/json',
        		},
        		body: JSON.stringify({
              rememberMe: true
        		})
        	})
          .then((data) => {
            if (data.status == "200") {
              this.props.navigation.navigate("WelcomeScreen")
            }
          })
        } else if (this.state.rememberMe == false) {
            this.props.navigation.navigate("WelcomeScreen")
          }
        } else if (data.status != "201") {
        alert("Something went wrong when adding you to the application");
      }
    })
  } else if (this.state.name == "") {
    alert("You have not entered a name!")
  }
}

render() {
	return (
		<Container>
				<Content padder>
					<Form>
						<Text style={{marginTop: 30, left: 13, fontSize: 24}}>Welcome, register your device!</Text>
						<Item floatingLabel>
							<Label>Your name</Label>
							<Input onChangeText={(name) => this.setState({ name })}/>
						</Item>
						<Button style={{marginTop: 30,backgroundColor: 'green', justifyContent: "center" }} onPress={() => this.addUser()}>
              <Icon name="add" style={{position: "absolute", right: "86%"}}/>
							<Text>Accept</Text>
						</Button>
						<Button style={{marginTop: 2,backgroundColor: '#f55858', justifyContent: "center" }} onPress={() => this.props.navigation.navigate("LoginScreen")}>
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
