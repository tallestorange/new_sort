import { useRef, useState } from "react";
import { VERSION } from '../components/Constants'
import { SortSettings } from "../components/Home";
import npDB from "../modules/NPDatabase";

interface NPDatabase {
  initial_mbtis: string[];
  initial_birthplaces: string[];
  initial_heights: string[];
  initial_birthyears: string[];
  current_mbtis: string[];
  current_birthplaces: string[];
  current_heights: string[];
  current_birthyears: string[];
  can_vote_only: boolean;
  setMBTIs: (members: string[]) => void;
  setBirthPlaces: (members: string[]) => void;
  setHeights: (members: string[]) => void;
  setYears: (members: string[]) => void;
  setCanVote: (can_vote_only: boolean) => void;
  members: string[];
  sort_settings: SortSettings;
  setSortSettings: (sort_settings: SortSettings) => void;
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

  let all_mbtis_stored: string[] = JSON.parse(localStorage.getItem("mbtis") || "");
  let all_birthplaces_stored: string[] = JSON.parse(localStorage.getItem("birthplaces") || "");
  let all_heights_stored: string[] = JSON.parse(localStorage.getItem("heights") || "");
  let all_birthyears_stored: string[] = JSON.parse(localStorage.getItem("years") || "");
  let can_vote_only: boolean = JSON.parse(localStorage.getItem("can_vote_only") || "false");

  const [members, setMembers] = useState<string[]>(npDB.search(all_mbtis_stored, all_birthplaces_stored, all_heights_stored, all_birthyears_stored, can_vote_only));
  const [canVote, setCanVote] = useState<boolean>(can_vote_only);
  const [sortConfig, setSortConfig] = useState<SortSettings>({ show_hobby: false, show_skill: false, show_ranking: false });

  const mbtis = useRef<string[]>(all_mbtis_stored);
  const birthplaces = useRef<string[]>(all_birthplaces_stored);
  const heights = useRef<string[]>(all_heights_stored);
  const years = useRef<string[]>(all_birthyears_stored);

  const setMBTIs = (mbtis_after: string[]) => {
    mbtis.current = mbtis_after;
    localStorage.setItem("mbtis", JSON.stringify(mbtis.current))
    const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
    setMembers(members_result);
  }

  const setBirthPlaces = (birthplaces_after: string[]) => {
    birthplaces.current = birthplaces_after;
    localStorage.setItem("birthplaces", JSON.stringify(birthplaces.current))
    const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
    setMembers(members_result);
  }

  const setHeights = (heights_after: string[]) => {
    heights.current = heights_after;
    localStorage.setItem("heights", JSON.stringify(heights.current))
    const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
    setMembers(members_result);
  }

  const setYears = (years_after: string[]) => {
    years.current = years_after;
    localStorage.setItem("years", JSON.stringify(years.current))
    const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
    setMembers(members_result);
  }

  const setCanVoteOnly = (can_vote_only: boolean) => {
    setCanVote(can_vote_only);
    localStorage.setItem("can_vote_only", JSON.stringify(can_vote_only))
    const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, can_vote_only);
    setMembers(members_result);
  }

  return {
    initial_mbtis: all_mbtis,
    initial_birthplaces: all_birthplaces,
    initial_heights: all_heights,
    initial_birthyears: all_birthyears,
    current_mbtis: all_mbtis_stored,
    current_birthplaces: all_birthplaces_stored,
    current_heights: all_heights_stored,
    current_birthyears: all_birthyears_stored,
    can_vote_only: canVote,
    setMBTIs: setMBTIs,
    setBirthPlaces: setBirthPlaces,
    setHeights: setHeights,
    setYears: setYears,
    setCanVote: setCanVoteOnly,
    members: members,
    sort_settings: sortConfig,
    setSortSettings: setSortConfig
  }
}