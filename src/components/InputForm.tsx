import React, { Component } from "react";
import "./InputForm.css";
import { PlayerData } from "../matcher/OptimalMatcher";
import { fetchSpreadsheetData } from "../sheet-parser/sheet-parser";

interface InputFormProps {
  submitFunction: Function;
}

interface InputFormState {
  challengingGangPlayersText: string;
  defendingGangPlayersText: string;
  statusText: string;
}

class InputForm extends Component<InputFormProps, InputFormState> {
  constructor(props: InputFormProps) {
    super(props);
    this.state = {
      challengingGangPlayersText: "",
      defendingGangPlayersText: "",
      statusText: "",
    };
    this.handleDefendingGangPlayersChanged = this.handleDefendingGangPlayersChanged.bind(
      this
    );
    this.handleChallengingGangPlayersChanged = this.handleChallengingGangPlayersChanged.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChallengingGangPlayersChanged(event: any) {
    this.setState({ challengingGangPlayersText: event.target.value });
  }

  handleDefendingGangPlayersChanged(event: any) {
    this.setState({ defendingGangPlayersText: event.target.value });
  }

  handleSubmit(event: any) {
    event.preventDefault();

    // Fetch the player data from the spreadsheet
    fetchSpreadsheetData((spreadsheetPlayerData: Array<PlayerData>) => {
      console.log("\n\n Spreadsheet player data:", spreadsheetPlayerData);
      const challengingPlayerData = this.filterPlayerData(
        this.state.challengingGangPlayersText,
        spreadsheetPlayerData
      );
      const defendingPlayerData = this.filterPlayerData(
        this.state.defendingGangPlayersText,
        spreadsheetPlayerData
      );

      this.props.submitFunction(challengingPlayerData, defendingPlayerData);
    });
  }

  filterPlayerData(
    textareaInput: string,
    spreadsheetPlayerData: Array<PlayerData>
  ): Array<PlayerData> {
    const playerNames = textareaInput.split(/\n|,/).filter((x) => x.length > 0);
    const filteredPlayerData = [];
    const invalidPlayerNames = [];

    // Match the entered player names with their player data when possible
    for (let playerName of playerNames) {
      const filtered = spreadsheetPlayerData.filter(
        (x) => x.name.trim().toUpperCase() === playerName.trim().toUpperCase()
      );
      if (filtered.length === 1) {
        filteredPlayerData.push(filtered[0]);
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

    return filteredPlayerData;
  }

  render() {
    return (
      <div className="form-container">
        <p id="status-text">{this.state.statusText}</p>
        <form id="main-form" onSubmit={this.handleSubmit}>
          {/* Player list for challenging gang */}
          <div className="main-label">Participants from Challenging Gang</div>
          <div className="secondary-label">
            Put newlines or commas between names
          </div>
          <textarea
            className="participant-list-textarea"
            onChange={this.handleChallengingGangPlayersChanged}
          ></textarea>

          {/* Player list for defending gang */}
          <div className="main-label">Participants from Defending Gang</div>
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
