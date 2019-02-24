import React, { Component } from "react";
import moment from "moment";
import "moment/locale/fi";
import "../App.css";
import "./header.css";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    moment.locale("fi");
    this.state = {
      time: moment()
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
          <div id="time-date">
            <p> {this.state.time.format("LL")} </p>
            <p>
              {this.state.time.format("dddd") +
                ", viikko " +
                this.state.time.get("week")}
            </p>
          </div>
          <p id="time-clock"> {this.state.time.format("LTS")} </p>
          <p id="logo-carousel">Logot</p>
        </header>
      </div>
    );
  }
}

export default HeaderComponent;
