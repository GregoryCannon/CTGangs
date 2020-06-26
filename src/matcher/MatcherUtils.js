"use strict";
exports.__esModule = true;
exports.convertPbList = exports.printGraphMini = exports.printGraph = void 0;
function printGraph(graph) {
    console.log("\n\nGraph: [");
    for (var _i = 0, graph_1 = graph; _i < graph_1.length; _i++) {
        var vertex = graph_1[_i];
        console.log("{");
        console.log("\tName: ", vertex.name, "\n\tRating:", vertex.rating, "\n\tNeighbors:", vertex.neighbors.map(function (x) { return x.name; }), "\n\tLonely neighbors:", vertex.lonelyNeighbors.map(function (x) { return x.name; }));
        console.log("}");
    }
    console.log("]");
}
exports.printGraph = printGraph;
function printGraphMini(graph) {
    console.log("Graph:", graph.map(function (x) { return x.name; }));
}
exports.printGraphMini = printGraphMini;
/** Converts a list with names and PBs to names and ratings */
function convertPbList(list) {
    return list.map(function (x) { return ({
        id: x.id,
        name: x.name,
        rating: 0.85 * x.pb + 400
    }); });
}
exports.convertPbList = convertPbList;
