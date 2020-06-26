import React from "react";
import "./ResultDisplay.css";
import {
  Pairing,
  Pair,
  BenchedPlayer,
  PlayerData,
} from "../matcher/OptimalMatcher";

interface ResultDisplayProps {
  result: Pairing;
}

export function ResultDisplay(props: ResultDisplayProps) {
  console.log("ResultDisplay props", props);
  return (
    <div className="result-container">
      <h2 id="result-title">Results</h2>

      {/* Matches */}
      <h3 className="result-section-title">Matches</h3>
      {props.result.pairs.length > 0 ? (
        <table id="matches-table">
          <tbody>
            {props.result.pairs.map((pair: Pair) => (
              <tr>
                <td>{pair.aPlayer.name + " vs. " + pair.bPlayer.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <em>No matches possible!</em>
      )}

      {/* Benched Players */}
      {props.result.benchedPlayers.length > 0 ? (
        <div>
          <h3 className="result-section-title">Benched Players</h3>
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Gang</th>
                <th>Could Sub For</th>
              </tr>
            </thead>
            <tbody>
              {props.result.benchedPlayers.map(
                (benchedPlayer: BenchedPlayer) => (
                  <tr>
                    <td>{benchedPlayer.playerData.name}</td>
                    <td>{benchedPlayer.playerData.gangName}</td>
                    <td>
                      {benchedPlayer.legalSubstitutions.length > 0 ? (
                        benchedPlayer.legalSubstitutions.map(
                          (sub: PlayerData) => <div>{sub.name}</div>
                        )
                      ) : (
                        <em>None possible</em>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
