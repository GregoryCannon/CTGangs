import React, { Component } from "react";
import "./App.css";
import { getPairings, PlayerData, Pairing } from "../matcher/Matcher";
import { ResultDisplay } from "./ResultDisplay";
import InputForm from "./InputForm";

interface AppState {
  result: Pairing;
}

const NO_RESULT = { pairs: [], benchedPlayers: [] };

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      result: NO_RESULT,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(
    challengingPlayerData: Array<PlayerData>,
    defendingPlayerData: Array<PlayerData>
  ) {
    this.setState({
      result: getPairings(challengingPlayerData, defendingPlayerData),
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Welcome to Classic Tetris Gangs!</p>
        </header>

        <div id="page-body">
          <InputForm submitFunction={this.handleSubmit} />

          {/* Results output area */}
          {this.state.result == NO_RESULT ? (
            <div />
          ) : (
            <ResultDisplay result={this.state.result} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
