
// Header

"use strict";

import * as React from "react";
import {DropDownMenu} from './DropDownMenu';

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
    } else {
      this.setState({
        clicked: false,
      });
    }
  }

  render() {    
    if(this.state.clicked == false){
      return (
        
          <div id="header">
            <h1><a href="/">Jukebox</a></h1>
            <div className="hamburger-box" onClick={()=> this.toggleMenu(this.state.clicked)}>
              <div className="burger-top">-</div>
              <div className="burger-middle">-</div>
              <div className="burger-bottom">-</div>
            </div>
          </div>
          
        
      );
    } else {
      return (
        <div id="header">
          <h1><a href="/">Jukebox</a></h1>
          <div className="hamburger-box" onClick={()=> this.toggleMenu(this.state.clicked)}>
            <div className="burger-x">X</div>
          </div>
          <DropDownMenu menuState = {this.state.clicked}/>
        </div>
      );
    }
  }
}
