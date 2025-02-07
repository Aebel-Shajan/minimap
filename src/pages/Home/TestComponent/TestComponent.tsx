import styles from "./TestComponent.module.css"

const TestComponent = ({height=100}) => {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return (
    <div 
      className={styles.container}
      style={{
        backgroundColor: randomColor,
        height: `${height}vh`
      }}
      >
        <p className={styles.textBlack}>
          Hello world, this is a really long paragraph that goes to the very edge of the
           page, demonstrating how text can span across the entire width of the 
           container, and it keeps going to show how content can overflow and still 
           be contained within the boundaries of the parent element, ensuring that 
           the layout remains consistent and visually appealing.
        </p>
        <p className={styles.textWhite}>
          Hello world, this is a really long paragraph that goes to the very edge of the
           page, demonstrating how text can span across the entire width of the 
           container, and it keeps going to show how content can overflow and still 
           be contained within the boundaries of the parent element, ensuring that 
           the layout remains consistent and visually appealing.
        </p>
        <div className={styles.box}/>
        <div className={styles.circle} />
        <div className={styles.triangle} />
        <img 
          className={styles.img}
          src="https://picsum.photos/200" />
        <img 
          className={styles.img}
          src="https://picsum.photos/500/300" />
    </div>
  )
}

export default TestComponent