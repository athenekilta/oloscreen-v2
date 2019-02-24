import React, { Component } from 'react';
import '../App.css';
import moment from 'moment';

class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    this.counter = this.counter.bind(this);
  }

  counter(eventDate) {
    const countDownDate = moment(eventDate).valueOf();
    const now = moment();
    const distance = countDownDate - now;

    const pad = num => {
      let s = `${num}`;
      while (s.length < 2) {
        s = `0${s}`;
      }
      return s;
    };

    const days = pad(Math.floor(distance / (1000 * 60 * 60 * 24)));
    const hours = pad(
      Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    const minutes = pad(
      Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    );
    const seconds = pad(Math.floor((distance % (1000 * 60)) / 1000));

    return <p>{days + ' ' + hours + ' ' + minutes + ' ' + seconds}</p>;
  }

  componentDidMount = () => {
    this.getEvents();

    this.counter();
    this.interval = setInterval(() => {
      this.counter();
      // setting the state re-renders the page
      this.setState({ done: true });
    }, 1000);
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
            path: `https://www.googleapis.com/calendar/v3/calendars/${
              process.env.REACT_APP_GOOGLE_CAL_ID
            }/events`
          });
        })
        .then(
          response => {
            // Google cal sorts events by edit time, sorting here by event time
            let events = response.result.items.sort((a, b) => {
              return (
                moment(a.start.dateTime).valueOf() -
                moment(b.start.dateTime).valueOf()
              );
            });
            that.setState(
              {
                events
              },
              () => {
                console.log(that.state.events);
              }
            );
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
    console.log(events[0] ? moment(events[0].start.dateTime).valueOf() : '');
    return (
      <div>
        <h2>{events[0] ? events[0].summary : ''}</h2>
        <p>{events[0] ? events[0].start.dateTime : ''}</p>
        {events[0]
          ? this.counter(moment(events[0].start.dateTime).valueOf())
          : ''}
      </div>
    );
  }
}

export default Countdown;
