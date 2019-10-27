import React from 'react';

const GroupBar = (props) => {
  const { groups } = props;

  return (
    <div className={'group-bar'}>
      <ul className={'group-list'}>
        {groups.map((group, index) => (
          <li key={String(index)}>
            <img
              className={'group-icon'}
              alt={group.name}
              src={group.icon.src}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupBar;
