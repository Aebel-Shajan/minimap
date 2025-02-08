import { useEffect, useState } from "react";
import styles from "./Slider.module.css"

const Slider = (
  {
    sliderHeight,
    scrollTop,
    handleDrag
  } : {
    sliderHeight: number,
    scrollTop: number,
    handleDrag: CallableFunction
  }
) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseY, setMouseY] = useState<number>(0)

  // on initial render
  useEffect(() => {
    function updateMouseDown() {
      setMouseDown(false)
    }
    function updateMouseY(e: MouseEvent) {
      setMouseY(e.clientY)
    }
    window.addEventListener("mouseup", updateMouseDown)
    window.addEventListener("mousemove", updateMouseY)
    return () => {
      window.removeEventListener("mouseup", updateMouseDown)
      window.removeEventListener("mousemove", updateMouseY)
    }
  }, [])

  useEffect(() => {
    if (mouseDown) {
      handleDrag(mouseY)
    }
  }, [mouseDown, handleDrag, mouseY])

  return (
    <div 
      style={{
        height: `${sliderHeight}px`,
        top: `${scrollTop}px`
      }}
      className={styles.slider}
      onMouseDown={() => setMouseDown(true)}
    ></div>
  );
}
 
export default Slider;