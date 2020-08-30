players = [
  {
    name: "A",
    trueRating: 800,
  },
  {
    name: "B",
    trueRating: 900,
  },
  {
    name: "C",
    trueRating: 1000,
  },
  {
    name: "D",
    trueRating: 1100,
  },
  {
    name: "E",
    trueRating: 1200,
  },
  {
    name: "F",
    trueRating: 1300,
  },
  {
    name: "G",
    trueRating: 1400,
  },
  {
    name: "H",
    trueRating: 1500,
  },
  {
    name: "I",
    trueRating: 1600,
  },
  {
    name: "J",
    trueRating: 1700,
  },
  {
    name: "K",
    trueRating: 1800,
  },
  {
    name: "L",
    trueRating: 1900,
  },
];
const NUM_MATCHES = 100000;
const NUM_SIMS = 1000;
const K_FACTOR = 20;
const ACCOUNT_FOR_MARGIN = true;
const LOGGING_ENABLED = false;

function log() {
  if (!LOGGING_ENABLED) {
    return;
  }
  var args = Array.prototype.slice.call(arguments);
  console.log.apply(console, args);
}

function assignStartingCred() {
  players = players.map((player) => {
    player.streetCred =
      Math.round((player.trueRating + Math.random() * 100) / 20) * 20;
    return player;
  });
}

function getWinChance(playerRating, opponentRating) {
  return 1.0 / (1.0 + Math.pow(10.0, (opponentRating - playerRating) / 400.0));
}

function pickFromList(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function playRandomMatch() {
  const player = pickFromList(players);
  // Find all opponenets within 200 street cred
  const viableOpponents = players.filter(
    (x) => x !== player && Math.abs(x.streetCred - player.streetCred) <= 200
  );
  if (viableOpponents.length == 0) {
    log(`No opponents found for ${player.name}`);
    return false;
  }
  const opponent = pickFromList(viableOpponents);

  log(
    `${player.name} (${player.streetCred}) faces ${opponent.name} (${
      opponent.streetCred
    }), rating difference = ${player.streetCred - opponent.streetCred}`
  );

  const winOdds = getWinChance(player.trueRating, opponent.trueRating);
  if (Math.random() < winOdds) {
    // Player wins
    player.streetCred +=
      K_FACTOR * (ACCOUNT_FOR_MARGIN ? 2 * (1 - winOdds) : 1);
    opponent.streetCred -=
      K_FACTOR * (ACCOUNT_FOR_MARGIN ? 2 * (1 - winOdds) : 1);
    log(
      `\t${player.name} wins, new ratings: ${player.streetCred}, ${opponent.streetCred}`
    );
  } else {
    // Player loses
    player.streetCred -=
      K_FACTOR * (ACCOUNT_FOR_MARGIN ? 2 * (1 - winOdds) : 1);
    opponent.streetCred +=
      K_FACTOR * (ACCOUNT_FOR_MARGIN ? 2 * (1 - winOdds) : 1);
    log(
      `\t${player.name} loses, new ratings: ${player.streetCred}, ${opponent.streetCred}`
    );
  }
  return true;
}

// Checks if the street cred rating order matches the true skill order
function isWellOrdered() {
  // Sort based on true rating
  players.sort((a, b) => a.trueRating - b.trueRating);

  // Check that street cred matches
  for (let i = 1; i < players.length; i++) {
    if (players[i].streetCred < players[i - 1].streetCred) {
      return false;
    }
  }
  return true;
}

function runOneSim() {
  assignStartingCred();
  log(players);
  let numFailed = 0;

  for (let i = 0; i < NUM_MATCHES; i++) {
    const didFind = playRandomMatch();
    numFailed = didFind ? 0 : numFailed + 1;
    if (numFailed > 100) {
      log("Failed 100 in a row on iteration #" + i);
      return [i, isWellOrdered()];
    }
  }
  log("Complete simulation with no divergence");
  return [-1, isWellOrdered()];
}

function main() {
  let wellOrderedCount = 0;
  for (let i = 0; i < NUM_SIMS; i++) {
    const result = runOneSim();
    if (result[1]) {
      wellOrderedCount++;
    }
    console.log(result[0]);
  }
  console.log(`Well ordered in ${wellOrderedCount} / ${NUM_SIMS} runs`);
}

main();
