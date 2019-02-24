import React, { Component } from 'react';
import '../App.css';
import moment from 'moment';
import 'moment/locale/fi'
import axios from 'axios'



moment.locale("fi")
class MenuComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            restaurantData: null
        }

    }
    componentDidMount() {
        const apiURL = `http://localhost:3001/restaurants/`;
        console.log(apiURL)
        let self = this
        axios.get(apiURL)
            .then(function (response) {
                self.setState({ restaurantData: response.data })
            })
    }
    renderSodexoMenu(restaurantData) {
        const openingHours = restaurantData.openingHours[moment().weekday() - 2] || "Suljettu tänään"
        const courses = restaurantData.menus[0].courses.map(course => {
            return <p key={course.title}>{course.title}</p>
        })

        return (
            <div>
                <div style={{ display: "flex" }}>
                    <div className="restaurant-title">
                        <h2 className="restaurant" > T-talo</h2>
                        <i>{openingHours}</i></div>


                    <div className="courses"> {courses}</div>
                </div>
            </div >


        )
    }
    renderSubwayMenu(restaurantData) {

        const openingHours = restaurantData.openingHours
        return (
            <div>
                <div style={{ display: "flex" }}>
                    <div className="restaurant-title">
                        <h2 className="restaurant" > Subway</h2>
                        <i>{openingHours}</i></div>
                    <div className="courses" id="subway-courses">{restaurantData.title} </div>
                </div>
            </div>


        )
    }
    formatCourseName(name) {
        return name.split(" (")[0]
    }
    renderAmicaMenu(restaurantData) {
        console.log(restaurantData)
        const openingHours = restaurantData.MenusForDays[0].LunchTime
        const courses = restaurantData.MenusForDays[0].SetMenus.map(course => {
            const courseName = course.Name.toLowerCase()
            if (courseName.includes("lounas")) {
                return (
                    <div key={course.Components.join(", ")}>
                        <p>
                            {course.Components.map(component => {
                                return <span>{this.formatCourseName(component)}<br /></span>
                            })}
                        </p>
                    </div>
                )
            }
            else if (courseName.includes("bufee")) {
                return (
                    <div key={course.Components.join(", ")}>
                        <b >Salaatti</b>
                        <p style={{ marginTop: "6px" }}>
                            {course.Components.map(component => {
                                return <span>{this.formatCourseName(component)}<br /></span>
                            })}
                        </p>
                    </div >
                )
            }

        })
        const openingHoursParsed = openingHours.split(", ") // split by ','
        return (
            <div>
                <div style={{ display: "flex" }}>
                    <div className="restaurant-title">
                        <h2 className="restaurant" > TUAS</h2>
                        <i>
                            <p style={{ margin: 0 }}>{openingHoursParsed[0]}</p>
                            <p style={{ marginTop: 0 }}>{openingHoursParsed[1]}</p>
                        </i>
                    </div>


                    <div className="courses"> {courses}</div>
                </div>
            </div >
        )
    }
    render() {
        const { restaurantData } = this.state
        if (!restaurantData) { return null }
        console.log(restaurantData)
        return (
            <div className="food-menu" >
                <h1 id="menu-title">RUOKALISTAT</h1>
                {this.renderSodexoMenu(restaurantData.sodexo)}
                {this.renderAmicaMenu(restaurantData.amica)}
                {this.renderSubwayMenu(restaurantData.subway)}
            </div >
        );
    }
}

export default MenuComponent;
