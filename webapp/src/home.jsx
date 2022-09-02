
"use strict";

import Button from "./components/button"

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      clicked: true
    });
  }

  render() {
    if (this.state.clicked) {
      return "Hello world!";
    }
    return (
      <div>
        <Button
          enabled={true}
          onClick={this.handleClick}
          text="Click me!"
          type="button"
        >
        </Button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Home/>);
