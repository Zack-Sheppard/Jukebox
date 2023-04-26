
"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {} from "react/next";

import Header from "./components/header";
import Button from "./components/button";
import Form from "./components/form";
import Banner from "./components/banner";

const url: string = window.location.href;
const urlSearchParams = new URLSearchParams(window.location.search);
const roomNumber: string = urlSearchParams.get("room");

class SpotifyTrack {
  trackName: string;
  artistName: string;
  imageUrl: string;
  spotifyID: string;

  constructor(trackName: string,
              artistName: string,
              imageUrl: string,
              spotifyID: string) {
    this.trackName = trackName;
    this.artistName = artistName;
    this.imageUrl = imageUrl;
    this.spotifyID = spotifyID;
  }
}

function SongRow(props: any) {
  return(
    <tr onClick={props.onClick}>
      <td>
        <img src={props.image} alt="img" width="64" height="64"/>
      </td>
      <td>
        <p className="artist-name">{props.artistName}</p>
        <p className="song-name">{props.trackName}</p>
      </td>
    </tr>
  );
}

interface SearchResultProps {
  isSearching: boolean,
  results: any,
  onClick: ((s: SpotifyTrack) => any)
}

class SearchResult extends React.Component<SearchResultProps> {
  constructor(props: SearchResultProps) {
    super(props);
  }

  renderRow(i: number) {
    let t = this.props.results[i];
    let track = new SpotifyTrack(t.trackName,
                                 t.artistName,
                                 t.imageUrl,
                                 t.spotifyID);
    return(
      <SongRow
        key={i.toString()}
        onClick={() => this.props.onClick(track)}
        spotifyID={t.spotifyID}
        image={t.imageUrl}
        trackName={t.trackName}
        artistName={t.artistName}
      />
    );
  }

  render() {
    if(this.props.isSearching) {
      console.log("Trying to render N rows:");
      console.log(this.props.results.length);
      let rows = [];
      for(let i = 0; i < this.props.results.length; i++) {
        rows.push(this.renderRow(i));
      }
      if(this.props.results.length == 0) {
        return(
          <p id="search-song-result">
            Didn't find any songs!
          </p>
        );
      }
      else {
        return(
          <table id="search-song-result">
            <tbody>
              {rows}
            </tbody>
          </table>
        );
      }
    }
    return null;
  }
}

class Host extends React.Component<{},
                                   {searching: boolean,
                                    search: string,
                                    searchResults: any[],
                                    showBanner: boolean,
                                    bannerMsg: string}> {
  constructor(props: any) {
    super(props);
    this.state = {
      searching: false,
      search: "",
      searchResults: [],
      showBanner: false,
      bannerMsg: ""
    };
    this.handleSearchRes = this.handleSearchRes.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.copyInviteLink = this.copyInviteLink.bind(this);
    this.hideBanner = this.hideBanner.bind(this);
    this.showBanner = this.showBanner.bind(this);
  }

  showBanner(msg: string) {
    this.setState(() => ({
      showBanner: true,
      bannerMsg: msg
    }));
  }

  hideBanner() {
    this.setState(() => ({
      showBanner: false
    }));
  }

  copyInviteLink() {
    navigator.clipboard.writeText(url);
    this.showBanner("URL copied to clipboard!");
  }

  handleSearchRes(res: any) {
    let resultArray = res.result;
    console.log("number of incoming results:");
    console.log(resultArray.length);
    let spotifyTracks = new Array(resultArray.length);

    for(let i = 0; i < resultArray.length; i++) {
      // song title, artist name, image url, Spotify ID
      spotifyTracks[i] = new SpotifyTrack(
        resultArray[i].name,
        resultArray[i].artists[0].name,
        resultArray[i].album.images[0].url,
        resultArray[i].id
      );
    }
    console.log("displaying search results:");
    this.setState(() => ({
      searching: true,
      search: "",
      searchResults: spotifyTracks,
    }));
  }

  addToQueue(track: SpotifyTrack) {
    this.setState(() => ({
      searching: false
    }));
    console.log("adding to queue: " + track.trackName);
    fetch(`/room/${roomNumber}/add?songID=${track.spotifyID}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("bad network response");
      }
      return response.json();
    })
    .then(data => {
      console.log("server responded with:");
      console.log(data);
    })
    .catch(error => {
      console.log("there was an error:", error);
      // can parse error and display via banner
    });
  }

  render() {
    return (
    <div id="room">
      <Header
        host={true}
      />
      <div id="room-num">
        <p>Room</p>
        <Button
          enabled={true}
          host={true}
          onClick={this.copyInviteLink}
          text={roomNumber}
          type="button"
        />
      </div>
      <Form
        name="song"
        maxLength={48}
        placeholder="Search for a song"
        onResponse={this.handleSearchRes}
        uri="/spotify/search"
      />
      <SearchResult
        onClick={spotifyTrack => this.addToQueue(spotifyTrack)}
        isSearching={this.state.searching}
        results={this.state.searchResults}
      />
      <Banner
        show={this.state.showBanner}
        message={this.state.bannerMsg}
        handleClose={this.hideBanner}
      />
    </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Host/>);
