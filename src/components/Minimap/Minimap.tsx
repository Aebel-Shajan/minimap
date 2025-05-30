import { useEffect, useRef, useState } from "react";
import styles from "./Minimap.module.css"
import Slider from "./Slider/Slider";
import MinimapCanvas from "./MinimapCanvas/MinimapCanvas";
import { createChildObserver, createSizeObserver, elementObserver } from "./utils";


/**
 * Minimap component that provides a visual representation of a larger element's scrollable area.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.elementSelector - The selector of the HTML element to map to the minimap.
 * 
 * @returns {JSX.Element} The rendered Minimap component.
 * 
 * @component
 * 
 * @remarks
 * This component includes a slider that can be dragged to scroll the mapped element.
 * It also observes changes in the mapped element's children and size to queue redraws.
 * 
 */
const Minimap = (
  {
    elementSelector
  }:
    {
      elementSelector: string
    }
) => {
  const [elementToMap, setElementToMap] = useState<HTMLElement | null>(null);
  const [show, setShow] = useState(true)
  const [mapScale, setMapScale] = useState(1)
  const [sliderHeight, setSliderHeight] = useState(100)
  const [sliderTop, setSliderTop] = useState(0)
  const [canvasLoading, setCanvasLoading] = useState(false)
  const [queueRedraw, setQueueRedraw] = useState(false)

  const minimapRef = useRef<HTMLDivElement>(null);

  const showMinimap = () => setShow(true)
  const hideMinimap = () => setShow(false)

  // Function which handles drag scrolling of the slider.
  function handleSliderDrag(mouseY: number) {
    const minimap = minimapRef.current;
    if (!minimap || !elementToMap) return;
    let viewportHeight = elementToMap.offsetHeight
    if (elementSelector === "html") {
      viewportHeight = window.innerHeight
    }
    const minimapRect = minimap.getBoundingClientRect();
    const relativeMousePos = mouseY - minimapRect.top;
    const newScrollPos = (relativeMousePos + minimap.scrollTop) / mapScale - 0.5 * viewportHeight;
    elementToMap.scrollTo(0, newScrollPos);
  }

  function handleQueueRedraw() {
    setQueueRedraw(true)
  }

  // Find element from id
  useEffect(() => {
    setElementToMap(document.querySelector(elementSelector) as HTMLElement)
    const observer = elementObserver(
      elementSelector,
      (selector: string) => setElementToMap(document.querySelector(selector) as HTMLElement),
      () => setElementToMap(null)
    )

    return () => observer.disconnect();
  }, [elementSelector]);

  // Add observers to look for changes in elementToMap and queue a redraw
  useEffect(() => {
    if (!elementToMap) return
    console.log("observers attached!")
    const childObserver = createChildObserver(elementToMap, handleQueueRedraw)
    const sizeObserver = createSizeObserver(elementToMap, handleQueueRedraw)
    return () => {
      console.log("observers disconnected!")
      childObserver.disconnect();
      sizeObserver.disconnect()
    };
  }, [elementToMap])


  // Add event listeners to listen to scroll events of elementToMap
  useEffect(() => {
    if (!elementToMap) return
    const minimap = minimapRef.current;
    if (!minimap) {
      return;
    }

    // Create function which syncs the slider and minimap scroll to the elementToMap's scroll
    const syncScroll = () => {
      const scrollPercentage = elementToMap.scrollTop / elementToMap.scrollHeight;
      const newSliderTop = (scrollPercentage * elementToMap.scrollHeight) * mapScale;
      setSliderTop(newSliderTop);
      minimap.scrollTop = newSliderTop - (scrollPercentage * (minimap.clientHeight - (mapScale * elementToMap.offsetHeight)))
    };
    const syncMinimapScroll = (event: WheelEvent) => {
      event.preventDefault(); // Prevents default scrolling behavior
      elementToMap.scrollTop += event.deltaY;
    }

    // Add event listenters to the elementToMap and minimap elements to handle scrolling
    //  in both.
    syncScroll()
    if (elementSelector === "html") {
      window.addEventListener("scroll", syncScroll);
    } else {
      elementToMap.addEventListener("scroll", syncScroll);
    }
    minimap.addEventListener("wheel", syncMinimapScroll);
    return () => {
      if (elementSelector === "html") {
        window.removeEventListener("scroll", syncScroll);
      } else {
        elementToMap.removeEventListener("scroll", syncScroll);
      }
      minimap.removeEventListener("wheel", syncMinimapScroll)
    };
  }, [canvasLoading, show, elementToMap])

  // Update the sliderHeight when the mapScale and elementToMap is updated
  useEffect(() => {
    if (!elementToMap) return
    if (elementSelector === "html") {
      setSliderHeight(mapScale * window.innerHeight)
    } else {
      setSliderHeight(mapScale * elementToMap.offsetHeight)
    }
  }, [mapScale, elementToMap])


  // JSX 
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
          queueRedraw={queueRedraw}
          setQueueRedraw={setQueueRedraw}
          elementToMap={elementToMap}
          setMapScale={setMapScale}
          setCanvasLoading={setCanvasLoading}
        />
        {elementToMap && <Slider
          sliderHeight={sliderHeight}
          scrollTop={sliderTop}
          handleDrag={handleSliderDrag}
        />}
      </div>
      <div className={styles.options}>
        <button onClick={hideMinimap}>close</button>
        <button onClick={handleQueueRedraw} disabled={queueRedraw}>Refresh</button>
      </div>
    </div>
  );
}

export default Minimap;
