"use strict";
exports.__esModule = true;
exports.printGraph = void 0;
function printGraph(graph) {
    console.log("\n\nGraph start: [");
    for (var _i = 0, graph_1 = graph; _i < graph_1.length; _i++) {
        var vertex = graph_1[_i];
        console.log("{");
        console.log("\tName: ", vertex.name, "\n\tRating:", vertex.rating, "\n\tNeighbors:", vertex.neighbors.map(function (x) { return x.name; }), "\n\tLonely neighbors:", vertex.lonelyNeighbors.map(function (x) { return x.name; }));
        console.log("}");
    }
}
exports.printGraph = printGraph;
