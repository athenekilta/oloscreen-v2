import React, { Component } from "react";
import moment from "moment";
import SponsorComponent from "./SponsorComponent.js";
import "moment/locale/fi";
import "../App.css";
import "./header.css";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    moment.locale("fi");
    this.state = {
      time: moment(),
      sponsorLogos: null
    };
  }
  componentDidMount() {
    setInterval(this.updateTime, 1000);
  }
  updateTime = () => {
    this.setState({ time: moment() });
  };


  render() {
    return (
      <div>
        <header className="App-header">
          <div className="app-header-time">
            <p id="time-clock"> {this.state.time.format("LTS")} </p>
            <div id="time-date">
              <div id="day-date">
                <p id="day"> {this.state.time.format("dddd")}</p> <p id="date">{this.state.time.format("D.M")}. </p>
              </div>
              <div id="day-date">
                <p id="day">viikko</p> <p id="date">{this.state.time.get("week")}</p>
              </div>
            </div>
          </div>
          <SponsorComponent />
        </header>
      </div>
    );
  }
}

export default HeaderComponent;
