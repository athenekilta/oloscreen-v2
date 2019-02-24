import React, { Component } from "react";
import moment from "moment";
import "moment/locale/fi";
import "../App.css";
import "./header.css";

moment.locale("fi");

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    moment.locale("fi");
  }
  render() {
    console.log(moment.locale("fi"));
    return (
      <div>
        <header className="App-header">
          <p id="time-date"> {moment().format("LL")} </p>
          <p id="time-clock"> {moment().format("LTS")} </p>
          <div id="logo-carousel">
            <p>Logot</p>
          </div>
        </header>
      </div>
    );
  }
}

export default HeaderComponent;
