import React, { Component } from 'react';
import classes from './ChatRoom.css'
import ChatBox from './ChatBox/ChatBox'
// <div className{classes.SomeClassName}>

class ChatRoom extends Component {

  render() {
    return (
      <ChatBox chatHistory={this.props.chatHistory} activeUser={this.props.activeUser} />
    )
  }

}

export default ChatRoom;