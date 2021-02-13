import React, { Component } from "react";


function importAll(r) {
  return r.keys().map(r);
}

const sponsorLogos = importAll(require.context('../assets/sponsor-logos/', true, /\.png/))
    .map(a => a.default);

class SponsorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sponsorLogos: null,
      currentLogo: null
    };
  }
  componentDidMount() {
    this.setState({
      sponsorLogos: sponsorLogos,
      currentLogo: sponsorLogos[0]
    });

    setInterval(this.updateSponsor, 10000);
  }
  updateSponsor = () => {
    const logoElement = document.getElementById("sponsor-logos");
    logoElement.classList.add("animate-fade-out");
    setTimeout(() => {
      this.setState({
        currentLogo: this.state.sponsorLogos[
          (this.state.sponsorLogos.indexOf(this.state.currentLogo) + 1) %
          this.state.sponsorLogos.length
        ]
      });
      logoElement.classList.remove("animate-fade-out");
      logoElement.classList.add("animate-fade-in");
      setTimeout(() => logoElement.classList.remove("animate-fade-in"), 1000);
    }, 1000);
  };
  render() {
    return (
      <div id="sponsor-logos">
        {this.state.sponsorLogos ? (
          <img
            alt="sponsorLogo"
            src={this.state.currentLogo}
          />
        ) : null}
      </div>
    );
  }
}

export default SponsorComponent;
