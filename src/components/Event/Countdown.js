import React, { Component } from 'react';
import './countdown.css';
import moment from 'moment';
import Counter from './Counter';
import axios from 'axios';

class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      fetching: false,
    };
    this.counter = this.counter.bind(this);
  }

  counter() {
    const { events } = this.state;
    const countDownDate = events[0] ? moment(events[0].startdt).valueOf() : 0;
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

  getEvents = () => {
    const apiURL = `api/hype/`;
    let self = this;
    axios.get(apiURL).then(function (response) {
      self.setState({
        events: response.data,
      });
    });
  };

  render() {
    const { events, distance } = this.state;
    return (
      <div class="countdown">
        <h1>{events[0] ? events[0].summary : ''}</h1>
        {distance ? <Counter distance={distance} /> : ''}
      </div>
    );
  }
}

export default Countdown;
