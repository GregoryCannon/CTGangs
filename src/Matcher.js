"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.getPairings = void 0;
var MatcherUtils_1 = require("./MatcherUtils");
var MatcherConstants_1 = require("./MatcherConstants");
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
/* ------------------
    Graph Creation
  ------------------- */
function getNeighbors(vertex, potentialOpponents) {
    return potentialOpponents.filter(function (opponent) {
        return Math.abs(opponent.rating - vertex.rating) <= MatcherConstants_1.ALLOWED_RATING_DIFFERENCE;
    });
}
function getLonelyNeighbors(vertex) {
    var lonelyNeighbors = [];
    for (var _i = 0, _a = vertex.neighbors; _i < _a.length; _i++) {
        var neighbor = _a[_i];
        if (neighbor.neighbors.length === 1) {
            lonelyNeighbors.push(neighbor);
        }
    }
    return lonelyNeighbors;
}
function createGraph(playerListA, playerListB) {
    // Construct the graph with the player data and empty connectivity
    var aVertices = [];
    var bVertices = [];
    for (var _i = 0, playerListA_1 = playerListA; _i < playerListA_1.length; _i++) {
        var player = playerListA_1[_i];
        aVertices.push({
            id: player.id,
            name: player.name,
            rating: player.rating,
            gang: "A",
            neighbors: [],
            lonelyNeighbors: []
        });
    }
    for (var _a = 0, playerListB_1 = playerListB; _a < playerListB_1.length; _a++) {
        var player = playerListB_1[_a];
        bVertices.push({
            id: player.id,
            name: player.name,
            rating: player.rating,
            gang: "B",
            neighbors: [],
            lonelyNeighbors: []
        });
    }
    // Add neighbors
    for (var _b = 0, aVertices_1 = aVertices; _b < aVertices_1.length; _b++) {
        var aVertex = aVertices_1[_b];
        for (var _c = 0, bVertices_1 = bVertices; _c < bVertices_1.length; _c++) {
            var bVertex = bVertices_1[_c];
            // If they are compatible, add the edge
            if (Math.abs(aVertex.rating - bVertex.rating) <= MatcherConstants_1.ALLOWED_RATING_DIFFERENCE) {
                aVertex.neighbors.push(bVertex);
                bVertex.neighbors.push(aVertex);
            }
        }
    }
    // Add lonely neighbors (neighbors with degree 1)
    for (var _d = 0, aVertices_2 = aVertices; _d < aVertices_2.length; _d++) {
        var vertex = aVertices_2[_d];
        vertex.lonelyNeighbors = getLonelyNeighbors(vertex);
    }
    for (var _e = 0, bVertices_2 = bVertices; _e < bVertices_2.length; _e++) {
        var vertex = bVertices_2[_e];
        vertex.lonelyNeighbors = getLonelyNeighbors(vertex);
    }
    return __spreadArrays(aVertices, bVertices);
}
function arrayRemove(array, elt) {
    var index = array.indexOf(elt);
    if (index > -1) {
        array.splice(index, 1);
    }
}
function removeVertex(vertex, graph) {
    // Remove references to the vertex from its neighbors adjacency lists
    for (var _i = 0, _a = vertex.neighbors; _i < _a.length; _i++) {
        var neighbor = _a[_i];
        arrayRemove(neighbor.neighbors, vertex);
    }
    // Remove itself from the graph
    arrayRemove(graph, vertex);
}
function pairAndRemove(vertex1, vertex2, graph, pairing) {
    console.log("Pairing", vertex1.name, "with", vertex2.name);
    pairing.pairs.push({
        aPlayerName: vertex1.gang === "A" ? vertex1.name : vertex2.name,
        bPlayerName: vertex1.gang === "A" ? vertex2.name : vertex1.name
    });
    // After pairing, both vertices are removed from the working graph
    removeVertex(vertex1, graph);
    removeVertex(vertex2, graph);
}
/** Removes stranded players from the graph and adds them to the benchedPlayers list.
    Modifies both objects in-place */
