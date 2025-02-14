import { useEffect, useRef, useState } from "react";
import styles from "./Minimap.module.css"
import Slider from "./Slider/Slider";
import MinimapCanvas from "./MinimapCanvas/MinimapCanvas";
import { elementObserver, log } from "./utils";


/**
 * Minimap component that provides a visual representation of a larger element's scrollable area.
 * 
 * @param {Object} props - The properties object.
 * @param {HTMLElement | null} props.elementToMap - The HTML element to map in the minimap.
 * 
 * @returns {JSX.Element} The rendered Minimap component.
 * 
 * @component
 * 
 * @example
 * // Usage example:
 * <Minimap elementToMap={document.getElementById('content')} />
 * 
 * @remarks
 * This component includes a slider that can be dragged to scroll the mapped element.
 * It also observes changes in the mapped element's children and size to queue redraws.
 * 
 */
const Minimap = (
  {
    elementId
  }:
    {
      elementId: string
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

    const minimapRect = minimap.getBoundingClientRect();
    const relativeMousePos = mouseY - minimapRect.top;
    const newScrollPos = (relativeMousePos + minimap.scrollTop) / mapScale - 0.5 * elementToMap.offsetHeight;

    elementToMap.scrollTo(0, newScrollPos);
  }

  // Find element from id
  useEffect(() => {
    setElementToMap(document.getElementById(elementId))
    const observer = elementObserver(
      elementId,
      (id:string) => setElementToMap(document.getElementById(id)),
      () => setElementToMap(null)
    )

    return () => observer.disconnect();
  }, []);

  // Add observers to look for changes in elementToMap and queue a redraw
  useEffect(() => {
    if (!elementToMap) return
    log("observers attached!")
    const childObserver = createChildObserver(elementToMap, () => setQueueRedraw(true))
    const sizeObserver = createSizeObserver(elementToMap, () => setQueueRedraw(true))
    return () => {
      log("observers disconnected!")
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
    elementToMap.addEventListener("scroll", syncScroll);
    minimap.addEventListener("wheel", syncMinimapScroll);
    return () => {
      elementToMap.removeEventListener("scroll", syncScroll);
      minimap.removeEventListener("wheel", syncMinimapScroll)
    };
  }, [canvasLoading, show, elementToMap])

  // Update the sliderHeight when the mapScale and elementToMap is updated
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


/**
 * Creates a MutationObserver that observes changes to the child elements of a specified 
 * element. When a mutation occurs, the provided callback function is executed.
 *
 * @param {HTMLElement} elementToObserve - The element whose child elements will be 
 *  observed.
 * @param {CallableFunction} callback - The function to be called when a mutation is 
 *  observed.
 * @returns {MutationObserver} The created MutationObserver instance.
 * 
 * @remarks 🤨
 */
function createChildObserver(
  elementToObserve: HTMLElement,
  callback: CallableFunction
): MutationObserver {
  const mutationObserver = new MutationObserver(function (mutations) {
    const minimapComponent = document.querySelector("#minimap-component")
    if (!minimapComponent) return
    mutations.forEach(function (mutation) {
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


/**
 * Creates a ResizeObserver to observe size changes on a given HTML element and executes
 * a callback function when a resize is detected.
 *
 * @param {HTMLElement} elementToObserve - The HTML element to observe for size changes.
 * @param {CallableFunction} callback - The callback function to execute when a resize 
 *  is detected.
 * @returns {ResizeObserver} The created ResizeObserver instance.
 */
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
