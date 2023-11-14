import { GroupParsed } from "../hooks/useHPDatabase";

const LOCALSTORAGE_KEY_GROUPS : string = "groups";
const LOCALSTORAGE_KEY_INCLUDE_OG : string = "include_og";

export const getGroupsFromLocalStorage = (all_groups: GroupParsed[], onError?: () => void): GroupParsed[] => {
  let keys: number[] = []
  try {
    keys = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_GROUPS) || "[]");
  } catch (error) {
    onError?.();
  }
  return keys.map((v) => {return all_groups[v]});
}

export const setGroupsToLocalStorage = (groups: GroupParsed[]): void => {
  localStorage.setItem(LOCALSTORAGE_KEY_GROUPS, JSON.stringify(groups.map((v) => {return v.unique_id})))
}

export const getIncludeOGFromLocalStorage = (onError?: () => void): boolean => {
  let result = false
  try {
    result = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_INCLUDE_OG) || "true");
  } catch (error) {
    onError?.();
  }
  return result;
}

export const setIncludeOGToLocalStorage = (include_og: boolean): void => {
  localStorage.setItem(LOCALSTORAGE_KEY_INCLUDE_OG, JSON.stringify(include_og))
}