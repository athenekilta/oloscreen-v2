import React, { useEffect, useState } from 'react'
import axios from "axios";

const Shouts = () => {
    const [shouts, setShouts] = useState([])

    const getShouts = () => {
        const apiURL = `http://localhost:3001/shoutbox/`;
        axios.get(apiURL).then(function (response) {
            setShouts(response.data)
        });
    }

    useEffect(() => {
        const controller = new AbortController()
        const interval = setInterval(() => {
            getShouts()
          }, 20000);
          return () => {
            clearInterval(interval)
            controller.abort()
        };
    }, [])


    return (
        <div id="shouts">
            <h1>HUUTOLOOTA</h1>
            <h4>TG:
              <a target="_blank" href="https://t.me/oloscreenbot" style={{color: '#333333'}}>
                @OloscreenBot
              </a>
            </h4>
            {shouts.map(shout =>
                <div>{shout}</div>)}

        </div>
    )
}

export default Shouts
