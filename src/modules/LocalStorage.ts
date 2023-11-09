export const getMBTIsFromLocalStorage = (): string[] => {
  const all_mbtis_stored: string[] = JSON.parse(localStorage.getItem("mbtis") || "[]");
  return all_mbtis_stored;
}

export const setMBTIsToLocalStorage = (mbtis: string[]): void => {
  localStorage.setItem("mbtis", JSON.stringify(mbtis))
}

export const getBirthPlacesFromLocalStorage = (): string[] => {
  const all_birthplaces_stored: string[] = JSON.parse(localStorage.getItem("birthplaces") || "[]");
  return all_birthplaces_stored;
}

export const setBirthPlacesToLocalStorage = (birthplaces: string[]): void => {
  localStorage.setItem("birthplaces", JSON.stringify(birthplaces))
}

export const getHeightsFromLocalStorage = (): string[] => {
  const all_heights_stored: string[] = JSON.parse(localStorage.getItem("heights") || "[]");
  return all_heights_stored;
}

export const setHeightsToLocalStorage = (heights: string[]): void => {
  localStorage.setItem("heights", JSON.stringify(heights))
}

export const getYearsFromLocalStorage = (): string[] => {
  const all_birthyears_stored: string[] = JSON.parse(localStorage.getItem("years") || "[]");
  return all_birthyears_stored;
}

export const setYearsToLocalStorage = (years: string[]): void => {
  localStorage.setItem("years", JSON.stringify(years))
}

export const getCanVoteFromLocalStorage = (): boolean => {
  const can_vote_only: boolean = JSON.parse(localStorage.getItem("can_vote_only") || "false");
  return can_vote_only;
}

export const setCanVoteToLocalStorage = (can_vote_only: boolean): void => {
  localStorage.setItem("can_vote_only", JSON.stringify(can_vote_only))
}