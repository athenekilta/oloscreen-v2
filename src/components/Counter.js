import React from 'react';
import PropTypes from 'prop-types';

const Counter = ({ distance }) => {
  const pad = num => {
    let s = `${num}`;
    while (s.length < 2) {
      s = `0${s}`;
    }
    return s;
  };

  const days = pad(Math.floor(distance / (1000 * 60 * 60 * 24)));
  const hours = pad(
    Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  const minutes = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = pad(Math.floor((distance % (1000 * 60)) / 1000));

  return !(distance <= 0) ? (
    <div className='countNumbers'>
      <div className='countbox'>
        <span>{days}</span> {days === '01' ? 'päivä ' : 'päivää'}
      </div>
      <div className='countbox'>
        <span>{hours}</span> {hours === '01' ? 'tunti ' : 'tuntia'}
      </div>
      <div className='countbox'>
        <span>{minutes}</span> {minutes === '01' ? 'minuutti ' : 'minuuttia'}
      </div>
      <div className='countbox'>
        <span>{seconds}</span> {seconds === '01' ? 'sekunti ' : 'sekuntia'}
      </div>
    </div>
  ) : (
    <h2>IT'S ON!</h2>
  );
};

Counter.propTypes = {
  distance: PropTypes.number
};

export default Counter;
