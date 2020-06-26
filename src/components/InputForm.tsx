import React, { Component } from "react";
import "./InputForm.css";
import { PlayerData } from "../matcher/OptimalMatcher";

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
        gangName: tabSeparatedData[2],
        rating: parseInt(tabSeparatedData[7]),
      };
    });
    console.log("Player data:", playerDataList);
    this.setState({
      playerDataList: playerDataList,
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

  parsePlayerData(textareaInput: string): Array<PlayerData> {
    const playerNames = textareaInput.split(/\n|,/).filter((x) => x.length > 0);
    const playerDataList = [];
    const invalidPlayerNames = [];

    // Match the entered player names with their player data when possible
    for (let playerName of playerNames) {
      const filtered = this.state.playerDataList.filter(
        (x) => x.name.trim().toUpperCase() === playerName.trim().toUpperCase()
      );
      if (filtered.length === 1) {
        playerDataList.push(filtered[0]);
      } else {
        invalidPlayerNames.push(playerName);
      }
    }

    // Show error message if there were invalid player names
    if (invalidPlayerNames.length > 0) {
      this.setState({
        statusText:
          "Unable to find spreadsheet data for: " +
          invalidPlayerNames.join(", "),
      });
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
          <div className="secondary-label">
            Put newlines or commas between names
          </div>
          <textarea
            className="participant-list-textarea"
            onChange={this.handleChallengingGangPlayersChanged}
          ></textarea>

          {/* Player list for challenging gang */}
          <div className="main-label">Participants from Challenging Gang</div>
          <div className="secondary-label">
            Put newlines or commas between names
          </div>
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
