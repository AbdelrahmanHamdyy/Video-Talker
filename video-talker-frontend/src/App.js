import { useEffect } from "react";
import "./App.css";
import { connectWithWebSocket } from "./utils/wsConnection/wsConnection";

function App() {
  useEffect(() => {
    connectWithWebSocket();
  }, []);

  return <div className="App">React App</div>;
}

export default App;
