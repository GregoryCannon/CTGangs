import { printGraph } from "./MatcherUtils";
import {
  Vertex,
  PlayerData,
  ALLOWED_RATING_DIFFERENCE,
  testListA,
  testListB,
} from "./MatcherConstants";

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
  console.log("Getting lonely neighbors for ", vertex.name);
  for (let neighbor of vertex.neighbors) {
    console.log(
      "Neighbor",
      neighbor.name,
      "has degree",
      neighbor.neighbors.length
    );
    if (neighbor.neighbors.length == 1) {
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
      name: player.name,
      rating: player.rating,
      neighbors: [],
      lonelyNeighbors: [],
    });
  }
  for (let player of playerListB) {
    bVertices.push({
      name: player.name,
      rating: player.rating,
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

printGraph(createGraph(testListA, testListB));

export function getPairings() {
  return [];
}
