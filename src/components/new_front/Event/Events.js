import React, { useEffect, useState } from 'react'
import './events.css'
import moment from 'moment';
import axios from "axios";
const MS_INTERVAL = 1000 * 60 * 60 * 6

const Events = () => {
  const [events, setEvents] = useState([])
  
  const getEvents = () => {
    const apiURL = `http://localhost:3001/calendar/`;
    axios.get(apiURL).then(function (response) {
      setEvents(response.data)
    });
  }

  useEffect(() => {
    const controller = new AbortController()
    getEvents()
    const interval = setInterval(() => {
      getEvents()
    }, MS_INTERVAL)
    return () => {
      clearInterval(interval) 
      controller.abort()}
  }, [])

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

export default Events