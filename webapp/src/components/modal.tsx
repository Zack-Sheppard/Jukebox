
// Modal

"use strict";

import * as React from "react";

interface ModalProps {
  children: any;
  title: string;
  show: boolean;
  handleClose: any;
}

export default class Modal extends React.Component<ModalProps> {
  constructor(props: ModalProps) {
    super(props);
  }

  render(){
    if(this.props.show){
      return(
        <div className="modal-container">
          <div className="modal">
            <div className="modal-title">
              {this.props.title} 
            </div>
            <div className="modal-content">
              {this.props.children}
            </div>
            <div className="modal-exit" onClick={this.props.handleClose}>
              x
            </div>
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}
