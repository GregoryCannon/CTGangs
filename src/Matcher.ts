import { printGraph, printGraphMini, convertPbList } from "./MatcherUtils";
import {
  ALLOWED_RATING_DIFFERENCE,
  testListA,
  testListB,
  CtlAList,
  CtlBList,
} from "./MatcherConstants";

/**
 * This class takes two lists of players with Elo-like ratings, and automatically matches them up,
 * maximizing the number of people who can play (1st priority), and the proximity of skill (2nd priority)
 *
 * The Algorithm:
 *
 * 0) Create a bipartite graph where people who can face each other are connected
 * while(graph not empty)
 *    1) remove any vertices with degree 0 and "bench" them
 *    2) find vertices with degree 1 (who aren't competing for the same opponents) and pair them off
 *    3) resolve vertices with degree 1 who *are* fighting over the same opponents
 *    4) if all degrees 2+, match the highest rated player with their closest match
 *
 * (if any of these steps)
 */

export interface Vertex {
  id: number;
  name: string;
  rating: number;
  gang: string;
  neighbors: Array<Vertex>;
  lonelyNeighbors: Array<Vertex>;
}

export interface PlayerData {
  id: number;
  name: string;
  rating: number;
}

export interface BenchedPlayer {
  name: string;
  gang: string;
  legalSubstitutions: Array<string>;
}

export interface Pair {
  aPlayerName: string;
  bPlayerName: string;
}

export interface Pairing {
  pairs: Array<Pair>;
  benchedPlayers: Array<BenchedPlayer>;
}

/* ------------------
    Graph Creation 
  ------------------- */

function getNeighbors(
  vertex: Vertex,
  potentialOpponents: Array<Vertex>
): Array<Vertex> {
  return potentialOpponents.filter(
    (opponent) =>
      Math.abs(opponent.rating - vertex.rating) <= ALLOWED_RATING_DIFFERENCE
  );
}

function getLonelyNeighbors(vertex: Vertex): Array<Vertex> {
  let lonelyNeighbors = [];
  for (let neighbor of vertex.neighbors) {
    if (neighbor.neighbors.length === 1) {
      lonelyNeighbors.push(neighbor);
    }
  }
  return lonelyNeighbors;
}

function createGraph(
  playerListA: Array<PlayerData>,
  playerListB: Array<PlayerData>
): Array<Vertex> {
  // Construct the graph with the player data and empty connectivity
  let aVertices: Array<Vertex> = [];
  let bVertices: Array<Vertex> = [];

  for (let player of playerListA) {
    aVertices.push({
      id: player.id,
      name: player.name,
      rating: player.rating,
      gang: "A",
      neighbors: [],
      lonelyNeighbors: [],
    });
  }
  for (let player of playerListB) {
    bVertices.push({
      id: player.id,
      name: player.name,
      rating: player.rating,
      gang: "B",
      neighbors: [],
      lonelyNeighbors: [],
    });
  }

  // Add neighbors
  for (let aVertex of aVertices) {
    for (let bVertex of bVertices) {
      // If they are compatible, add the edge
      if (
        Math.abs(aVertex.rating - bVertex.rating) <= ALLOWED_RATING_DIFFERENCE
      ) {
        aVertex.neighbors.push(bVertex);
        bVertex.neighbors.push(aVertex);
      }
    }
  }

  // Add lonely neighbors (neighbors with degree 1)
  for (let vertex of aVertices) {
    vertex.lonelyNeighbors = getLonelyNeighbors(vertex);
  }
  for (let vertex of bVertices) {
    vertex.lonelyNeighbors = getLonelyNeighbors(vertex);
  }

  return [...aVertices, ...bVertices];
}

/* ------------------
    Pairing Process 
  ------------------- */

