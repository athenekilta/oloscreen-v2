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

    return (
      <div className="countNumbers">
        <div className="countbox">
          <span>{days}</span> days
        </div>
        <div className="countbox">
          <span>{hours}</span> hours
        </div>
        <div className="countbox">
          <span>{minutes}</span> minutes
        </div>
        <div className="countbox">
          <span>{seconds}</span> seconds
        </div>
      </div>
    );
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
            }/events?singleEvents=true&orderBy=startTime&timeMin=${moment().toISOString()}`
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
      <div className="countdown">
        <h1>{events[0] ? events[0].summary : ''}</h1>
        {events[0]
          ? this.counter(moment(events[0].start.dateTime).valueOf())
          : ''}
      </div>
    );
  }
}

export default Countdown;
