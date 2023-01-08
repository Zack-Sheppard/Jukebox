
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

export default class Form extends React.Component<FormProps, {search: string}> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      search: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: any) {
    e.preventDefault();
    this.setState(() => ({
      search: e.target.value
    }));
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.postData(this.props.uri, {song: this.state.search}, this.props.onResponse);
    this.setState(() => ({
      search: ""
    }));
  }

  postData(url: string, data: any, cb: Function) {
    console.log("Sending to server:");
    console.log(data);
    const response = fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server responded with:");
        console.log(data);
        // this.setState(() => ({
        //   result: data.result
        // }));
        cb(data);
    });
    // catch
  }

  render() {
    return (
      <div className="form">  
        <div className="form-input">
          <input id="test"
            type="text"
            maxLength={this.props.maxLength}
            name={this.props.name}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
            value={this.state.search}/>
          <Button
            type="submit"
            text="Go"
            onClick={this.handleSubmit}
            enabled={true}
          />
        </div>
      </div>
    );
  }
}
