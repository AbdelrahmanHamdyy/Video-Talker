import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connectWithWebSocket } from "./utils/wsConnection/wsConnection";
import Dashboard from "./Dashboard/Dashboard";
import Login from "./Login/Login";

function App() {
  useEffect(() => {
    connectWithWebSocket();
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
