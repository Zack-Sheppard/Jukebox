import * as React from "react";


interface DropDownProps{    
    menuState: boolean;
}


export class DropDownMenu extends React.Component<DropDownProps>{
    constructor(props: any){
        super(props);
    };

    
    render(){
        if (this.props.menuState == true){
            return(
                <>
                <div className="drop-down-menu">
                    <div className="drop-down-button">
                        <h1 className ="center-text">Account Info</h1>
                    </div>
                    <div className="drop-down-button">
                        <h1 className ="center-text">About Us</h1>
                    </div>
                    <div className ="drop-down-button">
                        <h1 className ="center-text">Tutorial</h1>
                    </div>
                </div>
                </>
            );
        }
    }
}