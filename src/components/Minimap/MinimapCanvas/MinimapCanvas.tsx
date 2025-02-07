import { memo, useEffect, useRef } from "react";
import { log } from "../../../utils/utils";
import styles from "./MinimapCanvas.module.css"
import generateMinimapCanvas from "./generateMinimap";

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
    // Removes minimap if it is in elementToMap
    const clonedMinimap = clonedElement.querySelector("#minimap-component")
    if (clonedMinimap) {
      clonedMinimap.remove()
    }
    
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

    })();

  }, [containerRef, elementToMap])



  return ( 
    <div 
      className={styles.container}
      ref={containerRef}></div>
   );
}
export default memo(MinimapCanvas);
