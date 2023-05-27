import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './Header/Header';
import Container from '../routes/home';

// Code-splitting is automated for `routes` directory
//import Container from '../routes/home';

const App = () => (
  <div
    id="app"
    style={{
      backgroundColor: '#F4EEE7',
      color: '#333333',
    }}
  >
    <Header />
    <Router>{<Container path="/" />}</Router>
  </div>
);

export default App;
