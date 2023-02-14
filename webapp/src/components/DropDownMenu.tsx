import * as React from "react";


interface DropDownProps{    
    menuState: boolean;
}


export class DropDownMenu extends React.Component<DropDownProps>{
    constructor(props: any){
        super(props);
    };

    newTab(url: string){
        window.open(url, '_blank').focus();
    }
    
    render(){
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
                <div onClick ={()=>this.newTab('https://discord.com/channels/1070729112844505198/1070729112844505201')}className="drop-down-button">
                    <h1 className ="center-text">Discord</h1>
                </div>
            </div>
            </>
        );
    }
}