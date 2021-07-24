import React from 'react';
import './App.css';
import Network from "./Network";

function parseInputValue(text) {
  // Update the nodes
}

function App() {
  const [inputValue, setInputValue] = React.useState("placeholder text");

  React.useEffect(() => {
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
        <Network width={500} height={500}/>
    </div>
  );
}

export default App;
