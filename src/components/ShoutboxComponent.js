import React, { Component } from "react";
import axios from "axios";

class SponsorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouts: []
        };
    }
    componentDidMount() {
        this.updateShouts()
        setInterval(this.updateShouts, 5000);
    }
    updateShouts = () => {
        const apiURL = `api/shoutbox/`;
        let self = this;
        axios.get(apiURL).then(function (response) {
            self.setState({
                shouts: response.data
            });
        });
    };
    render() {
        const { shouts } = this.state

        return (
            <div id="shouts">
                <h1>HUUTOLOOTA</h1>
                <h4> TG: @OloscreenBot</h4>
                {shouts.map(shout =>
                    <div>{shout}</div>)}

            </div>
        );
    }
}

export default SponsorComponent;
