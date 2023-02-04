
"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {} from "react/next";

import Button from "./components/button";

class Host extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
    this.editRoom = this.editRoom.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.getQueue = this.getQueue.bind(this);
  }

  editRoom() {
    console.log("room button clicked");
    // no op for a while
  }

  getDevices() {
    // send GET to backend
    console.log("sending fetch!");
  }

  getQueue() {
    console.log("getting queue!");
  }

  render() {
    return (
    <div id="host">
      <Button
        enabled={false}
        onClick={this.editRoom}
        text="Room 123"
        type="button"
      />
      <Button
        enabled={true}
        onClick={this.getDevices}
        text="Get Devices"
        type="button"
      />
      <Button
        enabled={true}
        onClick={this.getQueue}
        text="Get Queue"
        type="button"
      />
    </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Host/>);
