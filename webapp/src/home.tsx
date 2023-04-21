
"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {} from "react/next";

import Header from "./components/header";
import Button from "./components/button";
import Form from "./components/form";
import Modal from "./components/modal";

interface HomeState {
  roomToJoin: string;
  joinToggle: boolean;
}

class Home extends React.Component<{}, HomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      roomToJoin: "",
      joinToggle: false
    }
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  createRoom() {
    console.log("attempting to create room ...");
    window.location.href="/ca/create";
  }

  showModal() {
    console.log("showing join room modal...");
    this.setState({
      joinToggle: true
    });
  }

  joinRoom(res: any) {
    let room_to_join: string = "000";
    if(res.result == "ok" && res.room_to_join) {
      room_to_join = res.room_to_join;
      console.log("joining room " + room_to_join);
      window.location.href = "/room/" + room_to_join;
    }
    else {
      console.log("something isn't right...");
    }
  }

  closeModal() {
    console.log("closing join room modal...");
    this.setState({
      joinToggle: false
    });
  }

  render() {
    return (
      <div id="home">
        <Header
          host={false}
        />
        <div id="create-join">
          <Button
            enabled={true}
            host={true}
            onClick={this.createRoom}
            text="Create"
            type="button"
          />
          <div id="join">
            <Button
              enabled={true}
              host={false}
              onClick={this.showModal}
              text="Join"
              type="button"
            />
            <Modal
              title={"Join Room"}
              show={this.state.joinToggle}
              handleClose={this.closeModal}
            >
              <Form
                name="room"
                maxLength={3}
                placeholder="Room Code"
                onResponse={this.joinRoom}
                uri="/room"
              />
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Home/>);
