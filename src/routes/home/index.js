// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import Countdown from '../../components/Countdown';
import Events from '../../components/Events';
import Shouts from '../../components/Shouts';
import MenuComponent from '../../components/Menu';
import Progress from '../../components/progress';
import style from './style.css';
// import Progress from './progress/Progress';

const Container = () => {
  // eslint-disable-next-line no-unused-vars
  const [show, setShow] = React.useState(false);
  const windowSize = React.useRef([window.innerWidth, window.innerHeight]);

  function pageScroll() {
    window.scrollBy(0, 1);
    setTimeout(pageScroll, 20);
  }

  const autoScroll = () => {
    if (windowSize.current[0] === 1920) {
      pageScroll();
    }
  };

  autoScroll();

  useEffect(() => {
    const interval = setInterval(() => {
      setShow((prevShow) => !prevShow);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div class={style.App}>
      {/* <Header /> */}

      <div class={style.paddingcont} />
      <div class={style.contentwrap}>
        <div
          style={{
            display: show ? 'block' : 'none',
          }}
          class={style.eventContainer}
        >
          <MenuComponent />
        </div>
        <div
          style={{
            display: !show ? 'flex' : 'none',
          }}
          class={style.eventContainer}
        >
          <Events />
          <Countdown />
          <Shouts />
        </div>
      </div>
      <Progress />
    </div>
  );
};

export default Container;
