export function printGraph(graph: Array<Vertex>) {
  console.log("\n\nGraph start: [");
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
}
