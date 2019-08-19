import React, { Component } from 'react';
import '../App.css';
import moment from 'moment';
import Counter from './Counter';

class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      fetching: false
    };
    this.counter = this.counter.bind(this);
  }

  counter() {
    const { events } = this.state;
    const countDownDate = events[0]
      ? moment(events[0].start.dateTime).valueOf()
      : 0;
    const now = moment().valueOf();
    const distance = countDownDate - now;

    this.setState({ distance: distance });
  }

  componentDidMount = () => {
    this.getEvents();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { events, fetching, distance } = this.state;

    if (!fetching && distance < 0) {
      this.getEvents();
    }

    if (!events || !events[0]) {
      return;
    }
    if (
      prevState.events &&
      prevState.events[0] &&
      prevState.events[0].id === events[0].id
    ) {
      return;
    }
    if (this.interval) clearInterval(this.interval);
    this.counter();
    this.interval = setInterval(() => {
      this.counter();
    }, 1000);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  getEvents() {
    this.setState({ fetching: true });
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
              events,
              fetching: false
            });
          },
          function(reason) {
            console.log(reason);
            this.setState({ fetching: false });
          }
        )
        .catch(error => console.log(error));
    }
    window.gapi.load('client', start);
  }

  render() {
    const { events, distance } = this.state;
    return (
      <div className='countdown'>
        <h1>{events[0] ? events[0].summary : ''}</h1>
        {distance ? <Counter distance={distance} /> : ''}
      </div>
    );
  }
}

export default Countdown;
