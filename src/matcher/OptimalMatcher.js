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
var munkres = require("munkres-js");
var DUMMY_PLAYER = {
    id: -1,
    name: "dummy player",
    rating: -1,
    gangName: ""
};
var NON_MATCH_COST = 10000; // The penalty if an two players who can't play are matched (i.e. they both get benched)
var ALLOWED_RATING_GAP = 200;
function canPlay(aPlayer, bPlayer) {
    return Math.abs(aPlayer.rating - bPlayer.rating) <= ALLOWED_RATING_GAP;
}
function benchPlayer(player, pairing) {
    pairing.benchedPlayers.push({
        playerData: player,
        legalSubstitutions: []
    });
}
function getCostMatrix(listA, listB) {
    // The top level of the matrix is the rows, and the second level down is the columns.
    return listA.map(function (aPlayer) {
        // Create row
        return listB.map(function (bPlayer) {
            // Create columns within row
            return canPlay(aPlayer, bPlayer)
                ? Math.abs(bPlayer.rating - aPlayer.rating)
                : NON_MATCH_COST;
        });
    });
}
function getOpponent(player, pairing) {
    for (var _i = 0, _a = pairing.pairs; _i < _a.length; _i++) {
        var pair = _a[_i];
        if (pair.aPlayer.id === player.id) {
            return pair.bPlayer;
        }
        else if (pair.bPlayer.id === player.id) {
            return pair.aPlayer;
        }
    }
    console.log("No opponent found for", player.name, "id:", player.id);
}
function getPairings(listA, listB) {
    // Make the lists the same length
    while (listA.length < listB.length) {
        listA.push(DUMMY_PLAYER);
    }
    while (listB.length < listA.length) {
        listB.push(DUMMY_PLAYER);
    }
    // Compute pairs using Munkres algorithm
    var costMatrix = getCostMatrix(listA, listB);
    var rawResult = munkres(costMatrix);
    var pairing = {
        pairs: [],
        benchedPlayers: []
    };
    // Parse results into Pairing object
    for (var _i = 0, rawResult_1 = rawResult; _i < rawResult_1.length; _i++) {
        var rawPair = rawResult_1[_i];
        var aPlayer = listA[rawPair[0]];
        var bPlayer = listB[rawPair[1]];
        if (aPlayer == DUMMY_PLAYER) {
            benchPlayer(bPlayer, pairing);
        }
        else if (bPlayer == DUMMY_PLAYER) {
            benchPlayer(aPlayer, pairing);
        }
        else if (canPlay(aPlayer, bPlayer)) {
            // Pair the players
            pairing.pairs.push({
                aPlayer: aPlayer,
                bPlayer: bPlayer
            });
        }
        else {
            // Bench both players
            benchPlayer(aPlayer, pairing);
            benchPlayer(bPlayer, pairing);
        }
    }
    var _loop_1 = function (benchPlayer_1) {
        var possibleSubs = __spreadArrays(listA, listB).filter(function (x) { return x.gangName === benchPlayer_1.playerData.gangName; });
        for (var _i = 0, possibleSubs_1 = possibleSubs; _i < possibleSubs_1.length; _i++) {
            var possibleSub = possibleSubs_1[_i];
            var possibleOpponent = getOpponent(possibleSub, pairing);
            if (benchPlayer_1.playerData.gangName == possibleSub.gangName &&
                possibleOpponent !== undefined &&
                canPlay(benchPlayer_1.playerData, possibleOpponent)) {
                benchPlayer_1.legalSubstitutions.push(possibleSub);
            }
        }
    };
    for (var _a = 0, _b = pairing.benchedPlayers; _a < _b.length; _a++) {
        var benchPlayer_1 = _b[_a];
        _loop_1(benchPlayer_1);
    }
    return pairing;
}
exports.getPairings = getPairings;
