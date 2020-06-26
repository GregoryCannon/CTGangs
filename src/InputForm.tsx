import React, { Component } from "react";
import { PlayerData } from "./Matcher";
import "./InputForm.css";

interface InputFormProps {
  submitFunction: Function;
}

interface InputFormState {
  playerDataList: Array<PlayerData>;
  challengingGangPlayersText: string;
  defendingGangPlayersText: string;
  statusText: string;
}

class InputForm extends Component<InputFormProps, InputFormState> {
  constructor(props: InputFormProps) {
    super(props);
    this.state = {
      playerDataList: [],
      challengingGangPlayersText: "",
      defendingGangPlayersText: "",
      statusText: "",
    };
    this.handleSpreadsheetDataChange = this.handleSpreadsheetDataChange.bind(
      this
    );
    this.handleDefendingGangPlayersChanged = this.handleDefendingGangPlayersChanged.bind(
      this
    );
    this.handleChallengingGangPlayersChanged = this.handleChallengingGangPlayersChanged.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSpreadsheetDataChange(event: any) {
    const rowsRaw = event.target.value.split("\n");
    const playerDataList = rowsRaw.map((rowString: string) => {
      const tabSeparatedData = rowString.split("\t");
      return {
        id: parseInt(tabSeparatedData[0]),
        name: tabSeparatedData[1],
        rating: parseInt(tabSeparatedData[7]),
      };
    });
    console.log(playerDataList);
    this.setState({
      playerDataList,
    });
  }

  handleChallengingGangPlayersChanged(event: any) {
    this.setState({ challengingGangPlayersText: event.target.value });
  }

  handleDefendingGangPlayersChanged(event: any) {
    this.setState({ defendingGangPlayersText: event.target.value });
  }

  handleSubmit(event: any) {
    event.preventDefault();
    const challengingPlayerData = this.parsePlayerData(
      this.state.challengingGangPlayersText
    );
    const defendingPlayerData = this.parsePlayerData(
      this.state.defendingGangPlayersText
    );

    this.props.submitFunction(challengingPlayerData, defendingPlayerData);
  }

  parsePlayerData(textareaInput: string) {
    const playerNames = textareaInput.split("\n").filter((x) => x.length > 0);
    console.log("Defending players raw", playerNames);
    const playerDataList = [];
    for (let playerName of playerNames) {
      const filtered = this.state.playerDataList.filter(
        (x) => x.name.toUpperCase() === playerName.toUpperCase()
      );
      if (filtered.length === 1) {
        playerDataList.push(filtered[0]);
      } else {
        this.setState({
          statusText:
            this.state.statusText +
            "\nUnable to find player " +
            playerName +
            " in spreadsheet data",
        });
      }
    }
    return playerDataList;
  }

  render() {
    return (
      <div className="form-container">
        <p id="status-text">{this.state.statusText}</p>
        <form id="main-form" onSubmit={this.handleSubmit}>
          {/* Box to paste the player data from Google Sheets */}
          <div className="main-label">Spreadsheet Player Data</div>
          <div className="secondary-label">
            Make a box selecting all relevant players in the spreadsheet, and
            then copy paste it here
          </div>
          <textarea
            id="sheets-data-textarea"
            onChange={this.handleSpreadsheetDataChange}
          ></textarea>

          {/* Player list for challenging gang */}
          <div className="main-label">Participants from Challenging Gang</div>
          <div className="secondary-label">One per line, no commas</div>
          <textarea
            className="participant-list-textarea"
            onChange={this.handleChallengingGangPlayersChanged}
          ></textarea>

          {/* Player list for challenging gang */}
          <div className="main-label">Participants from Challenging Gang</div>
          <div className="secondary-label">One per line, no commas</div>
          <textarea
            className="participant-list-textarea"
            onChange={this.handleDefendingGangPlayersChanged}
          ></textarea>

          <input id="submit-button" type="submit" value="Get Matches!"></input>
        </form>
      </div>
    );
  }
}

export default InputForm;
