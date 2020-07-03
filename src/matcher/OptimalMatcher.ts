import { testListA, testListB } from "./MatcherConstants";

var munkres = require("munkres-js");

export interface PlayerData {
  id: number;
  name: string;
  rating: number;
  gangName: string;
}

export interface BenchedPlayer {
  playerData: PlayerData;
  legalSubstitutions: Array<PlayerData>;
}

export interface Pair {
  aPlayer: PlayerData;
  bPlayer: PlayerData;
}

export interface Pairing {
  pairs: Array<Pair>;
  benchedPlayers: Array<BenchedPlayer>;
}

const DUMMY_PLAYER: PlayerData = {
  id: -1,
  name: "dummy player",
  rating: -1,
  gangName: "",
};

const NON_MATCH_COST = 10000; // The penalty if two players who can't play are matched (i.e. they both get benched)
const ALLOWED_RATING_GAP = 200;

function canPlay(aPlayer: PlayerData, bPlayer: PlayerData) {
  return (
    aPlayer !== DUMMY_PLAYER &&
    bPlayer !== DUMMY_PLAYER &&
    Math.abs(aPlayer.rating - bPlayer.rating) <= ALLOWED_RATING_GAP
  );
}

function benchPlayer(player: PlayerData, pairing: Pairing) {
  pairing.benchedPlayers.push({
    playerData: player,
    legalSubstitutions: [], // Temporarily empty, will be filled later
  });
}

function getCostMatrix(listA: Array<PlayerData>, listB: Array<PlayerData>) {
  // The top level of the matrix is the rows, and the second level down is the columns.
  return listA.map((aPlayer) =>
    // Create row
    listB.map((bPlayer) => {
      // Create columns within row
      return canPlay(aPlayer, bPlayer)
        ? Math.abs(bPlayer.rating - aPlayer.rating)
        : NON_MATCH_COST;
    })
  );
}

function getOpponent(player: PlayerData, pairing: Pairing) {
  for (const pair of pairing.pairs) {
    if (pair.aPlayer.id === player.id) {
      return pair.bPlayer;
    } else if (pair.bPlayer.id === player.id) {
      return pair.aPlayer;
    }
  }
  console.log("No opponent found for", player.name, "id:", player.id);
}

export function getPairings(
  listA: Array<PlayerData>,
  listB: Array<PlayerData>
): Pairing {
  // Make the lists the same length
  while (listA.length < listB.length) {
    listA.push(DUMMY_PLAYER);
  }
  while (listB.length < listA.length) {
    listB.push(DUMMY_PLAYER);
  }

  // Compute pairs using Munkres algorithm
  const costMatrix = getCostMatrix(listA, listB);
  const rawResult = munkres(costMatrix);
  const pairing: Pairing = {
    pairs: [],
    benchedPlayers: [],
  };

  // Parse results into Pairing object
  for (const rawPair of rawResult) {
    const aPlayer = listA[rawPair[0]];
    const bPlayer = listB[rawPair[1]];
    if (aPlayer == DUMMY_PLAYER) {
      benchPlayer(bPlayer, pairing);
    } else if (bPlayer == DUMMY_PLAYER) {
      benchPlayer(aPlayer, pairing);
    } else if (canPlay(aPlayer, bPlayer)) {
      // Pair the players
      pairing.pairs.push({
        aPlayer,
        bPlayer,
      });
    } else {
      // Bench both players
      benchPlayer(aPlayer, pairing);
      benchPlayer(bPlayer, pairing);
    }
  }

  for (const benchPlayer of pairing.benchedPlayers) {
    const possibleSubs = [...listA, ...listB].filter(
      (x) => x.gangName === benchPlayer.playerData.gangName
    );
    for (const possibleSub of possibleSubs) {
      const possibleOpponent = getOpponent(possibleSub, pairing);
      if (
        benchPlayer.playerData.gangName == possibleSub.gangName &&
        possibleOpponent !== undefined &&
        canPlay(benchPlayer.playerData, possibleOpponent)
      ) {
        benchPlayer.legalSubstitutions.push(possibleSub);
      }
    }
  }

  return pairing;
}
