import { useEffect, useRef, useState } from "react";
import { log } from "../utils";
import styles from "./MinimapCanvas.module.css"
import generateMinimapCanvas from "./generateMinimap";


/**
 * MinimapCanvas component is responsible for rendering a minimap of a given HTML element.
 * It periodically checks for any queued redraws and forces a redraw if necessary.
 * 
 * @param {Object} props - The properties object.
 * @param {HTMLElement | null} props.elementToMap - The HTML element to generate the minimap for.
 * @param {CallableFunction} props.setMapScale - Function to track the scale of the minimap.
 * @param {CallableFunction} props.setCanvasLoading - Function to track the loading state of the canvas.
 * @param {boolean} props.queueRedraw - Input boolean which signals if the canvas should be redrawn.
 * @param {CallableFunction} props.setQueueRedraw - Function used to reset the queue after canvas is drawn.
 * 
 * @returns {JSX.Element} The rendered MinimapCanvas component.
 * 
 * @component
 * 
 */
const MinimapCanvas = (
  {
    elementToMap,
    setMapScale,
    setCanvasLoading,
    queueRedraw,
    setQueueRedraw
  } : 
  {
    elementToMap: HTMLElement | null,
    setMapScale: CallableFunction,
    setCanvasLoading: CallableFunction
    queueRedraw: boolean,
    setQueueRedraw: CallableFunction
  }
): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [checkRedraw, setCheckRedraw] = useState<boolean>(false);
  const [forceRedraw, setForceRedraw] = useState<boolean>(false);
  // logic to check for any queued redraws
  useEffect(() => {
    const checkPeriod = 2 * 1000
    const interval = setInterval(() => {
      setCheckRedraw((old:boolean)=> !old)
    }, checkPeriod)
    return (() => clearInterval(interval))
  }, [])

  // On checkRedraw force redraw if queueRedraw=true
  useEffect(() => {
    log("redraw checked")
    if (queueRedraw) {
      setQueueRedraw(false)
      setForceRedraw(old => !old)
    }
  }, [checkRedraw])


  // Redraw the canvas if forceRedraw state changes.
  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      log("container ref not rendered!")
      return 
    }
    if (!elementToMap) {
      log("elementToMap not rendered!")
      container.innerHTML = ""
      return
    }
    setCanvasLoading(true);

    // Async function which draws the canvas inside the container.
    (async () => {
      log("Canvas drawn")
      const canvas = await generateMinimapCanvas(
        elementToMap,
        {
          ignoreElements(element: Element) {
              return element.id == "minimap-component"
          },
          windowHeight: window.innerHeight,
        },
      );
      container.innerHTML = ""
      container.appendChild(canvas)
      const scale = container.clientWidth / canvas.offsetWidth;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${scale * canvas.clientHeight}px`;
      setMapScale(scale)
      setCanvasLoading(false)
    })();

  }, [elementToMap, forceRedraw])



  return ( 
    <div 
      className={styles.container}
      ref={containerRef}></div>
   );
}
export default MinimapCanvas;
