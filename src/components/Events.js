import React, { Component } from 'react';
import '../App.css';
import moment from 'moment';
import axios from "axios";
const MS_INTERVAL = 1000 * 60 * 60 * 6

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount = () => {
    this.getEvents();
    window.setInterval(this.getEvents, MS_INTERVAL);
  };

  getEvents = () => {
    const apiURL = `http://localhost:3001/calendar/`;
    let self = this;
    axios.get(apiURL).then(function (response) {
      self.setState({
        events: response.data
      });
    });

  }

  render() {
    const { events } = this.state;
    return (
      <div className='events'>
        <h1>Tulevat tapahtumat</h1>
        {events
          ? events.map(i => {
              return (
                <div key={events.indexOf(i)}>
                  <p className='eventTime'>
		    {moment(i.startdt).format('llll')}
                  </p>
                  <h2 className='eventTitle'>{i.summary}</h2>
                </div>
              );
            })
          : ''}
      </div>
    );
  }
}

export default Events;
