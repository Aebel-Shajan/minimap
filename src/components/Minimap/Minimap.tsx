import { useEffect, useRef, useState } from "react";
import styles from "./Minimap.module.css"
import Slider from "./Slider/Slider";
import MinimapCanvas from "./MinimapCanvas/MinimapCanvas";

const Minimap = (
  {
    elementToMap
  } :
  {
    elementToMap: HTMLElement | null
  }
) => {
  const [show, setShow] = useState(true)
  const [mapScale, setMapScale] = useState(1)
  const [sliderHeight, setSliderHeight] = useState(100)
  const [sliderTop, setSliderTop] = useState(0)
  const minimapRef = useRef<HTMLDivElement>(null);

  const showMinimap = () => setShow(true)
  const hideMinimap = () => setShow(false)

  useEffect(() => {
    if (!elementToMap) return
    const minimap = minimapRef.current;
    if (!minimap) {
      return;
    }

    // Create function which syncs the slider and minimap scroll to the elementToMap's scroll
    const syncScroll = () => {
      const scrollPercentage = elementToMap.scrollTop/ elementToMap.scrollHeight; 
      const newSliderTop = (scrollPercentage * elementToMap.scrollHeight) * mapScale;
      setSliderTop(newSliderTop);
      minimap.scrollTop = newSliderTop - (scrollPercentage * (minimap.clientHeight - (mapScale * elementToMap.offsetHeight)))
    };

    elementToMap.addEventListener("scroll", syncScroll);
    return () => {
      elementToMap.removeEventListener("scroll", syncScroll);
    };
  }, [show, mapScale, elementToMap])

  useEffect(() => {
    if (!elementToMap) return
    setSliderHeight(mapScale * elementToMap.offsetHeight)
  }, [mapScale, elementToMap])

  if (!show) {
    return (
      <div className={styles.hiddenContainer}>
          <button onClick={showMinimap}>show</button>
      </div>
    )
  }

  return (
    <div 
      id="minimap-component"
      className={styles.container}>
      <div
        className={styles.minimapCanvasContainer}
        ref={minimapRef}
      >
        <MinimapCanvas
          elementToMap={elementToMap}
          setMapScale={setMapScale}
        />
        {elementToMap && <Slider
          sliderHeight={sliderHeight}
          scrollTop={sliderTop}
        />}
      </div>
      <div className={styles.options}>
        <button onClick={hideMinimap}>close</button>
        <button>option</button>
      </div>
    </div>
  );
}

export default Minimap;
