import React, { Component } from 'react';
import moment from 'moment';
import classes from './ChatBox.css';
import Button from '../../../Components/UI/Button/Button';
import Avatar from '../../../Components/Avatar/Avatar';
import WindowHeader from '../../../Components/UI/WindowHeader/WindowHeader';
import io from 'socket.io-client';
class ChatBox extends Component {
  state = {
        username: '',
        message: '',
        messages: []
  }
    // what does this need to be set to for production

  componentDidUpdate() {
    this.scrollToBottom();
  }
  componentDidMount(){
    // focus on message input
    this.textInput.focus();
    this.scrollToBottom();
    // event handler for enter key presses
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter'){
        // handle differenct contexts of Enter clicks
        if (this.state.message.length > 0){
          this.submitMessage();
        }
      }
    })
    //connect to the backend websocket
    this.socket = io.connect(process.env.REACT_APP_SERVER_URL);
    // join a chat room for this location
    this.socket.on('connect', () => {
      this.socket.emit('JOIN', this.props.neighborhood);
    })
    this.socket.on('RECEIVE_MESSAGE', (data) => {
      console.log("received message ")
      let newMessages = [...this.state.messages, data]
      console.log('Setting state line 40')
      this.setState({
        messages: newMessages
      })
    });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  updateMessage = (event) => {
    if (event.key === 'Enter'){
      console.log('you hit enter')
      console.log(event.key + " = Enter")
      this.submitMessage();
      return;
    }
    let updatedMessage = event.target.value;
    this.setState({
      message: updatedMessage
    })
  }

  submitMessage = () => {
    console.log("SUBMIT")
    let updatedChatHistory = [];
    if (this.state.messages) {
      updatedChatHistory = [...this.state.messages];
    }
    const date = moment().format("ddd, MMM Do hh:mm a");
    const newMessage = {
      room: this.props.neighborhood,
      text: this.state.message,
      UserId: this.props.userId,
      user: this.props.user,
      LocationId: this.props.locationId,
      date: date,
    }
    const displayMessage = {text: this.state.message, user: this.props.user, date: date};
    updatedChatHistory.push(displayMessage)
    // post to db
    this.socket.emit('SEND_MESSAGE', newMessage, () => {
      console.log("SETTING STATE");
      console.log("MESSAGE SENT");
    })
    console.log("seeting state line 83")
    this.setState({
      message: '',
      messages: updatedChatHistory,
    })
  }

  render() {
    let messages = []
    if (this.state.messages) {
      messages = this.state.messages.map((message, i) => {
        console.log(message)
        let messageClass = (message.user === this.props.user) ?
          classes.Message : [classes.Message, classes.MessageRecv].join(' ');
        return (
          <div key={i} className={messageClass}>
            <Avatar context="chat" username={message.user}/>
            <span className={classes.MessageText}>{message.text}</span>
            <div className={classes.TimeStamp}>({message.date})</div>
          </div>

        )
      })
      // use this to scroll to the bottom
      messages.push(<div ref={el => { this.messagesEnd = el}}></div>)
    }
    return (

      <div className={classes.ChatBox}>
        <br />
        <br />

        <div className={classes.Window}>
          <WindowHeader >{this.props.neighborhood} Chat</WindowHeader>
          <div className={classes.ChatScroll} id='scrollable'>{messages}</div>
        </div>
        <div id="chatControls" className={classes.ChatControls}>
          <input
            className={classes.ChatInput}
            value={this.state.message}
            onChange={this.updateMessage}
            ref={input => {this.textInput = input}}
          />
          <Button clicked={this.submitMessage}>Send</Button>
        </div>
      </div>
    )
  }

}


export default ChatBox;
