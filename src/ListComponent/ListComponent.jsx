import React from 'react';

import ListHeader from '../ListHeader/ListHeader';
import ListItem from '../ListItem/ListItem';

import moment from 'moment';
import axios from 'axios';

import './ListComponent.css';

class ListComponent extends React.Component {
  TODO_ENDPOINT = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get';
  API_KEY = 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c'

  constructor(props) {
    super(props);
    this.state = {
      todoList: []
    }
  }

  async componentDidMount() {
    const data = await this.buildTodoList();

    this.setState({
      todoList: data
    })
  }

  sortItemsByDueDate = (items) => {
    return items.sort((itemA, itemB) => {
      if (moment(itemA.dueDate).isAfter(itemB.dueDate)) return 1;
      if (moment(itemA.dueDate).isBefore(itemB.dueDate)) return -1;
      return 0;
    });
  }
  
  buildTodoList = async () => {
    const response = await axios.get(this.TODO_ENDPOINT, {
      headers: {
        'x-api-key': this.API_KEY
      }
    });
    const data = response.data;
    const overdueItems = [];
    const pendingItems = [];
    const completedItems = [];

    // split items into categories (overdue, pending and completed)
    data.forEach(item => {
      const now = moment();

      if (item.isComplete) {
        item.status = 'completed';
        completedItems.push(item);
        return;
      }
      if (!item.isComplete && item.dueDate && now.isAfter(item.dueDate)) {
        item.status = 'overdue';
        overdueItems.push(item);
        return;
      }

      item.status = 'pending';
      pendingItems.push(item);
    });

    return [...this.sortItemsByDueDate(overdueItems), ...pendingItems, ...this.sortItemsByDueDate(completedItems)];
  }

  render () {
    const { todoList } = this.state;

    return (
      <div className='ListComponent'>
        <ListHeader title='Todo App'/>
        
        <section className='items-container'>
          {
            todoList.map( ({id, description, dueDate, status}) => {
              const date = dueDate ? moment(dueDate).format('D MMM YYYY') : '';
              return (
                <ListItem
                  key={id}
                  id={id}
                  description={description}
                  dueDate={date}
                  status={status}
                />
              )
              })
          }
        </section>
      </div>
    )
  }
}

export default ListComponent;
