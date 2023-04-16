import React, { useEffect, useState } from 'react'
import './header.css'
import "moment/locale/fi";
import moment from "moment";
import Sponsors from './Sponsors';

const Header = () => {
  const [time, setTime] = useState(moment())

  const updateTime = () => {
    setTime(moment())
  }

  useEffect(()=> {
    const interval = setInterval(() => {
      updateTime()
    }, 1000);
    return () => clearInterval(interval);
  }, [])

    return (
        <div>
          <header className="App-header">
            <div className="app-header-time">
              <p id="time-clock"> {time.format("LTS")} </p>
              <div id="time-date">
                <div id="day-date">
                  <p id="day"> {time.format("dddd")}</p> <p id="date">{time.format("D.M")}. </p>
                </div>
                <div id="day-date">
                  <p id="day">viikko</p> <p id="date">{time.get("week")}</p>
                </div>
              </div>
            </div>
            <Sponsors />
          </header>
          <div className="app-header-time2">
              <p id="time-clock"> {time.format("LTS")} </p>
              <div id="time-date">
                <div id="day-date">
                  <p id="day"> {time.format("dddd")}</p> <p id="date">{time.format("D.M")}. </p>
                </div>
                <div id="day-date">
                  <p id="day">viikko</p> <p id="date">{time.get("week")}</p>
                </div>
              </div>
            </div>
        </div>
      );
}

export default Header