import React, { Component } from "react";
import Carousel from "./Carousel";


function importAll(r) {
  return r.keys().map(r);
}



const sponsorLogos = importAll(require.context('../assets/sponsor-logos/', true, /\.png/))
    .map(a => a.default);

class SponsorComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      sponsorLogos: [],
    };
  }
  componentDidMount() {
    this.setState({
      sponsorLogos: sponsorLogos
    });
  }

  


  /*{this.state.sponsorLogos ? (
          <img
            alt="sponsorLogo"
            src={this.state.currentLogo}
            className='sponsor-img'
          />
        ) : null}*/
        
  render() {
    return (
      <div id="sponsor-logos">
        {this.state.sponsorLogos.length > 0 ? <Carousel images={this.state.sponsorLogos} speed={40000}/> : null}
      </div>
    );
  }
}

export default SponsorComponent;
