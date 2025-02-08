import styles from "./Slider.module.css"

const Slider = (
  {
    sliderHeight,
    scrollTop
  } : {
    sliderHeight: number,
    scrollTop: number
  }
) => {
  return (
    <div 
      style={{
        height: `${sliderHeight}px`,
        top: `${scrollTop}px`
      }}
      className={styles.slider}></div>
  );
}
 
export default Slider;