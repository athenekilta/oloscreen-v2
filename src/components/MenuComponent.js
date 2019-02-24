import React, { Component } from 'react';
import '../App.css';
import moment from 'moment';
import axios from 'axios'




class MenuComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sodexoData: null
        }

    }
    componentDidMount() {
        const apiURL = `http://localhost:3001/restaurants/`;
        console.log(apiURL)
        let self = this
        axios.get(apiURL)
            .then(function (response) {
                self.setState({ sodexoData: response.data })
            })
    }
    render() {
        const { sodexoData } = this.state
        if (!sodexoData) { return null }
        console.log(sodexoData)
        return (
            <div className="food-menu">


            </div>
        );
    }
}

export default MenuComponent;
