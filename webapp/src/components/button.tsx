
// Button

"use strict";

import * as React from "react";

interface ButtonProps {
  type: any,
  onClick: any,
  enabled: boolean,
  text: string
}

export default class Button extends React.Component<ButtonProps,
                                                    { clicked: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      clicked: false
    };
  }

  render() {    
    return (
      <button className="button"
        type={this.props.type} // type="button", "reset", or "submit"
        onClick={this.props.onClick}
        disabled={!this.props.enabled}
      >
        {this.props.text}
      </button>
    );
  }
}
