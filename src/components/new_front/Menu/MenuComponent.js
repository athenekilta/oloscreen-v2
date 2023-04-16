import React, { useEffect, useState } from 'react'
import './menu.css'
import moment from 'moment';
import 'moment/locale/fi';
import axios from 'axios';
const MS_INTERVAL = 1000 * 60 * 60 * 12
moment.locale('fi');

const MenuComponent = () => {
    const [data, setData] = useState()

    const fetchData = () => {
        const apiURL = "http://localhost:3001/api/restaurants/"
        axios.get(apiURL).then((response) => {
            console.log(response.data)
            setData(response.data)
        })
    }

    useEffect(() => {
      const controller = new AbortController()
        fetchData()
        const interval = setInterval(() => {
            fetchData()
        }, MS_INTERVAL)
        return () => {
          clearInterval(interval) 
          controller.abort()}
    }, [])


    const renderMenu = (data, name) => {
        const openingHours = data.openingHours[moment().weekday()] || 'Suljettu tänään';
        let courses = null
        console.log(openingHours)
        if (data.menus.length > 0){
            courses = data.menus.map(course => {
            return (
            <p key={course.title}>
                {course.title}{' '}
                {course.properties.length > 0 ? <span className='foodCodes'>{`(${course.properties})`}</span> : null}
            </p>
        );
      });
    }
    
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '25vw', border: '3px #5e8c64', borderStyle: 'none none none solid', padding: '1em', margin: '1em' }}>
          <div className='restaurant-title'>
            <h2 className='restaurant'>{name}</h2>
            <i>{openingHours}</i>
          </div>

          <div className='courses'> {courses}</div>
        </div>
      </div>
    );
    }


    return (
        <div>
        {data ? <div className='food-menu'>
            {renderMenu(data.sodexo, 'T-Talo')}
            {renderMenu(data.abloc, 'A bloc')}
            {renderMenu(data.tuas, 'TUAS')}
        </div>: <div> </div>}
        </div>
      );
    }

export default MenuComponent