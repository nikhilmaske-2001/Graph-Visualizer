import './App.css';
// import { BarGraph } from "./Demo";
import Network from "./Network";

function App() {
  return (
    <div className="App">
      <header className="App-header">  
        {/* <BarGraph/> */}
        <Network width={500} height={500}/>
      </header>
    </div>
  );
}

export default App;
