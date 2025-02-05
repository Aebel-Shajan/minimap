import { useState } from "react";
import styles from "./Minimap.module.css"

const Minimap = () => {
  const [show, setShow] = useState(true)

  const showMinimap = () => setShow(true)
  const hideMinimap = () => setShow(false)

  if (!show) {
    return (
      <div className={styles.hiddenContainer}>
        
          <button onClick={showMinimap}>show</button>
        
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        <button onClick={hideMinimap}>close</button>
        <button>option</button>
      </div>
    </div>
  );
}

export default Minimap;