import { Dispatch, SetStateAction, useEffect, useState } from "react";
import npDB from "../modules/NPDatabase";
import { SearchParams } from "./useNPDatabase";

interface NPSearch {
  members: string[],
  setMBTIs: Dispatch<SetStateAction<string[]>>,
  setBirthPlaces: Dispatch<SetStateAction<string[]>>,
  setHeights: Dispatch<SetStateAction<string[]>>,
  setYears: Dispatch<SetStateAction<string[]>>,
  canVote: boolean,
  setCanVote: Dispatch<SetStateAction<boolean>>
}

export default function useNPSearch(current_params: SearchParams): NPSearch {
  const [mbtis, setMBTIs] = useState<string[]>(current_params.mbtis);
  const [birthplaces, setBirthPlaces] = useState<string[]>(current_params.birthplaces);
  const [heights, setHeights] = useState<string[]>(current_params.heights);
  const [years, setYears] = useState<string[]>(current_params.birthyears);
  const [members, setMembers] = useState<string[]>([]);
  const [canVote, setCanVote] = useState<boolean>(current_params.can_vote_only);

  useEffect(() => {
    const members_result = npDB.search(mbtis, birthplaces, heights, years, canVote);
    setMembers(members_result);
    // eslint-disable-next-line
  }, [mbtis, birthplaces, heights, years, canVote])

  useEffect(() => {
    localStorage.setItem("mbtis", JSON.stringify(mbtis))
  }, [mbtis])

  useEffect(() => {
    localStorage.setItem("birthplaces", JSON.stringify(birthplaces))
  }, [birthplaces])

  useEffect(() => {
    localStorage.setItem("heights", JSON.stringify(heights))
  }, [heights])

  useEffect(() => {
    localStorage.setItem("years", JSON.stringify(years))
  }, [years])

  useEffect(() => {
    localStorage.setItem("can_vote_only", JSON.stringify(canVote))
  }, [canVote])

  return {members, setMBTIs, setBirthPlaces, setHeights, setYears, canVote, setCanVote}
}