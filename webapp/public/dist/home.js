
"use strict";

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  render() {
    if (this.state.clicked) {
      return "Hello world!";
    }

    return e(
      "button",
      { onClick: () => this.setState({ clicked: true }) },
      "Click me!"
    );
  }
}

const domContainer = document.querySelector('#react_hello_world');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton));
