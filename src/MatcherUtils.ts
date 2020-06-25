import { Vertex } from "./MatcherConstants";

export function printGraph(graph: Array<Vertex>) {
  console.log("\n\nGraph: [");
  for (let vertex of graph) {
    console.log("{");
    console.log(
      "\tName: ",
      vertex.name,
      "\n\tRating:",
      vertex.rating,
      "\n\tNeighbors:",
      vertex.neighbors.map((x) => x.name),
      "\n\tLonely neighbors:",
      vertex.lonelyNeighbors.map((x) => x.name)
    );
    console.log("}");
  }
  console.log("]");
}

export function printGraphMini(graph: Array<Vertex>) {
  console.log(
    "Graph:",
    graph.map((x) => x.name)
  );
}

/** Converts a list with names and PBs to names and ratings */
export function convertPbList(list: Array<any>) {
  return list.map((x) => ({
    name: x.name,
    rating: 0.85 * x.pb + 400,
  }));
}
