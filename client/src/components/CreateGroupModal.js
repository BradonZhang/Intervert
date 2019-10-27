import React, { useState } from 'react';

const CreateGroupModal = (props) => {
  const { visible, onMakeGroup, onCancel } = props;

  const [newName, setNewName] = useState('');
  const [tags, setTags] = useState('');
  const [badName, setBadName] = useState(false);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
    setBadName(false);
  };

  const handleClick = () => {
    if (newName.trim().length > 0) {
      onMakeGroup(newName, tags.split(',').map(tag => tag.trim().toLowerCase()));
      setNewName('');
    } else {
      setBadName(true);
    }
  };

  const handleModalClick = e => {
    if (e.target.className === 'create-group-modal') onCancel();
  };

  if (!visible) return null;
  return (
    <div className='create-group-modal' onClick={handleModalClick}>
      <div className='create-group-modal-content'>
        <form className='create-group-modal-name'>
          <input
            required
            // autoFocus
            type="text"
            placeholder="Group name"
            onChange={handleNameChange}
            className={`club-search${badName ? ' bad-input' : ''}`}
          />
          <input
            type="text"
            placeholder="Group tags (comma-separated)"
            onChange={e => setTags(e.target.value)}
            className='club-search'
          />
        </form>
        <div className='create-group-modal-buttons'>
          <button onClick={handleClick}>MAKE GROUP</button>
          <button onClick={handleClick}>CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
