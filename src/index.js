import React from "react";
import ReactDOM from "react-dom";
import {Lines} from "react-preloaders";
import App from "./components/App";
import "./App.css";
ReactDOM.render(<React.Fragment>
  <App/>
  <Lines time={500} animation="slide"/>
</React.Fragment>, document.querySelector("#root"));
