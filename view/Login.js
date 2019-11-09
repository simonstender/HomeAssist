import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, ImageBackground, TouchableOpacity} from 'react-native';

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

    }
  }

  componentDidMount(){
    this._isMounted = true;
    this.props.navigation.navigate("BedroomScreen");
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render() {
    return (
      <ImageBackground source={require("../images/loginBackground.jpg")} style={styles.container}>
        <Text style={styles.text}>Home Assist</Text>
          <View style={styles.button}>
            <Button
              title="Connect to your home"
              color="green"
              style={styles.button}
              onPress={() => this.props.navigation.navigate("OverviewScreen")}>
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
    fontSize: 50,
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
    bottom: 160
  }
});
