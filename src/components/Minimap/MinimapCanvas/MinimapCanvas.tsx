import { memo, useEffect, useRef, useState } from "react";
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
  // log("MinimapCanvas was rendered")
  const containerRef = useRef<HTMLDivElement>(null);
  const [period, setPeriod] = useState<boolean>(false);
  const [refreshState, setRefreshState] = useState<boolean>(false);

  useEffect(() => {
    const refreshPeriod = 2 * 1000
    setInterval(() => {
      setPeriod((old:boolean)=> !old)
    }, refreshPeriod)
  }, [])

  useEffect(() => {
    if (queueRedraw) {
      setQueueRedraw(false)
      setRefreshState(old => !old)
    }
  }, [period])

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

  }, [containerRef, elementToMap, refreshState])



  return ( 
    <div 
      className={styles.container}
      ref={containerRef}></div>
   );
}
export default memo(MinimapCanvas);
