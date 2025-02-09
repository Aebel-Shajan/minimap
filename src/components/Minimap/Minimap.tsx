import { useEffect, useRef, useState } from "react";
import styles from "./Minimap.module.css"
import Slider from "./Slider/Slider";
import MinimapCanvas from "./MinimapCanvas/MinimapCanvas";
import { log } from "../../utils/utils";

const Minimap = (
  {
    elementToMap
  }:
    {
      elementToMap: HTMLElement | null
    }
) => {
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

    const minimapRect = minimap.getBoundingClientRect();
    const relativeMousePos = mouseY - minimapRect.top;
    const newScrollPos = (relativeMousePos + minimap.scrollTop) / mapScale - 0.5 * elementToMap.offsetHeight;

    elementToMap.scrollTo(0, newScrollPos);
  }

  // Add observers to look for changes in elementToMap and queue a redraw
  useEffect(() => {
    if (!elementToMap) return
    const childObserver = createChildObserver(elementToMap, () => setQueueRedraw(true))
    const sizeObserver = createSizeObserver(elementToMap,  () => setQueueRedraw(true))
    return () => {
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
      elementToMap.scrollTop +=  event.deltaY;
    }

    syncScroll()
    elementToMap.addEventListener("scroll", syncScroll);
    minimap.addEventListener("wheel", syncMinimapScroll);
    return () => {
      elementToMap.removeEventListener("scroll", syncScroll);
      minimap.removeEventListener("wheel", syncMinimapScroll)
    };
  }, [canvasLoading, show, elementToMap])

  useEffect(() => {
    if (!elementToMap) return
    setSliderHeight(mapScale * elementToMap.offsetHeight)
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
        <button>option</button>
      </div>
    </div>
  );
}

export default Minimap;


// 🤨
function createChildObserver(
  elementToObserve: HTMLElement,
  callback: CallableFunction
): MutationObserver {
  const mutationObserver = new MutationObserver(function(mutations) {
    const minimapComponent = document.querySelector("#minimap-component")
    if (!minimapComponent) return
    mutations.forEach(function(mutation) {
      const targetElement = mutation.target as HTMLElement;
      if (targetElement.id === "minimap-component" || minimapComponent.contains(targetElement)) return;
      callback()
      log(mutation);
    });
  });
  
  mutationObserver.observe(elementToObserve, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
    attributeOldValue: false,
    characterDataOldValue: false,
  });
  return mutationObserver
}


function createSizeObserver(
  elementToObserve: HTMLElement,
  callback: CallableFunction
): ResizeObserver {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      console.log("Resize observed:", entry);
    }
    callback()
  });

  resizeObserver.observe(elementToObserve);
  return resizeObserver
}