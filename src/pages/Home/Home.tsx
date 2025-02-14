import Minimap from "../../components/Minimap/Minimap";
import { useEffect, useState } from "react";
import TestComponent from "./TestComponent/TestComponent";
import styles from "./Home.module.css"
import CollapsibleTree from "../../components/CollapsibleTree/CollapsibleTree";

const Home = () => {
  const [elementToMap, setElementToMap] = useState<HTMLElement | null>(null);
  const [show, setShow] = useState(false)

  // Find element from id
  useEffect(() => {
    setElementToMap(document.getElementById("scroll-container"))
    const observer = elementObserver(
      "scroll-container",
      (id:string) => setElementToMap(document.getElementById(id)),
      () => setElementToMap(null)
    )

    return () => observer.disconnect();
  }, []);

  const randomColors =
    Array.from({ length: 10 }, (_, index) => <TestComponent key={index} />)
  return (
    <>
      <button onClick={() => setShow(old => !old)}>
        {show ? "hide" : "show"}
      </button>
      {show &&
        <div
          id="scroll-container"
          className={styles.scrollContainer}
        >
          <div>
            <CollapsibleTree />
          </div>
          {randomColors}
        </div>
      }
      <Minimap elementToMap={elementToMap} />
    </>
  );
}

export default Home;



function elementObserver(
  elementId: string,
  onElementAdd: CallableFunction,
  onElementRemove: CallableFunction
): MutationObserver {
  const observer = new MutationObserver((mutationsList, ) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check for added nodes
        mutation.addedNodes.forEach((node) => {
          if ((node as HTMLElement).id === elementId) {
            console.log(`Element with ID ${elementId} was added to the DOM.`);
            onElementAdd(elementId)
          }
        });

        // Check for removed nodes
        mutation.removedNodes.forEach(node => {
          if ((node as HTMLElement).id === elementId) {
            console.log(`Element with ID ${elementId} was removed from the DOM.`);
            onElementRemove()
          }
        });
      }
    }
  });

  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
  return observer
}
