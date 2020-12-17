import { atom } from "recoil";

export const challengeMeChallenges = atom<string[]>({
  key: "challengeMeChallenges",
  default: [],
});
