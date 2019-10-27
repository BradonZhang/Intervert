import React from 'react';

const JoinGroupItem = (props) => {
  const { room, onRoomJoin, key } = props;
  const { name, id } = room;

  return (
    <li className='group-item' key={String(id)}>
      <span className='group-item-name'>{name}</span>
      <button className='join-button' onClick={() => onRoomJoin(id)}>JOIN</button>
    </li>
  );
};

const JoinGroupList = (props) => {
  const { joinableRooms, onRoomJoin } = props;
  return (
    <ul className='group-item-list'>
      {joinableRooms.map((room, index) => (
        <JoinGroupItem
          key={String(room.id)}
          room={room}
          onRoomJoin={onRoomJoin}
        />
      ))}
    </ul>
  );
};

export default JoinGroupList;
