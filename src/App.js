import React, { Component } from 'react';
import './App.css';
import HeaderComponent from './components/Header.js';
import MenuComponent from './components/MenuComponent.js';
import ShoutboxComponent from './components/ShoutboxComponent.js';
import Countdown from './components/Countdown';
import Events from './components/Events';
import Container from './components/Container';

/*<div className="eventContainer">
              <Events />
              <Countdown />
            </div>
            <ShoutboxComponent />*/

            //<MenuComponent />


            

class App extends Component {
  render() {
    return (
      <div>
        <Container />
      </div>
    );
  }
}

export default App;
