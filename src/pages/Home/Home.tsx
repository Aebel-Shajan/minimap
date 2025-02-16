import Minimap from "../../components/Minimap/Minimap";
import { useState } from "react";
import TestComponent from "./TestComponent/TestComponent";
import styles from "./Home.module.css"
import CollapsibleTree from "../../components/CollapsibleTree/CollapsibleTree";

const Home = () => {
  const [show, setShow] = useState(false)

  const randomColors = Array.from(
    { length: 10 }, 
    (_, index) => <TestComponent key={index} />
  )
  
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
      <Minimap elementSelector="html" />
    </>
  );
}

export default Home;
