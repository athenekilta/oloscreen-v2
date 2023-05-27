import style from './carousel.css';

const Carousel = ({ images, speed }) => {
  return (
    <div class={style.wrapper}>
      <section style={{ '--speed': `${speed}ms` }}>
        {images.map((id, image) => (
          <div key={id}>
            <img src={id} alt={image} class={style.sponsorimg} />
          </div>
        ))}
      </section>
      <section style={{ '--speed': `${speed}ms` }}>
        {images.map((id, image) => (
          <div key={id}>
            <img src={id} alt={image} class={style.sponsorimg} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Carousel;
