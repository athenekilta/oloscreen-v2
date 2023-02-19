import React from 'react'
import { useEffect } from 'react'
import './carousel.css'

const Carousel = ({images, speed}) => {

    useEffect(() => {console.log(images)}, [])

    /*<section style={{ "--speed": `${speed}ms`, background: '#000'}}>
          {images.map(({ id, image }) => (
            <div key={id}>
              <img src={id} alt={image} className="sponsor-img"/>
            </div>
          ))}
        </section>
        <section style={{ "--speed": `${speed}ms`, background: '#000' }}>
          {images.map(({ id, image }) => (
            <div key={id}>
              <img src={id} alt={image} className="sponsor-img"/>
            </div>
          ))}
        </section> */

  return (
      <div className="wrapper">
        <section style={{ "--speed": `${speed}ms`}}>
          {images.map((id, image ) => (
            <div key={id}>
              <img src={id} alt={image} className="sponsor-img"/>
            </div>
          ))}
        </section>
        <section style={{ "--speed": `${speed}ms`}}>
          {images.map((id, image ) => (
            <div key={id}>
              <img src={id} alt={image} className="sponsor-img"/>
            </div>
          ))}
        </section>
      </div>
  )
}

export default Carousel