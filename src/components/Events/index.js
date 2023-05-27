import { useEffect, useState } from 'react';
import style from './events.css';
import moment from 'moment';
import axios from 'axios';
const MS_INTERVAL = 1000 * 60 * 60 * 6;

const Events = () => {
  const [events, setEvents] = useState([]);

  const getEvents = () => {
    //TODO: Change back to api/calendar
    const apiURL = `api/calendar/`;
    axios.get(apiURL).then(function (response) {
      setEvents(response.data);
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    getEvents();
    const interval = setInterval(() => {
      getEvents();
    }, MS_INTERVAL);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  return (
    <div class={style.events}>
      <h1>Tulevat tapahtumat</h1>
      {events
        ? events.map((i) => {
            return (
              <div key={events.indexOf(i)}>
                <p class={style.eventTime}>
                  {moment(i.startdt).format('llll')}
                </p>
                <h2 class={style.eventTitle}>{i.summary}</h2>
              </div>
            );
          })
        : ''}
    </div>
  );
};

export default Events;
