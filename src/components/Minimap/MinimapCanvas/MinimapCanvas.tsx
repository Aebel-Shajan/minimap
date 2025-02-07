import { memo, useEffect, useRef } from "react";
import { log } from "../../../utils/utils";
import styles from "./MinimapCanvas.module.css"

const MinimapCanvas = (
  {
    elementToMap
  } : 
  {
    elementToMap: HTMLElement | null
  }
) => {
  log("MinimapCanvas was rendered")
  const containerRef = useRef<HTMLDivElement>(null);

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
    const clonedElement = elementToMap.cloneNode(true) as HTMLElement
    const clonedMinimap = clonedElement.querySelector("#minimap-component")
    if (clonedMinimap) {
      clonedMinimap.remove()
    }

    container.innerHTML = ""
    container.appendChild(clonedElement)


  }, [containerRef])



  return ( 
    <div 
      className={styles.container}
      ref={containerRef}></div>
   );
}
export default memo(MinimapCanvas);
