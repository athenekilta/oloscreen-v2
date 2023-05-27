import { useState } from 'react';
import Carousel from './Carousel';

const importAll = (r) => {
  return r.keys().map(r);
};

const sponsorLogos = importAll(
  require.context('../Header/assets/sponsor-logos', true, /\.png/),
).map((a) => a.default);

const Sponsors = () => {
  const [logos, setLogos] = useState([]);

  useState(() => {
    setLogos(sponsorLogos);
  }, []);

  return (
    <div id="sponsor-logos">
      {logos.length > 0 ? <Carousel images={logos} speed={40000} /> : null}
    </div>
  );
};

export default Sponsors;
