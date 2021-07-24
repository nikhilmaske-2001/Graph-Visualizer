import React from 'react';
import './App.css';
import Network from "./Network";

function App() {
  const [inputValue, setInputValue] = React.useState("placeholder text");
  // Use default number of nodes = 3
  const [numNodes, setNumNodes] = React.useState(3);

  React.useEffect(() => {
    const parsed = parseInt(inputValue, 10);
    // if number of nodes are passed in the input field then change no of nodes
    if(!isNaN(parsed)) {
      setNumNodes(parsed);
    }

    console.log("Input value change");
  }, [inputValue]);

  return (
    <div className="App">
      <form action="/action_page.php">
        <label for="fname">First name: </label>
        <input
          type="text"
          id="fname"
          name="fname"
          value={inputValue}
          onChange={event => {
            setInputValue(event.target.value);
          }}
        />
      </form>
        <Network width={500} height={500} numNodes={numNodes}/>
    </div>
  );
}

export default App;
