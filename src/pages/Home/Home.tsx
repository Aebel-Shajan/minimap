import Minimap from "../../components/Minimap/Minimap";

const RandomColor = ({height=100}) => {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return (
    <div style={{
        backgroundColor: randomColor,
        width: '100%',
        height: `${height}vh`
        }}
      >
    </div>
  )
}

import { useEffect, useState } from "react";

const Home = () => {
  const [elementToMap, setElementToMap] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElementToMap(document.querySelector("#scroll-container") as HTMLElement);
  }, []);

  const randomColors = 
  Array.from({ length: 5 }, (_, index) => <RandomColor key={index} />)
  return (
    <div id="scroll-container">
      {randomColors}
      {elementToMap && <Minimap elementToMap={elementToMap}/>}
    </div>
  );
}
 
export default Home;