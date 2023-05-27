import { useEffect, useState } from 'react';
import axios from 'axios';
import style from './styles.css';

const Shouts = () => {
  const [shouts, setShouts] = useState([]);

  const getShouts = () => {
    //TODO: Change to api/shoutbox/
    const apiURL = `api/shoutbox/`;
    axios.get(apiURL).then(function (response) {
      setShouts(response.data);
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const interval = setInterval(() => {
      getShouts();
    }, 20000);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  return (
    <div id={style.shouts}>
      <h1>HUUTOLOOTA</h1>
      <h4>
        TG:
        <a
          target="_blank"
          href="https://t.me/oloscreenbot"
          style={{ color: '#333333' }}
          rel="noreferrer"
        >
          @OloscreenBot
        </a>
      </h4>
      {shouts.map((shout) => (
        <div key={shout}>{shout}</div>
      ))}
    </div>
  );
};

export default Shouts;
