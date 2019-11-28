import PushNotification from 'react-native-push-notification'

export default class Notification {
	constructor(onNotification) {
	this.configure(onNotification);
	this.state = {
	  db: require("../dbIp.json"),
	  data: []
	}
 }

	configure(onNotification) {
		PushNotification.configure({
		  onNotification: onNotification,
		  popInitialNotification: true,
		});
 }

	sendNotif() {
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
				if (data[i].lights == "On") {
					this.state.data[i] = data[i].name;
					this.localNotif(this.state.data[i]);
				}
			}
		})
	}

	localNotif(data) {
		PushNotification.localNotification({
		  title: "Device notification",
		  autoCancel: true,
		  largeIcon: "ic_launcher",
		  smallIcon: "ic_notification",
		  color: "red",
		  vibrate: true,
		  vibration: 300,
		  ongoing: false,
		  message: "Device(s) on in the " + data,
		  playSound: true,
		  soundName: 'default',
		  actions: '["Solve", "Ignore"]',
 	})
 }
}
