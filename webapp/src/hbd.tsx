
"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {} from "react/next";

import Form from "./components/form";

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

class SearchResult extends React.Component<SearchResultProps, {something: string}> {
  constructor(props: SearchResultProps) {
    super(props);
    this.state = {
      something: "",
    };
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
                                    searchResults: any[]}> {
  constructor(props: any) {
    super(props);
    this.state = {
      searching: false,
      search: "",
      searchResults: [],
    };
    this.handleSearchRes = this.handleSearchRes.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
  }

  handleSearchRes(res: any) {
    // check for error TODO
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
    fetch(`https://myjukebox.ca/add?songID=${track.spotifyID}`) // !!!!!
    .then(response => response.json())
    .then(data => {
      console.log("server responded with:");
      console.log(data);
    })
    .catch(error => {
      console.log("there was an error :s");
      console.log(error);
    });
  }

  render() {
    return (
    <div id="hbd">
      <h2>Happy Birthday Justin!</h2>
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
    </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Host/>);