function handleStrandedPlayers(graph, pairing) {
    // Loop backwards so splicing objects doesn't mess with the loop
    for (var i = graph.length - 1; i >= 0; i--) {
        var player = graph[i];
        if (player.neighbors.length === 0) {
            console.log("Removing stranded player", player.name);
            removeVertex(player, graph);
            pairing.benchedPlayers.push({
                name: player.name,
                gang: player.gang,
                legalSubstitutions: []
            });
        }
    }
}
function handleNonCompetingLoners(graph, pairing) {
    // Find all vertices who have exactly one lonely neighbor
    var adjacentToOneLoner = graph.filter(function (x) { return x.lonelyNeighbors.length === 1; });
    var didModifyGraph = adjacentToOneLoner.length > 0;
    while (adjacentToOneLoner.length > 0) {
        // The first vertex in the list pairs itself with the lonely neighbor
        var vSelf = adjacentToOneLoner[0];
        var vLoner = vSelf.lonelyNeighbors[0];
        pairAndRemove(vSelf, vLoner, graph, pairing);
        removeVertex(vSelf, adjacentToOneLoner);
        removeVertex(vLoner, adjacentToOneLoner);
    }
    return didModifyGraph;
}
function getBestOpponent(vertex, possibleOpponents) {
    var minDelta = -1;
    var bestOpponent = possibleOpponents[0]; // Only set to avoid setting this to null
    for (var _i = 0, possibleOpponents_1 = possibleOpponents; _i < possibleOpponents_1.length; _i++) {
        var opponent = possibleOpponents_1[_i];
        var delta = Math.abs(opponent.rating - vertex.rating);
        if (minDelta === -1 || delta < minDelta) {
            minDelta = delta;
            bestOpponent = opponent;
        }
    }
    return bestOpponent;
}
function handleCompetingLoners(graph, pairing) {
    // Find all vertices who get to choose between multiple loners
    var selectorVertices = graph.filter(function (x) { return x.lonelyNeighbors.length > 1; });
    var didModifyGraph = selectorVertices.length > 0;
    while (selectorVertices.length > 0) {
        // The first vertex in the list pairs itself with its closest-rated lonely neighbor
        var vSelf = selectorVertices[0];
        var vLoner = getBestOpponent(vSelf, vSelf.lonelyNeighbors);
        pairAndRemove(vSelf, vLoner, graph, pairing);
        removeVertex(vSelf, selectorVertices);
        removeVertex(vLoner, selectorVertices);
    }
    return didModifyGraph;
}
function matchHighestRankedPlayer(graph, pairing) {
    if (graph.length === 0) {
        return;
    }
    // Get the highest ranked player
    var maxRating = -9999999;
    var highestRankedPlayer = graph[0]; // To avoid dealing with null
    for (var _i = 0, graph_1 = graph; _i < graph_1.length; _i++) {
        var player = graph_1[_i];
        if (player.rating > maxRating) {
            maxRating = player.rating;
        }
    }
    var possibleOpponents = graph.filter(function (x) { return x.gang !== highestRankedPlayer.gang; });
    var closestOpponent = getBestOpponent(highestRankedPlayer, possibleOpponents);
    pairAndRemove(highestRankedPlayer, closestOpponent, graph, pairing);
}
function addLegalSubstitutions(pairing, initialGraph) {
    var _loop_1 = function (benchedPlayer) {
        // Look through all their neighbors and see if their assigned opponent would
        // be a valid opponent for the benched player
        var originalNeighbors = initialGraph.filter(function (x) { return x.name === benchedPlayer.name; })[0].neighbors;
        var _loop_2 = function (possibleOpponent) {
            var relevantPair = pairing.pairs.filter(function (pair) {
                return pair.aPlayerName === possibleOpponent.name ||
                    pair.bPlayerName === possibleOpponent.name;
            })[0];
            var teammateToSwapWith = benchedPlayer.gang === "A"
                ? relevantPair.aPlayerName
                : relevantPair.bPlayerName;
            console.log("Found legal substitution:", benchedPlayer.name, "for", teammateToSwapWith);
            benchedPlayer.legalSubstitutions.push(teammateToSwapWith);
        };
        for (var _i = 0, originalNeighbors_1 = originalNeighbors; _i < originalNeighbors_1.length; _i++) {
            var possibleOpponent = originalNeighbors_1[_i];
            _loop_2(possibleOpponent);
        }
    };
    for (var _i = 0, _a = pairing.benchedPlayers; _i < _a.length; _i++) {
        var benchedPlayer = _a[_i];
        _loop_1(benchedPlayer);
    }
}
function getPairings(listA, listB) {
    var initialGraph = createGraph(listA, listB);
    MatcherUtils_1.printGraph(initialGraph);
    console.log("\nStarting pairings");
    // Re-create the graph from scratch since it contains infinite loops and can't be cloned
    var workingGraph = createGraph(listA, listB);
    var pairing = {
        pairs: [],
        benchedPlayers: []
    };
    MatcherUtils_1.printGraphMini(workingGraph);
    // Keep looping through applying the algorithm until it reaches a steady state
    var prevSize = -1;
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
    MatcherUtils_1.printGraph(workingGraph);
    return pairing;
}
exports.getPairings = getPairings;
// console.log(
//   "\n\n Resulting pairing:",
//   getPairings(convertPbList(CtlAList), convertPbList(CtlBList))
// );
