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
import HomePage from './components/HomePage';

import 'skeleton-css/css/normalize.css';
import 'skeleton-css/css/skeleton.css';
import './App.css';
import { link } from 'fs';
import CreateGroupModal from './components/CreateGroupModal';

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
      createGroupModalVisible: false
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
      createGroupModalVisible
    } = this.state;

    const isCreator = currentRoom && currentUser && (
      currentRoom.createdByUserId === currentUser.id
    );

    const makeRoom = (name, tags) => {
      const { currentUser, rooms } = this.state;
        currentUser.createRoom({
          name,
          private: false,
          addUserIds: [currentUser.id],
          customData: {tags},
        }).then((room) => {
          this.connectToRoom(room.id);
          console.log('Room created', room);
        })
          .catch(err => console.warn(err));
      this.setState({createGroupModalVisible: false});
    }

    const removeUser = () => {
      var text=prompt('Enter user to kick');
      if (text == null || text == '')
      {
        return;
      }
      // TODO: If user is not in the room, alert the user that the kick failed
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
      
      const updated = roomUsers.filter(c => c.id !== text);
      this.setState({ roomUsers: updated });
    }

    const addUser = () => {
      var text=prompt('Enter user to add');
      if (text == null || text == '')
      {
        return;
      }
      currentUser.addUserToRoom({
        userId: text,
        roomId: currentRoom.id
      })
        .then(() => {
          console.log('Added ' + text+' to room '+roomName);
        })
        .catch(err => {
          console.log(`Error adding keith to room 123: ${err}`);
        })
        
      const updated=[...this.state.roomUsers];
      updated.push(text);
      this.setState({ roomUsers: updated });
    }

    const delRoom = () => {
      if (!isCreator) {
        alert('You are not the creator of this room.');
        return;
      }
      var someRoomID=currentRoom.id;
       currentUser.deleteRoom({ roomId: someRoomID })
    .then(() => {
      console.log(`Deleted room with ID: ${someRoomID}`);
    })
    .catch(err => {
      console.log(`Error deleted room ${someRoomID}`, err);
    })

    const updated = rooms.filter(c => c.id !== someRoomID);
    this.setState({ rooms: updated });
  }
  

    return (
      <div className="App">
        <CreateGroupModal
          visible={createGroupModalVisible}
          onMakeGroup={makeRoom}
          onCancel={() => this.setState({createGroupModalVisible: false})}
        />
        <aside className="sidebar left-sidebar">
          {currentUser ? (
            <div
              className="user-profile"
              onClick={() => this.setState({currentRoom: null})}
            >
              <div className='home-icon'>🏠</div>
              <div className="profile-info">
                <span className="username">{currentUser.name}</span>
                <span className="user-id">{`@${currentUser.id}`}</span>
              </div>
            </div>
          ) : null}
          <RoomList
            rooms={rooms}
            currentRoom={currentRoom}
            connectToRoom={this.connectToRoom}
            currentUser={currentUser}
          />
        </aside>
        {currentRoom ? (
          <section className="chat-screen">
            <header className="chat-header">
              {currentRoom ? <h3>{roomName}</h3> : null}
            </header>
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
            <ul className="chat-messages">
              <div className='chat-buffer' />
              <ChatSession messages={messages} />
            </ul>
          </section>
        ) : (
          <HomePage
            currentUser={currentUser}
            connectToRoom={this.connectToRoom}
          />
        )}
        <aside className="sidebar right-sidebar">
  
          {currentRoom ? (
            <RoomUsers
              currentUser={currentUser}
              sendDM={this.sendDM}
              roomUsers={roomUsers}
            />
          ) : null}
        <ul className='admin-options'>
          {isCreator && (
            <li className="room-member">Kick user
            <button
              onClick={removeUser}
              title={'Kick '+userId+' from '+roomName}
              className="send-dm"
            >x
                </button>
          </li>
          )}

          <li className="room-member">Add user
              <button 
              onClick={addUser}
              title={'Add '+userId+' to '+roomName}
              className="send-dm"
                >+
                </button>
          </li>

          {isCreator && (
            <li className="room-member">Delete room
              <button
                onClick={delRoom}
                title={'Remove this room'}
                className="send-dm"
              >
                ×
              </button>
            </li>
          )}
          <li className="room-member">Create room
              <button 
              onClick={() => this.setState({createGroupModalVisible: true})}
              title={'Create room '}
              className="send-dm"
                >+
                </button>
          </li>
          </ul>

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
