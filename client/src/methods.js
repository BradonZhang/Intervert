import Chatkit from '@pusher/chatkit-client';
import axios from 'axios';

function sendMessage(event) {
  event.preventDefault();
  const { newMessage, currentUser, currentRoom } = this.state;

  if (newMessage.trim() === '') return;

  currentUser.sendMessage({
    text: newMessage,
    roomId: `${currentRoom.id}`,
  });

  this.setState({
    newMessage: '',
  });
}

function handleInput(event) {
  const { value, name } = event.target;

  this.setState({
    [name]: value,
  });
}

const defaultRoom = 'ea1cff1b-c89a-4b86-9a77-6f8d48756f4d';
function connectToRoom(id) {
  
  const { currentUser } = this.state;

  this.setState({
    messages: [],
  });

  if (!id) {
    this.setState({
      rooms: currentUser.rooms,
    });
    return;
  }

  return currentUser
    .subscribeToRoom({
      roomId: `${id}`,
      messageLimit: 100,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [...this.state.messages, message],
          });
        },
        onPresenceChanged: () => {
          const { currentRoom } = this.state;
          this.setState({
            roomUsers: currentRoom.users.sort(a => {
              if (a.presence.state === 'online') return -1;

              return 1;
            }),
          });
        },
        onUserLeft: removedUser => {
          const { currentRoom, roomUsers, currentUser } = this.state;
          console.log(`Attempting to remove ${removedUser.id} from ${currentRoom.name}`)
          this.setState({
            roomUsers: roomUsers.filter(user => user.id !== removedUser.id)
          });
          if (currentUser.id === removedUser.id) {
            alert(`You have been kicked from ${currentRoom.name}.`)
            this.state({currentRoom: null});
          }
        },
      },
    })
    .then(currentRoom => {
      const roomName =
        currentRoom.customData && currentRoom.customData.isDirectMessage
          ? currentRoom.customData.userIds.filter(
              id => id !== currentUser.id
            )[0]
          : currentRoom.name;

      this.setState({
        currentRoom,
        roomUsers: currentRoom.users,
        rooms: currentUser.rooms,
        roomName,
      });
    })
    .catch(console.error);

}

function connectToChatkit(event) {
  event.preventDefault();

  const { userId } = this.state;

  if (userId === null || userId.trim() === '') {
    alert('Invalid userId');
    return;
  }

  this.setState({
    isLoading: true,
  });

  axios
    .post('http://localhost:5200/users', { userId })
    .then(() => {
      const tokenProvider = new Chatkit.TokenProvider({
        url: 'http://localhost:5200/authenticate',
      });

      const chatManager = new Chatkit.ChatManager({
        instanceLocator: 'v1:us1:12175b69-a5c0-4104-be3b-62225da5450f',
        userId,
        tokenProvider,
      });

      return chatManager
        .connect({
          onAddedToRoom: room => {
            const { rooms } = this.state;
            this.setState({
              rooms: [...rooms, room],
            });
          },
        })
        .then(currentUser => {
          this.setState(
            {
              currentUser,
              showLogin: false,
              isLoading: false,
              rooms: currentUser.rooms,
            },
            () => connectToRoom.call(this)
          );
        });
    })
    .catch(console.error);
}

function createPrivateRoom(id) {
  const { currentUser, rooms } = this.state;
  const roomName = `${currentUser.id}_${id}`;

  const isPrivateChatCreated = rooms.filter(room => {
    if (room.customData && room.customData.isDirectMessage) {
      const arr = [currentUser.id, id];
      const { userIds } = room.customData;

      if (arr.sort().join('') === userIds.sort().join('')) {
        return {
          room,
        };
      }
    }

    return false;
  });

  if (isPrivateChatCreated.length > 0) {
    return Promise.resolve(isPrivateChatCreated[0]);
  }

  return currentUser.createRoom({
    name: `${roomName}`,
    private: true,
    addUserIds: [`${id}`],
    customData: {
      isDirectMessage: true,
      userIds: [currentUser.id,id],
    },
  });
  
}

function sendDM(id) {
  createPrivateRoom.call(this, id).then(room => {
    connectToRoom.call(this, room.id);
  });
}

export { sendMessage, handleInput, connectToRoom, connectToChatkit, sendDM };
