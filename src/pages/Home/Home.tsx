import Minimap from "../../components/Minimap/Minimap";
import { useEffect, useState } from "react";
import TestComponent from "./TestComponent/TestComponent";
import styles from "./Home.module.css"
import CollapsibleTree from "../../components/CollapsibleTree/CollapsibleTree";

const Home = () => {
  const [elementToMap, setElementToMap] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElementToMap(document.querySelector("#scroll-container") as HTMLElement);
  }, []);

  const randomColors = 
  Array.from({ length: 10 }, (_, index) => <TestComponent key={index} />)
  return (
    <div 
      id="scroll-container"
      className={styles.scrollContainer}
    >
      <div>
        <CollapsibleTree />
      </div>
      {randomColors}
      {elementToMap && <Minimap elementToMap={elementToMap}/>}
    </div>
  );
}
 
export default Home;