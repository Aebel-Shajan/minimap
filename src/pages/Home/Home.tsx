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

const Home = () => {
  const randomColors = 
  Array.from({ length: 5 }, (_, index) => <RandomColor key={index} />)
  return (
    <div>
      {randomColors}
      <Minimap />
    </div>
  );
}
 
export default Home;