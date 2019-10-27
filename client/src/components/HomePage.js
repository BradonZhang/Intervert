import React, { memo, useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import JoinGroupList from './JoinGroupList';

const sortByNew = (roomA, roomB) => {
  const a = new Date(roomA.createdAt);
  const b = new Date(roomB.createdAt);
  if (a < b) return 1;
  else if (a > b) return -1;
  else return 0;
}

const HomePage = (props) => {
  const { currentUser, connectToRoom } = props;

  const [searchVal, setSearchVal] = useState('');
  const [joinableRooms, setJoinableRooms] = useState([]);
  const [sortMethod, setSortMethod] = useState('new');

  useEffect(() => {
    if (!currentUser) return;
    currentUser.getJoinableRooms().then(rooms => {
      const searchTokens = searchVal.split(' ');
      let roomsToShow = rooms.filter(
        (room) => {
          const tagString = (room.customData && room.customData.tags) ? (
            room.customData.tags.join('\n')
          ) : '';
          return (
            room.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            searchTokens.reduce((res, tag) => res && tagString.includes(tag), true)
          );
        }
      );
      // TODO: Add a way to sort by popularity i.e. number of members
      roomsToShow.sort(sortByNew);
      setJoinableRooms(roomsToShow);
    }).catch(err => console.warn(err));
  }, [currentUser, searchVal]);

  const handleRoomJoin = (roomId) => {
    currentUser.joinRoom({ roomId })
      .then(room => {
        connectToRoom(room.id);
        console.log(`Joined room with ID: ${room.id}`);
      }).catch(err => console.warn(err));
  };

  return (
    <div className='home-page'>
      <h2 className='app-title'>Intervert</h2>
      <SearchBar
        onChange={val => setSearchVal(val)}
      />
      <JoinGroupList
        joinableRooms={joinableRooms}
        onRoomJoin={handleRoomJoin}
      />
    </div>
  );
};

export default memo(HomePage);
