import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Alert, ImageBackground, Image} from 'react-native';
import {CheckBox, Icon, Button, List, ListItem, Right} from 'native-base';
import DeviceInfo from 'react-native-device-info';

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
      id: "Device id",
      pw: "Password",
      checked: false,
      rememberMe: false,
      deviceId: DeviceInfo.getUniqueId(),
      userFound: false
    }
  }

  componentDidMount(){
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_u/user/" + this.state.deviceId, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.rememberMe == true) {
          fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_b/login/", {
            method: "GET",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
          })
          .then((response) => response.json())
          .then((data) => {
            if (data.errorNum != 400) {
                if (this.props.navigation.getParam("logout") == true) {
                  this.setState({id: data[0]._key, pw: data[0].password, checked: true, userFound: true})
                } else {
                  this.props.navigation.navigate("WelcomeScreen");
                }
            }
          })
        }
      })
    });
  }

  componentWillUnmount(){
    this.focusListener.remove();
    this._isMounted = false;
  }

  checkLogin() {
    fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_b/login/" + this.state.id, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.errorNum == "404") {
        alert("No connection to the device.");
    } else if (this.state.pw == data.password) {
        this.props.navigation.navigate("WelcomeScreen", {rememberMe: this.state.rememberMe});
    } else {
        alert("Wrong id or password.");
      }
    })
  }

rememberMe(){
  if (this.state.checked == false) {
    fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_u/user/" + this.state.deviceId, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.errorNum == "404") {
        this.setState({checked: true, rememberMe: true})
      } else if (data.rememberMe == true) {
        this.setState({checked: true, userFound: false})
      } else if (data.rememberMe == false) {
        fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_u/user/" + this.state.deviceId, {
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
            this.setState({checked: true})
          }
        })
      }
    })
  } else {
    fetch("http://" + this.state.db.ip + "/_db/HomeAssist/CRUD_u/user/" + this.state.deviceId, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rememberMe: false
      })
    })
    .then(() => this.setState({checked: false}))
  }
}

  render() {
    if (this.state.checked == true && this.state.userFound == true) {
      return (
          <ImageBackground source={require("../images/loginBackground.jpg")} style={styles.container}>
            <Image source={require("../images/logo.png")} style={styles.image}></Image>
            <Text style={styles.text}>ELIAS</Text>
              <TextInput style={styles.inputBox}
                  onChangeText={(id) => this.setState({ id })}
                  onChange={() => this.setState({checked: false})}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.state.id}
                  placeholderTextColor = "#002f6c"
                  selectionColor="#fff"
                  />
              <TextInput style={styles.inputBox}
                  onChangeText={(pw) => this.setState({ pw })}
                  onChange={() => this.setState({checked: false})}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.state.pw}
                  secureTextEntry={true}
                  placeholderTextColor = "#002f6c"
                  />
                  <View style={styles.checkBox}>
    									<CheckBox onPress={() => this.rememberMe()} color="#002f6c" checked={this.state.checked}/>
                      <Text style={styles.checkBoxText}>Remember me</Text>
    							</View>
                  <Button onPress={() => this.checkLogin()} iconLeft style={{marginTop: 20, backgroundColor: 'green', width: 214}}>
                  <Icon name="log-in"/>
                  <Text style={{right: 30, color: "white"}}>Connect to device</Text></Button>
          </ImageBackground>
      );
    } else if (this.state.checked == true && this.state.userFound == false) {
      return (
          <ImageBackground source={require("../images/loginBackground.jpg")} style={styles.container}>
            <Image source={require("../images/logo.png")} style={styles.image}></Image>
            <Text style={styles.text}>ELIAS</Text>
              <TextInput style={styles.inputBox}
                  onChangeText={(id) => this.setState({ id })}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder="Device id"
                  placeholderTextColor = "#002f6c"
                  selectionColor="#fff"
                  />
              <TextInput style={styles.inputBox}
                  onChangeText={(pw) => this.setState({ pw })}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor = "#002f6c"
                  />
                  <View style={styles.checkBox}>
    									<CheckBox onPress={() => this.rememberMe()} color="#002f6c" checked={this.state.checked}/>
                      <Text style={styles.checkBoxText}>Remember me</Text>
    							</View>
                  <Button onPress={() => this.checkLogin()} iconLeft style={{marginTop: 20, backgroundColor: 'green', width: 214}}>
                  <Icon name="log-in"/>
                  <Text style={{right: 30, color: "white"}}>Connect to device</Text></Button>
          </ImageBackground>
      );
    } else if (this.state.checked == false) {
      return (
          <ImageBackground source={require("../images/loginBackground.jpg")} style={styles.container}>
            <Image source={require("../images/logo.png")} style={styles.image}></Image>
            <Text style={styles.text}>ELIAS</Text>
              <TextInput style={styles.inputBox}
                  onChangeText={(id) => this.setState({ id })}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder="Device id"
                  placeholderTextColor = "#002f6c"
                  selectionColor="#fff"
                  />
              <TextInput style={styles.inputBox}
                  onChangeText={(pw) => this.setState({ pw })}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor = "#002f6c"
                  />
                  <View style={styles.checkBox}>
    									<CheckBox onPress={() => this.rememberMe()} color="#002f6c" checked={this.state.checked}/>
                      <Text style={styles.checkBoxText}>Remember me</Text>
    							</View>
                  <Button onPress={() => this.checkLogin()} iconLeft style={{marginTop: 20, backgroundColor: 'green', width: 214}}>
                  <Icon name="log-in"/>
                  <Text style={{right: 30, color: "white"}}>Connect to device</Text></Button>
          </ImageBackground>
      );
    }
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
        fontSize: 40,
        color: "white",
        fontStyle: "italic",
        fontWeight: "500",
        textDecorationLine: "underline",
        textShadowColor: "green",
        textShadowRadius: 8,
        bottom: 50
    },
    inputBox: {
        width: 300,
        backgroundColor: '#eeeeee',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10,
        padding: 10,
    },
    image: {
        bottom: 75,
        height: 75,
        width: 75
    },
    checkBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#eeeeee",
      height: 25,
      width: 150,
      borderRadius: 25
    },
    checkBoxText: {
      left: 10,
      color: "#002f6c",
      fontSize: 14,
      paddingLeft: 10
    }

});
