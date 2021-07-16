import React, { useState, useEffect } from 'react';

import axios from 'axios';

import './ListItem.css';


const ListItem = ({ id, description, dueDate, status }) => {
  const TODO_ENDPOINT = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch';
  const API_KEY = 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c'

  const [checked, setChecked] = useState(status !== 'pending');
  const [itemStatus, setItemStatus] = useState(status);
  const handleClick = () => setChecked(!checked);

  useEffect(() => {
    async function patch() {
      if (checked && itemStatus === 'pending') {
        const response = await axios({
          method: 'patch',
          url: `${TODO_ENDPOINT}/${id}`,
          data: {
            isComplete: checked
          },
          headers: {
            'x-api-key': API_KEY,
          },
          mode: 'cors',
        });

        if(response.status === 200) {
          setItemStatus('completed');
        }
      }
    }

    patch();
  }, [checked, id, itemStatus]);

  return (
    <div className={`ListItem ${itemStatus}`}>
      <input onChange={handleClick} checked={checked} type='checkbox' id={`${id}`} disabled={itemStatus !== 'pending' ? true : false}/>
      <span className='description-item'>{ description }</span>
      <span className='date-item'>{ dueDate }</span>
    </div>
  )
};

export default ListItem;
