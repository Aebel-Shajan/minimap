import Minimap from "../../components/Minimap/Minimap";
import { useEffect, useState } from "react";
import TestComponent from "./TestComponent/TestComponent";

const Home = () => {
  const [elementToMap, setElementToMap] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElementToMap(document.querySelector("#scroll-container") as HTMLElement);
  }, []);

  const randomColors = 
  Array.from({ length: 50 }, (_, index) => <TestComponent key={index} />)
  return (
    <div id="scroll-container">
      {randomColors}
      {elementToMap && <Minimap elementToMap={elementToMap}/>}
    </div>
  );
}
 
export default Home;