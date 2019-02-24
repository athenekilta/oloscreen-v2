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
            return <p>{course.title}</p>
        })

        return (
            <div>
                <h2> T-Talo ({openingHours})</h2>
                {courses}
            </div>


        )
    }
    renderSubwayMenu(restaurantData) {
        const openingHours = restaurantData.openingHours


        return (
            <div>
                <h2> Subway ({openingHours})</h2>
                {restaurantData.title}
            </div>


        )
    }
    renderAmicaMenu(restaurantData) {
        console.log(restaurantData)
        const openingHours = restaurantData.MenusForDays[0].LunchTime
        const courses = restaurantData.MenusForDays[0].SetMenus.map(course => {
            const courseName = course.Name.toLowerCase()
            if (courseName.includes("lounas")) {
                return (
                    <div>
                        <p>{course.Components.join(", ")}</p>
                    </div>
                )
            }
            else if (courseName.includes("bufee")) {
                return (
                    <div>
                        <h3>Salaattibuffa</h3>
                        <p>{course.Components.join(", ")}</p>
                    </div >
                )
            }

        })
        return (
            <div>
                <h2> TUAS ({openingHours})</h2>
                {courses}
            </div>
        )
    }
    render() {
        const { restaurantData } = this.state
        if (!restaurantData) { return null }
        console.log(restaurantData)
        return (
            <div className="food-menu" >
                {this.renderSodexoMenu(restaurantData.sodexo)}
                {this.renderAmicaMenu(restaurantData.amica)}
                {this.renderSubwayMenu(restaurantData.subway)}
            </div >
        );
    }
}

export default MenuComponent;
