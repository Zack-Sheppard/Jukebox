
// Dropdown Menu

"use strict";

import * as React from "react";

const DISCORD_LINK = "https://discord.com/channels/1070729112844505198";

interface DropdownProps{    
  menuState: boolean;
}

export class DropdownMenu extends React.Component<DropdownProps>{
  constructor(props: any){
    super(props);
  };
  
  newTab(url: string){
    window.open(url, "_blank").focus();
  }

  render(){
    return(
      <div className="dropdown-menu">
        <div className="dropdown-button">
          <h1 className ="center-text">Account Info</h1>
        </div>
        <div className="dropdown-button">
          <h1 className ="center-text">About Us</h1>
        </div>
        <div className ="dropdown-button">
          <h1 className ="center-text">Tutorial</h1>
        </div>
        <div className="dropdown-button"
             onClick ={() => this.newTab(DISCORD_LINK)}
        >
          <h1 className ="center-text">Discord</h1>
        </div>
      </div>
    );
  }
}
