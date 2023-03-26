import React from 'react'
import '../App.css';
import HeaderComponent from './Header.js';
import MenuComponent from './MenuComponent.js';
import ShoutboxComponent from './ShoutboxComponent.js';
import Countdown from './Countdown';
import Events from './Events';
import { useEffect } from 'react';
import ProgressBar from './ProgressBar';

const Container = () => {
    const [show, setShow] = React.useState(true)
    const windowSize = React.useRef([window.innerWidth, window.innerHeight]);


  
    function pageScroll() {
      window.scrollBy(0,1)
      setTimeout(pageScroll, 20);
  }
    
    const autoScroll = () => {
      if(windowSize.current[0]===1920) {
        pageScroll()
      }
      
    }

    autoScroll()


    useEffect(() => {
      const interval = setInterval(() => {
        setShow(prevShow => !prevShow)
      }, 10000);
      return () => clearInterval(interval);
    }, []);


  return (
    <div>
        <div className="App">
        <HeaderComponent />
        <div className='padding-cont'></div>
        <div class="content-wrap">
          <div style={{display: show ? 'block' : 'none' }} className="eventContainer">
            <MenuComponent />
          </div>
          <div className="eventContainer" style={{display: !show ? 'flex' : 'none' }}>
              <Events />
              <Countdown />
              <ShoutboxComponent />
        </div>
        </div>
        <ProgressBar screen={show}/>
      </div>
    </div>
  )
}

export default Container
