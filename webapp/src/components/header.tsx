
// Header

"use strict";

import * as React from "react";
import { DropdownMenu } from "./dropdown-menu";

interface HeaderProps {
  host: boolean
}

export default class Header extends React.Component<HeaderProps,
                                                    { clicked: boolean }> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      clicked: false
    };
  }

  toggleMenu(state: boolean){
    if(state == false){
      this.setState({
        clicked: true,
      });
    }
    else {
      this.setState({
        clicked: false,
      });
    }
  }

  render() {    
    if(this.state.clicked == false){
      return (
        <div id="header">
          <h1 id="header-logo">
            <a href="/">Jukebox</a>
          </h1>
          <div className="hamburger-box"
               onClick={() => this.toggleMenu(this.state.clicked)}>
            <div id="burger-top">_</div>
            <div id="burger-mid">_</div>
            <div id="burger-bot">_</div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div id="header">
          <h1 id="header-logo">
            <a href="/">Jukebox</a>
          </h1>
          <div className="hamburger-box"
               onClick={() => this.toggleMenu(this.state.clicked)}>
            <div id="burger-x">X</div>
          </div>
          <DropdownMenu menuState = {this.state.clicked}/>
        </div>
      );
    }
  }
}
