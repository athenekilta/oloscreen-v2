import { useEffect, useState } from 'react';
import style from './index.css';
import 'moment/locale/fi';
import moment from 'moment';
import Sponsors from './Sponsors';

const Header = () => {
  const [time, setTime] = useState(moment().locale('fi'));

  const updateTime = () => {
    setTime(moment().locale('fi'));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <header class={style.header}>
        <div class={style.appheadertime}>
          <p id={style.timeclock}> {time.format('LTS')} </p>
          <div id={style.timedate}>
            <div id={style.daydate}>
              <p id={style.day}> {time.format('dddd')}</p>{' '}
              <p id={style.date}>{time.format('D.M')}. </p>
            </div>
            <div id={style.daydate}>
              <p id={style.day}>viikko</p>{' '}
              <p id={style.date}>{time.get('week')}</p>
            </div>
          </div>
        </div>
        <Sponsors />
      </header>
      <div class={style.appheadertime2}>
        <p id={style.timeclock}> {time.format('LTS')} </p>
        <div id={style.timedate}>
          <div id={style.daydate}>
            <p id={style.day}> {time.format('dddd')}</p>{' '}
            <p id={style.date}>{time.format('D.M')}. </p>
          </div>
          <div id={style.daydate}>
            <p id={style.day}>viikko</p>{' '}
            <p id={style.date}>{time.get('week')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
