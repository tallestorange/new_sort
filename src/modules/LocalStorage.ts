const LOCALSTORAGE_KEY_MBTIS : string = "mbtis";
const LOCALSTORAGE_KEY_BIRTHPLACES : string = "birthplaces";
const LOCALSTORAGE_KEY_HEIGHTS : string = "heights";
const LOCALSTORAGE_KEY_YEARS : string = "years";
const LOCALSTORAGE_KEY_CAN_VOTE : string = "can_vote_only";

export const getMBTIsFromLocalStorage = (onError?: () => void): string[] => {
  let result = []
  try {
    result = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_MBTIS) || "[]");
  } catch (error) {
    onError?.();
  }
  return result;
}

export const setMBTIsToLocalStorage = (mbtis: string[]): void => {
  localStorage.setItem(LOCALSTORAGE_KEY_MBTIS, JSON.stringify(mbtis))
}

export const getBirthPlacesFromLocalStorage = (onError?: () => void): string[] => {
  let result = []
  try {
    result = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_BIRTHPLACES) || "[]");
  } catch (error) {
    onError?.();
  }
  return result;
}

export const setBirthPlacesToLocalStorage = (birthplaces: string[]): void => {
  localStorage.setItem(LOCALSTORAGE_KEY_BIRTHPLACES, JSON.stringify(birthplaces))
}

export const getHeightsFromLocalStorage = (onError?: () => void): string[] => {
  let result = []
  try {
    result = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_HEIGHTS) || "[]");
  } catch (error) {
    onError?.();
  }
  return result;
}

export const setHeightsToLocalStorage = (heights: string[]): void => {
  localStorage.setItem(LOCALSTORAGE_KEY_HEIGHTS, JSON.stringify(heights))
}

export const getYearsFromLocalStorage = (onError?: () => void): string[] => {
  let result = []
  try {
    result = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_YEARS) || "[]");
  } catch (error) {
    onError?.();
  }
  return result;
}

export const setYearsToLocalStorage = (years: string[]): void => {
  localStorage.setItem(LOCALSTORAGE_KEY_YEARS, JSON.stringify(years))
}

export const getCanVoteFromLocalStorage = (onError?: () => void): boolean => {
  let result = false
  try {
    result = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_CAN_VOTE) || "false");
  } catch (error) {
    onError?.();
  }
  return result;
}

export const setCanVoteToLocalStorage = (can_vote_only: boolean): void => {
  localStorage.setItem(LOCALSTORAGE_KEY_CAN_VOTE, JSON.stringify(can_vote_only))
}