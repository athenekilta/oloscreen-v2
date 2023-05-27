import style from './style.css';

const Progress = () => {
  return (
    <div class={style.progress} style={{ position: 'fixed' }}>
      <div class={style.color} />
    </div>
  );
};

export default Progress;
