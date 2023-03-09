
// Dropdown Menu

"use strict";

import * as React from "react";

const DISCORD_LINK = "https://discord.com/channels/1070729112844505198";

function DropdownButton(props: any) {
  let text: string = !props.toggle? props.defaultMsg : props.secondaryMsg;
  return(
    <div className="dropdown-button" onClick={props.onClick}>
      <h1 className ="center-text">{text}</h1>
    </div>
  );
}

interface DropdownProps {
  menuState: boolean;
}

export class DropdownMenu extends React.Component<DropdownProps,
                                                  {buttonToggles: boolean[]}> {
  constructor(props: DropdownProps) {
    super(props);
    this.state = {
      buttonToggles: [false, false]
    }
    this.toggleButtons = this.toggleButtons.bind(this);
  };

  newTab(url: string) {
    window.open(url, "_blank").focus();
  }

  toggleButtons(index: number) {
    console.log("changing button toggles...");
    let t: boolean[] = [this.state.buttonToggles[0],
                        this.state.buttonToggles[1]];
    t[index] = !t[index];
    this.setState(() => ({
      buttonToggles: t
    }));
  }

  render() {
    return(
      <div className="dropdown-menu">
        <DropdownButton
          defaultMsg="About Us"
          secondaryMsg="Coming Soon"
          toggle={this.state.buttonToggles[0]}
          onClick={() => this.toggleButtons(0)}
        />
        <DropdownButton
          defaultMsg="Tutorial"
          secondaryMsg="Coming Soon"
          toggle={this.state.buttonToggles[1]}
          onClick={() => this.toggleButtons(1)}
        />
        <div className="dropdown-button" id="discord-container">
          <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer">
            <img
              id="discord-logo"
              src="../img/discord-logo-white.png"
              alt="Discord"
            />
          </a>
        </div>
        <h1 id="version" className ="center-text">Version 0.0.6</h1>
      </div>
    );
  }
}
