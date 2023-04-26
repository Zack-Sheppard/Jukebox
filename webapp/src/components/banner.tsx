
// Banner

"use strict";

import * as React from "react";

interface BannerProps {
  show: boolean,
  message: string,
  handleClose: any
}

const startFadeInNSec: number = 3;
let timerStopper: number;

export default class Banner extends React.Component<BannerProps,
                                                    { trig: boolean,
                                                      countdown: number }> {
  constructor(props: BannerProps) {
    super(props);
    this.state = {
      trig: true,
      countdown: startFadeInNSec
    };
    this.ctdwn = this.ctdwn.bind(this);
  }

  ctdwn() {
    if(this.state.countdown <= 0) {
      clearInterval(timerStopper);
      this.setState(({
        countdown: startFadeInNSec
      }));
      this.props.handleClose();
      clearInterval(timerStopper);
      this.setState(({
        trig: true
      }));
    }
    else {
      this.setState((state) => ({
        trig: false,
        countdown: state.countdown - 1
      }));
    }
  }

  render() {    
    let klassName: string = "banner";

    if(this.props.show && this.state.trig) {
      // start internal timer
      timerStopper = setInterval(this.ctdwn, 1000);
    }
    else if(!this.props.show) {
      klassName += " banner--hidden";
    }
    return (
      <div className={klassName}>
        <p>{this.props.message}</p>
      </div>
    );
  }
}
