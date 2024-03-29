
// Button

"use strict";

import * as React from "react";

interface ButtonProps {
  type: "button" | "reset" | "submit",
  onClick: any,
  enabled: boolean,
  host: boolean,
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
    let klassName = "button";
    if(this.props.host) {
      klassName += "--host";
    }
    return (
      <button className={klassName}
        type={this.props.type} // type="button", "reset", or "submit"
        onClick={this.props.onClick}
        disabled={!this.props.enabled}
      >
        {this.props.text}
      </button>
    );
  }
}
