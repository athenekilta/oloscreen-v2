import React, { Component } from 'react';
import '../App.css';
import moment from 'moment';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount = () => {
    this.getEvents();
  };

  getEvents() {
    let that = this;
    function start() {
      window.gapi.client
        .init({
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY
        })
        .then(function() {
          return window.gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/athenekilta@gmail.com/events?singleEvents=true&orderBy=startTime&timeMin=${moment().toISOString()}&maxResults=3`
          });
        })
        .then(
          response => {
            // Google cal sorts events by edit time, sorting here by event time
            let events = response.result.items;
            that.setState({
              events
            });
          },
          function(reason) {
            console.log(reason);
          }
        );
    }
    window.gapi.load('client', start);
  }

  render() {
    const { events } = this.state;
    return (
      <div className='events'>
        <h1>Tulevat tapahtumat</h1>
        {events
          ? events.map(i => {
              return (
                <div key={i.id}>
                  <p className='eventTime'>
                    {moment(i.start.dateTime).format('llll')}
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
