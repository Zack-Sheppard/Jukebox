// modal

"use strict";

import * as React from "react";

interface ModalProps{
    display: boolean;
}

export default class Modal extends React.Component<ModalProps>{


    render(){
        return(
            <div className='modal-container'>
                <div className='modal'>
                <div className='modal-exit'> {/*Add on click to close*/}
                    <div className="center-text">X</div>
                </div>
                </div>
            </div>
        )
    }
}