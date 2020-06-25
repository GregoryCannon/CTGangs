export interface Vertex {
  name: string;
  rating: number;
  neighbors: Array<Vertex>;
  lonelyNeighbors: Array<Vertex>;
}

export interface PlayerData {
  name: string;
  rating: number;
}

export const ALLOWED_RATING_DIFFERENCE = 200;

export const testListA = [
  {
    name: "GregBoomCannon",
    rating: 1220,
  },
  { name: "Kofi", rating: 1380 },
  { name: "dog", rating: 1540 },
  { name: "Boone", rating: 600 },
];

export const testListB = [
  {
    name: "JD",
    rating: 1580,
  },
  { name: "Jake", rating: 1560 },
  { name: "gizmo", rating: 960 },
  { name: "Samantha", rating: 700 },
];
