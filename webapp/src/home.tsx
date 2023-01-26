
"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {} from "react/next";

import Header from "./components/header";
import Button from "./components/button";

function Greeting(props: any) {
  const isClicked: boolean = props.isClicked;
  const onClick: Function = props.onClick;
  if(isClicked) {
    return (
      <p>coming soon ...</p>
    );
  }
  else {
    return (
      <Button
        enabled={true}
        onClick={onClick}
        text="Click me!"
        type="button"
      />
    );
  }
}

class Home extends React.Component<{}, {clicked: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { clicked: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      clicked: true
    });
  }

  render() {
    return (
      <div id="home">
        <Header
          host={false}
        />
        <div id="greeting">
          <Greeting
            isClicked={this.state.clicked}
            onClick={this.handleClick}
          />
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Home/>);
