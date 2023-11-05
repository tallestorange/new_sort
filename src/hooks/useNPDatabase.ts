import { Dispatch, SetStateAction, useState } from "react";
import { VERSION } from '../components/Constants'
import npDB from "../modules/NPDatabase";

export interface SearchParams {
  mbtis: string[];
  birthplaces: string[];
  heights: string[];
  birthyears: string[];
  can_vote_only: boolean
}

interface NPDatabase {
  initial_params: SearchParams,
  current_params: SearchParams,
  members: string[],
  setMembers: Dispatch<SetStateAction<string[]>>
}

export default function useNPDatabase(): NPDatabase {
  const all_mbtis = npDB.allMBTI;
  const all_birthplaces = npDB.allBirthPlace;
  const all_heights = npDB.allHeights;
  const all_birthyears = npDB.allYears;

  const storaged_version = localStorage.getItem("VERSION")
  if (storaged_version !== VERSION) {
    localStorage.setItem("mbtis", JSON.stringify(all_mbtis))
    localStorage.setItem("birthplaces", JSON.stringify(all_birthplaces))
    localStorage.setItem("heights", JSON.stringify(all_heights))
    localStorage.setItem("years", JSON.stringify(all_birthyears))
    localStorage.setItem("can_vote_only", JSON.stringify("false"))
  }
  localStorage.setItem("VERSION", VERSION);

  let mbtis_stored: string[] = JSON.parse(localStorage.getItem("mbtis") || "");
  let all_birthplaces_stored: string[] = JSON.parse(localStorage.getItem("birthplaces") || "");
  let all_heights_stored: string[] = JSON.parse(localStorage.getItem("heights") || "");
  let all_birthyears_stored: string[] = JSON.parse(localStorage.getItem("years") || "");
  let can_vote_only: boolean = JSON.parse(localStorage.getItem("can_vote_only") || "false");

  const [members, setMembers] = useState<string[]>(npDB.search(mbtis_stored, all_birthplaces_stored, all_heights_stored, all_birthyears_stored, can_vote_only));

  return { 
    initial_params: {mbtis: all_mbtis, birthplaces: all_birthplaces, heights: all_heights, birthyears: all_birthyears, can_vote_only: false }, 
    current_params: {mbtis: mbtis_stored, birthplaces: all_birthplaces_stored, heights: all_heights_stored, birthyears: all_birthyears_stored, can_vote_only: can_vote_only },
    members: members,
    setMembers: setMembers 
  };
}