import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Button, Alert, ImageBackground} from 'react-native';
//import {Container, Header, Content, Card, CardItem, Thumbnail, ActionSheet, Text, Button, Icon, Left, Body, Right,View, Form, Item, Input, Label } from 'native-base';

export default class Login extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      db: require("../dbIp.json"),
      id: "",
      pw: ""
    }
  }

  componentDidMount(){
    this._isMounted = true;
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  identifyDevice() {
    fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_b/login/" + this.state.id, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.errorNum === "404") {
        alert("No connection to the device.");
    } else if (this.state.pw === data.password) {
        this.props.navigation.navigate("WelcomeScreen");
    } else {
        alert("Wrong id or password.");
      }
    })
  }

  render() {
    return (
      <ImageBackground source={require("../images/loginBackground.jpg")} style={styles.container}>
        <Text style={styles.text}>ELIAS</Text>
          <View style={styles.button}>
            <TextInput style={styles.inputBox}
                onChangeText={(id) => this.setState({ id })}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Device id"
                placeholderTextColor = "#002f6c"
                selectionColor="#fff"/>
            <TextInput style={styles.inputBox}
                onChangeText={(pw) => this.setState({ pw })}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor = "#002f6c"/>
            <Button
              title="Connect to your home"
              color="green"
              style={styles.button}
              onPress={() => this.identifyDevice()}>
            </Button>
          </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        opacity: 50,
    },
    text: {
        fontSize: 70,
        color: "white",
        fontStyle: "italic",
        fontWeight: "500",
        textDecorationLine: "underline",
        textShadowColor: "green",
        textShadowRadius: 8,
        bottom: 150
    },
    button: {
        position: "absolute",
        bottom: 300
    },
    inputBox: {
        width: 300,
        backgroundColor: '#eeeeee',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10,
        bottom: 50
    }
});
