
// Form

"use strict";

import * as React from "react";

import Button from "./button";

interface FormProps {
  name: string,
  uri: string,
  placeholder: string,
  maxLength: number,
  onResponse: Function
}

export default class Form extends React.Component<FormProps, {value: string}> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: any) {
    e.preventDefault();
    this.setState(() => ({
      value: e.target.value
    }));
  }

  handleSubmit(e: any) {
    e.preventDefault();
    let label: string = this.props.name;
    let payload = {
      [label]: this.state.value
    };
    this.postData(this.props.uri, payload, this.props.onResponse);
    this.setState(() => ({
      value: ""
    }));
  }

  postData(url: string, data: any, cb: Function) {
    console.log("Sending to server:");
    console.log(data);
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(data)
    })
    .then(response => {
      if(!response.ok) {
        throw new Error("Bad network response");
      }
      return response.json();
    })
    .then(data => {
      console.log("Server responded with:");
      console.log(data);
      cb(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>  
        <div className="form-input">
          <input id="test"
            type="text"
            maxLength={this.props.maxLength}
            name={this.props.name}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
            value={this.state.value}/>
          <Button
            type="submit"
            text="Go"
            onClick={this.handleSubmit}
            enabled={true}
            host={false}
          />
        </div>
      </form>
    );
  }
}
