import { PlayerData } from "./OptimalMatcher";

export const ALLOWED_RATING_DIFFERENCE = 200;

export const testListA: Array<PlayerData> = [
  {
    id: 1,
    gangName: "Sflat",
    name: "GregBoomCannon",
    rating: 1220,
  },
  { id: 2, gangName: "Sflat", name: "Kofi", rating: 1380 },
  { id: 3, gangName: "Sflat", name: "dog", rating: 1540 },
  { id: 4, gangName: "Sflat", name: "Boone", rating: 600 },
  { id: 5, gangName: "Sflat", name: "Arower", rating: 20 },
  { id: 6, gangName: "Sflat", name: "Crower", rating: 100 },
];

export const testListB: Array<PlayerData> = [
  {
    id: 7,
    gangName: "Svert",
    name: "JD",
    rating: 1580,
  },
  { id: 8, gangName: "Svert", name: "Jake", rating: 1560 },
  { id: 9, gangName: "Svert", name: "gizmo", rating: 960 },
  { id: 10, gangName: "Svert", name: "Samantha", rating: 700 },
  { id: 11, gangName: "Svert", name: "Brower", rating: 40 },
];

export const CtlAList = [
  { id: 11, name: "Mattholland", pb: 580 },
  { id: 12, name: "Iceblade", pb: 510 },
  { id: 13, name: "Greg", pb: 960 },
  { id: 14, name: "Zipley", pb: 1040 },
  { id: 15, name: "Scamper", pb: 997 },
  { id: 16, name: "Opaux", pb: 1080 },
  { id: 17, name: "Andy", pb: 1200 },
  { id: 18, name: "Jeff", pb: 1245 },
];

export const CtlBList = [
  { id: 20, name: "Eggmaster", pb: 1120 },
  { id: 21, name: "Vernie", pb: 460 },
  { id: 22, name: "Xerxos", pb: 650 },
  { id: 23, name: "Torza", pb: 880 },
  { id: 24, name: "Johann", pb: 823 },
  { id: 25, name: "Kim", pb: 840 },
  { id: 26, name: "Jerpidude", pb: 1240 },
  { id: 27, name: "Sharky", pb: 1060 },
  { id: 28, name: "TheMisterValor", pb: 1000 },
];
