import React, { Component } from 'react';
import './App.css';
import HeaderComponent from './components/Header.js'
import MenuComponent from './components/MenuComponent.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <HeaderComponent />
        <MenuComponent />
      </div>
    );
  }
}

export default App;
