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
function getNeighbors(vertex, potentialOpponents) {
    return potentialOpponents.filter(function (opponent) {
        return Math.abs(opponent.rating - vertex.rating) <= MatcherConstants_1.ALLOWED_RATING_DIFFERENCE;
    });
}
function getLonelyNeighbors(vertex) {
    var lonelyNeighbors = [];
    console.log("Getting lonely neighbors for ", vertex.name);
    for (var _i = 0, _a = vertex.neighbors; _i < _a.length; _i++) {
        var neighbor = _a[_i];
        console.log("Neighbor", neighbor.name, "has degree", neighbor.neighbors.length);
        if (neighbor.neighbors.length == 1) {
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
            name: player.name,
            rating: player.rating,
            neighbors: [],
            lonelyNeighbors: []
        });
    }
    for (var _a = 0, playerListB_1 = playerListB; _a < playerListB_1.length; _a++) {
        var player = playerListB_1[_a];
        bVertices.push({
            name: player.name,
            rating: player.rating,
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
MatcherUtils_1.printGraph(createGraph(MatcherConstants_1.testListA, MatcherConstants_1.testListB));
function getPairings() {
    return [];
}
exports.getPairings = getPairings;
