
// Button

"use strict";

export default class Button extends React.Component {
  constructor(props) {
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