function arrayRemove(array: Array<any>, elt: any) {
  var index = array.indexOf(elt);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function removeVertex(vertex: Vertex, graph: Array<Vertex>) {
  // Remove references to the vertex from its neighbors adjacency lists
  for (let neighbor of vertex.neighbors) {
    arrayRemove(neighbor.neighbors, vertex);
  }
  // Remove itself from the graph
  arrayRemove(graph, vertex);
}

function pairAndRemove(
  vertex1: Vertex,
  vertex2: Vertex,
  graph: Array<Vertex>,
  pairing: Pairing
) {
  console.log("Pairing", vertex1.name, "with", vertex2.name);
  pairing.pairs.push({
    aPlayerName: vertex1.gang === "A" ? vertex1.name : vertex2.name,
    bPlayerName: vertex1.gang === "A" ? vertex2.name : vertex1.name,
  });

  // After pairing, both vertices are removed from the working graph
  removeVertex(vertex1, graph);
  removeVertex(vertex2, graph);
}

/** Removes stranded players from the graph and adds them to the benchedPlayers list. 
    Modifies both objects in-place */
function handleStrandedPlayers(graph: Array<Vertex>, pairing: Pairing) {
  // Loop backwards so splicing objects doesn't mess with the loop
  for (let i = graph.length - 1; i >= 0; i--) {
    const player = graph[i];
    if (player.neighbors.length === 0) {
      console.log("Removing stranded player", player.name);
      removeVertex(player, graph);
      pairing.benchedPlayers.push({
        name: player.name,
        gang: player.gang,
        legalSubstitutions: [],
      });
    }
  }
}

function handleNonCompetingLoners(
  graph: Array<Vertex>,
  pairing: Pairing
): boolean {
  // Find all vertices who have exactly one lonely neighbor
  const adjacentToOneLoner = graph.filter(
    (x) => x.lonelyNeighbors.length === 1
  );
  const didModifyGraph = adjacentToOneLoner.length > 0;
  while (adjacentToOneLoner.length > 0) {
    // The first vertex in the list pairs itself with the lonely neighbor
    const vSelf = adjacentToOneLoner[0];
    const vLoner = vSelf.lonelyNeighbors[0];
    pairAndRemove(vSelf, vLoner, graph, pairing);
    removeVertex(vSelf, adjacentToOneLoner);
    removeVertex(vLoner, adjacentToOneLoner);
  }
  return didModifyGraph;
}

function getBestOpponent(vertex: Vertex, possibleOpponents: Array<Vertex>) {
  let minDelta = -1;
  let bestOpponent = possibleOpponents[0]; // Only set to avoid setting this to null
  for (let opponent of possibleOpponents) {
    const delta = Math.abs(opponent.rating - vertex.rating);
    if (minDelta === -1 || delta < minDelta) {
      minDelta = delta;
      bestOpponent = opponent;
    }
  }
  return bestOpponent;
}

function handleCompetingLoners(
  graph: Array<Vertex>,
  pairing: Pairing
): boolean {
  // Find all vertices who get to choose between multiple loners
  const selectorVertices = graph.filter((x) => x.lonelyNeighbors.length > 1);
  const didModifyGraph = selectorVertices.length > 0;
  while (selectorVertices.length > 0) {
    // The first vertex in the list pairs itself with its closest-rated lonely neighbor
    const vSelf = selectorVertices[0];
    const vLoner = getBestOpponent(vSelf, vSelf.lonelyNeighbors);
    pairAndRemove(vSelf, vLoner, graph, pairing);
    removeVertex(vSelf, selectorVertices);
    removeVertex(vLoner, selectorVertices);
  }
  return didModifyGraph;
}

function matchHighestRankedPlayer(graph: Array<Vertex>, pairing: Pairing) {
  if (graph.length === 0) {
    return;
  }
  // Get the highest ranked player
  let maxRating = -9999999;
  let highestRankedPlayer = graph[0]; // To avoid dealing with null
  for (let player of graph) {
    if (player.rating > maxRating) {
      maxRating = player.rating;
    }
  }

  const possibleOpponents = graph.filter(
    (x) => x.gang !== highestRankedPlayer.gang
  );
  const closestOpponent = getBestOpponent(
    highestRankedPlayer,
    possibleOpponents
  );
  pairAndRemove(highestRankedPlayer, closestOpponent, graph, pairing);
}

function addLegalSubstitutions(pairing: Pairing, initialGraph: Array<Vertex>) {
  for (let benchedPlayer of pairing.benchedPlayers) {
    // Look through all their neighbors and see if their assigned opponent would
    // be a valid opponent for the benched player
    const originalNeighbors = initialGraph.filter(
      (x) => x.name === benchedPlayer.name
    )[0].neighbors;
    for (let possibleOpponent of originalNeighbors) {
      const relevantPair = pairing.pairs.filter(
        (pair) =>
          pair.aPlayerName === possibleOpponent.name ||
          pair.bPlayerName === possibleOpponent.name
      )[0];
      const teammateToSwapWith =
        benchedPlayer.gang === "A"
          ? relevantPair.aPlayerName
          : relevantPair.bPlayerName;
      console.log(
        "Found legal substitution:",
        benchedPlayer.name,
        "for",
        teammateToSwapWith
      );
      benchedPlayer.legalSubstitutions.push(teammateToSwapWith);
    }
  }
}

export function getPairings(
  listA: Array<PlayerData>,
  listB: Array<PlayerData>
): Pairing {
  const initialGraph = createGraph(listA, listB);
  printGraph(initialGraph);

  console.log("\nStarting pairings");
  // Re-create the graph from scratch since it contains infinite loops and can't be cloned
  const workingGraph = createGraph(listA, listB);
  const pairing = {
    pairs: [],
    benchedPlayers: [],
  };
  printGraphMini(workingGraph);

  // Keep looping through applying the algorithm until it reaches a steady state
  let prevSize = -1;
  while (prevSize === -1 || workingGraph.length < prevSize) {
    prevSize = workingGraph.length;
    // Loop through the 4 phases of the alg, restarting the steps changes to the graph are made
    handleStrandedPlayers(workingGraph, pairing);
    if (handleNonCompetingLoners(workingGraph, pairing)) {
      continue;
    }
    if (handleCompetingLoners(workingGraph, pairing)) {
      continue;
    }
    matchHighestRankedPlayer(workingGraph, pairing);
  }

  addLegalSubstitutions(pairing, initialGraph);

  printGraph(workingGraph);

  return pairing;
}

// console.log(
//   "\n\n Resulting pairing:",
//   getPairings(convertPbList(CtlAList), convertPbList(CtlBList))
// );
