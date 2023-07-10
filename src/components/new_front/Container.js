import React, {useEffect} from 'react'
import Countdown from './Event/Countdown';
import Events from './Event/Events';
import Shouts from './Event/Shouts';
import Header from './Header/Header';
import MenuComponent from './Menu/MenuComponent';
import './container.css'
import Progress from './progress/Progress';

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
    <div className='App'>
        <Header />
        <div className='padding-cont'></div>
        <div className='content-wrap'>
        <div style={{display: show ? 'block' : 'none' }} className="eventContainer">
            <MenuComponent />
          </div>
          <div className="eventContainer" style={{display: !show ? 'flex' : 'none' }}>
              <Events />
              <Countdown />
              <Shouts />
        </div>
        </div>
        <Progress />
    </div>
  )
}

export default Container