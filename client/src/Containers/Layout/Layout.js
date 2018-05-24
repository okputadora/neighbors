import React, { Component } from 'react';
import Login from '../Login/Login';
import ChatRoom from '../ChatRoom/ChatRoom';
import NavBar from '../../Components/Navigation/Navigation';
import api from '../../utils/apiRequests';
import { Route } from 'react-router'
import { Link } from 'react-router-dom';
import classes from './layout.css'
class Layout extends Component {
  state = {
    name: "Neigbors",
    authenticated: false,
    chatHistory: [],
    lat: 0,
    lng: 0,
    activeUser: 'mike'
  }

  componentWillMount(){
    api.getMessages()
    .then(response => {
      this.setState({
        chatHistory: response
      })
    })
  }

  login = (event) => {
    console.log(event.target.id)
    this.setState({
      authenticated: true
    })
  }

  showLocation = (position) => {

    console.log("in show location")
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    this.setState({
      lat: latitude,
      lng: longitude
    })
  }

  getGeoCoords = () => {
    if(navigator.geolocation) {

       // timeout at 60000 milliseconds (60 seconds)
       var options = {timeout:60000};
       navigator.geolocation.getCurrentPosition(this.showLocation, this.errorHandler, options);
    } else {
       alert("Sorry, browser does not support geolocation!");
    }
  }
  render() {
    return (
      <div>
        <NavBar />
        <main className={classes.Main}>
          <Route path="/" exact render={() => <Login getGeoCoords={this.getGeoCoords}/>}/>
          <Route path="/chatRoom" exact render = {() => (
            <ChatRoom chatHistory={this.state.chatHistory} lat={this.state.lat} lng={this.state.lng} activeUser={this.state.activeUser} />
          )}/>
        </main>
      </div>
    )
  }
}

export default Layout;
