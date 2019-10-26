import React, { Component } from 'react';
import {
  handleInput,
  connectToChatkit,
  connectToRoom,
  sendMessage,
  sendDM,
} from './methods';
import Dialog from './components/Dialog';
import RoomList from './components/RoomList';
import ChatSession from './components/ChatSession';
import RoomUsers from './components/RoomUsers';

import 'skeleton-css/css/normalize.css';
import 'skeleton-css/css/skeleton.css';
import './App.css';
import { link } from 'fs';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      showLogin: true,
      isLoading: false,
      currentUser: null,
      currentRoom: null,
      rooms: [],
      roomUsers: [],
      roomName: null,
      messages: [],
      newMessage: '',
    };

    

    this.handleInput = handleInput.bind(this);
    this.connectToChatkit = connectToChatkit.bind(this);
    this.connectToRoom = connectToRoom.bind(this);
    this.sendMessage = sendMessage.bind(this);
    this.sendDM = sendDM.bind(this);
  }


  render() {
    const {
      userId,
      showLogin,
      rooms,
      currentRoom,
      currentUser,
      messages,
      newMessage,
      roomUsers,
      roomName,
    } = this.state;

    function removeUser(){
      var text=prompt('Enter user to kick');
      currentUser.removeUserFromRoom({
        userId: text,
        roomId: currentRoom.id
      })
        .then(() => {
          console.log('Removed ' + text+' from room '+roomName)
        })
        .catch(err => {
          console.log(`Error removing leah from room 123: ${err}`)
        })
      }

    function addUser(){
      var text=prompt('Enter user to add');
      currentUser.addUserToRoom({
        userId: text,
        roomId: currentRoom.id
      })
        .then(() => {
          console.log('Added ' + text+' to room '+roomName)
        })
        .catch(err => {
          console.log(`Error adding keith to room 123: ${err}`)
        })
    }

  //   function delRoom(){
  //     var someRoomID='f08a1545-13e7-4f37-95b4-458afdb34aab';
  //      currentUser.deleteRoom({ roomId: 'f08a1545-13e7-4f37-95b4-458afdb34aab' })
  //   .then(() => {
  //     console.log(`Deleted room with ID: ${someRoomID}`)
  //   })
  //   .catch(err => {
  //     console.log(`Error deleted room ${someRoomID}: ${err}`)
  //   })
  // }

    return (
      <div className="App">
        <aside className="sidebar left-sidebar">
          {currentUser ? (
            <div className="user-profile">
              <span className="username">{currentUser.name}</span>
              <span className="user-id">{`@${currentUser.id}`}</span>
            </div>
          ) : null}
          {currentRoom ? (
            <RoomList
              rooms={rooms}
              currentRoom={currentRoom}
              connectToRoom={this.connectToRoom}
              currentUser={currentUser}
            />
          ) : null}
        </aside>
        <section className="chat-screen">
          <header className="chat-header">
            {currentRoom ? <h3>{roomName}</h3> : null}
          </header>
          <ul className="chat-messages">
            <ChatSession messages={messages} />
          </ul>
          <footer className="chat-footer">
            <form onSubmit={this.sendMessage} className="message-form">
              <input
                type="text"
                value={newMessage}
                name="newMessage"
                className="message-input"
                placeholder="Type your message and hit ENTER to send"
                onChange={this.handleInput}
              />
            </form>
          </footer>
        </section>
        <aside className="sidebar right-sidebar">
  
          {currentRoom ? (
            <RoomUsers
              currentUser={currentUser}
              sendDM={this.sendDM}
              roomUsers={roomUsers}
            />
          ) : null}

          <li className="room-member">Kick user
              <button 
              onClick={removeUser}
              title={'Kick '+userId+' from '+roomName}
              className="send-dm"
                >+
                </button>
          </li>

          <li className="room-member">Add user
              <button 
              onClick={addUser}
              title={'Add '+userId+' to '+roomName}
              className="send-dm"
                >+
                </button>
          </li>

          <li className="room-member">Delete room
          <button
          onClick={() => {
            const rooms = this.state.rooms.filter(c => c.id !== currentRoom.id);
            this.setState({ rooms });
          }}
          // onClick={delRoom()}
          // onClick={addUser}
          title={'Remove a direct message'}
          className="send-dm"
        >
          ×
        </button>
        </li>

        </aside>
        {showLogin ? (
          <Dialog
            userId={userId}
            handleInput={this.handleInput}
            connectToChatkit={this.connectToChatkit}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
