
"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {} from "react/next";

import Header from "./components/header";
import Button from "./components/button";
import Form from "./components/form";

function JoinRoomForm(props: any) {
  const displayForm: boolean = props.show;
  const formAction: any = props.onClick;

  if(displayForm) {
    return (
      <Form
        name="room"
        maxLength={3}
        placeholder="Room Code"
        onResponse={formAction}
        uri="/room"
      />
    );
  }
}

function JoinRoom(input: string) {
  // convert input to number string xyz
  // redirect to /room/xyz
}

function validateRoomCode() {

}

class Home extends React.Component<{}, {joinClicked: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { joinClicked: false };
    this.showForm = this.showForm.bind(this);
  }

  createRoom() {
    // perhaps modal warning that they must be signed up
    // - option to sign up :)
    console.log("attempting to create room ...");
    window.location.href="/ca/create";
  }

  showForm() {
    console.log("showing join room form...");
    this.setState({
      joinClicked: true
    });
  }

  joinRoom() {
    // TODO
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
              enabled={false}
              host={false}
              onClick={this.showForm}
              text="Join"
              type="button"
            />
            <JoinRoomForm
              show={this.state.joinClicked}
              onClick={this.joinRoom}
            />
          </div>
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Home/>);
