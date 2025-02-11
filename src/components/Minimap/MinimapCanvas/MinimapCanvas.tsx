import { useEffect, useRef, useState } from "react";
import { log } from "../../../utils/utils";
import styles from "./MinimapCanvas.module.css"
import generateMinimapCanvas from "./generateMinimap";

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
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [checkRedraw, setCheckRedraw] = useState<boolean>(false);
  const [forceRedraw, setForceRedraw] = useState<boolean>(false);

  // logic to check for any queued redraws
  useEffect(() => {
    const checkPeriod = 2 * 1000
    setInterval(() => {
      setCheckRedraw((old:boolean)=> !old)
    }, checkPeriod)
  }, [])

  // On checkRedraw force redraw if queueRedraw=true
  useEffect(() => {
    if (queueRedraw) {
      setQueueRedraw(false)
      setForceRedraw(old => !old)
    }
  }, [checkRedraw])


  // Redraw the canvas if forceRedraw state changes.
  useEffect(() => {
    if (!containerRef.current) {
      log("container ref not rendered!")
      return 
    }
    if (!elementToMap) {
      log("elementToMap not rendered!")
      return
    }
    const container = containerRef.current
    setCanvasLoading(true);
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
