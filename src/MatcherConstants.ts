export interface Vertex {
  name: string;
  rating: number;
  gang: string;
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
  { name: "Arower", rating: 20 },
  { name: "Crower", rating: 100 },
];

export const testListB = [
  {
    name: "JD",
    rating: 1580,
  },
  { name: "Jake", rating: 1560 },
  { name: "gizmo", rating: 960 },
  { name: "Samantha", rating: 700 },
  { name: "Brower", rating: 40 },
];

export const CtlAList = [
  { name: "Mattholland", pb: 580 },
  { name: "Iceblade", pb: 510 },
  { name: "Greg", pb: 960 },
  { name: "Zipley", pb: 1040 },
  { name: "Scamper", pb: 997 },
  { name: "Opaux", pb: 1080 },
  { name: "Andy", pb: 1200 },
  { name: "Jeff", pb: 1245 },
];

export const CtlBList = [
  { name: "Eggmaster", pb: 1120 },
  { name: "Vernie", pb: 460 },
  { name: "Xerxos", pb: 650 },
  { name: "Torza", pb: 880 },
  { name: "Johann", pb: 823 },
  { name: "Kim", pb: 840 },
  { name: "Jerpidude", pb: 1240 },
  { name: "Sharky", pb: 1060 },
  { name: "TheMisterValor", pb: 1000 },
];
