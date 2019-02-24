import React, { Component } from 'react';
import './App.css';
import HeaderComponent from './components/Header.js';
import Countdown from './components/Countdown.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HeaderComponent />
        <Countdown />
      </div>
    );
  }
}

export default App;
