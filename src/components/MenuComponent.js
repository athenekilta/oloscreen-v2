import React, { Component } from 'react';
import '../App.css';
import moment from 'moment';
import 'moment/locale/fi';
import axios from 'axios';
const MS_INTERVAL = 1000 * 60 * 60 * 12
moment.locale('fi');

class MenuComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantData: null
    };
    this.updateData = this.updateData.bind(this)
  }
  componentDidMount() {
    this.updateData();
    window.setInterval(this.updateData, MS_INTERVAL)
  }
  updateData() {
    console.log("updating data")
    const apiURL = `http://localhost:3001/restaurants/`;
    let self = this;
    axios.get(apiURL).then(function (response) {
      self.setState({ restaurantData: response.data });
    });
  }
  
  renderMenu(restaurantData, restaurantTitle) {
    const openingHours = restaurantData.openingHours[moment().weekday()] || 'Suljettu tänään';
    let courses = null
    console.log(openingHours)
    if (restaurantData.menus.length > 0){
      courses = restaurantData.menus.map(course => {
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
        <div style={{ display: 'flex' }}>
          <div className='restaurant-title'>
            <h2 className='restaurant'>{restaurantTitle}</h2>
            <i>{openingHours}</i>
          </div>

          <div className='courses'> {courses}</div>
        </div>
      </div>
    );
  }

  render() {
    const { restaurantData } = this.state;
    if (!restaurantData) {
      return null;
    }
    console.log(restaurantData);
    return (
      <div className='food-menu'>
        <h1 id='menu-title'>NÄLKÄ?</h1>
        {this.renderMenu(restaurantData.sodexo, 'T-Talo')}
        {this.renderMenu(restaurantData.abloc, 'A bloc')}
        {this.renderMenu(restaurantData.tuas, 'TUAS')}
      </div>
    );
  }
}

export default MenuComponent;
