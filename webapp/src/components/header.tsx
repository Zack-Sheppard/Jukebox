
// Header

"use strict";

import * as React from "react";

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

  render() {    
    return (
      <div id="header">
        <h1><a href="/">Jukebox</a></h1>
      </div>
    );
  }
}
