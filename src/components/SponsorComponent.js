import React, { Component } from "react";
import axios from "axios";

class SponsorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sponsorLogos: null,
      currentLogo: null
    };
  }
  componentDidMount() {
    const apiURL = `http://localhost:3001/sponsor-logos/`;
    let self = this;
    axios.get(apiURL).then(function(response) {
      self.setState({
        sponsorLogos: response.data,
        currentLogo: response.data[0]
      });
    });
    setInterval(this.updateSponsor, 20000);
  }
  updateSponsor = () => {
    this.setState({
      currentLogo: this.state.sponsorLogos[
        (this.state.sponsorLogos.indexOf(this.state.currentLogo) + 1) %
          this.state.sponsorLogos.length
      ]
    });
  };
  render() {
    return (
      <div id="sponsor-logos">
        {this.state.sponsorLogos ? (
          <img
            src={require("../assets/sponsor-logos/" + this.state.currentLogo)}
          />
        ) : null}
      </div>
    );
  }
}

export default SponsorComponent;
