import { useRef, useState, useEffect, useCallback } from "react";
import { BOARDER, VERSION, NOW_LOADING, PREF_SORT_MAP } from '../modules/Constants'
import NP_DB_MEMBERS from "../NP_DB/members_minimal.csv";
import parse from "csv-parse/lib/sync";
import { getBirthPlacesFromLocalStorage, getCanVoteFromLocalStorage, getHeightsFromLocalStorage, getMBTIsFromLocalStorage, getYearsFromLocalStorage, setBirthPlacesToLocalStorage, setCanVoteToLocalStorage, setHeightsToLocalStorage, setMBTIsToLocalStorage, setYearsToLocalStorage } from "../modules/LocalStorage";

export interface Member {
  name: string;
  birth_date: string;
  birth_place: string;
  mbti: string;
  height: string;
  hobby: string;
  special_skill: string;
  week_2_rank: number;
  week_3_rank: number;
  week_5_rank: number;
  week_6_rank: string;
}

export interface InitialState {
  initial_mbtis: StoredItems;
  initial_birthplaces: StoredItems;
  initial_heights: StoredItems;
  initial_birthyears: StoredItems;
  current_mbtis: StoredItems;
  current_birthplaces: StoredItems;
  current_heights: StoredItems;
  current_birthyears: StoredItems;
}

interface StoredItems {
  items: string[],
  initialized: boolean
}

export interface SortSettings {
  show_hobby: boolean;
  show_skill: boolean;
  show_ranking: boolean;
}

interface NPDatabase {
  initial_state: InitialState; 
  can_vote_only: boolean;
  setMBTIs: (members: string[]) => void;
  setBirthPlaces: (members: string[]) => void;
  setHeights: (members: string[]) => void;
  setYears: (members: string[]) => void;
  setCanVote: (can_vote_only: boolean) => void;
  members: Map<string, Member>;
  sort_settings: SortSettings;
  setSortSettings: (sort_settings: SortSettings) => void;
}

const fetchCSVAsync = async (): Promise<Member[]> => {
  const response = await fetch(NP_DB_MEMBERS);
  const text = await response.text();
  const parsedCSV: Member[] = parse(text, { columns: true });
  return parsedCSV;
}

export default function useNPDatabase(): NPDatabase {
  const members_array = useRef<Member[]>([]);

  const all_members = useRef<StoredItems>({items: [], initialized: false});
  const all_mbtis = useRef<StoredItems>({items: [], initialized: false});
  const all_birthplaces = useRef<StoredItems>({items: [], initialized: false});
  const all_heights = useRef<StoredItems>({items: [], initialized: false});
  const all_birthyears = useRef<StoredItems>({items: [], initialized: false});

  const all_mbtis_stored = useRef<StoredItems>({items: [], initialized: false});
  const all_birthplaces_stored = useRef<StoredItems>({items: [], initialized: false});
  const all_heights_stored = useRef<StoredItems>({items: [], initialized: false});
  const all_birthyears_stored = useRef<StoredItems>({items: [], initialized: false});

  const mbtis = useRef<string[]>([]);
  const birthplaces = useRef<string[]>([]);
  const heights = useRef<string[]>([]);
  const years = useRef<string[]>([]);
  const members_map = useRef<Map<string, Member>>(new Map<string, Member>());

  const [members, setMembers] = useState<Map<string, Member>>(new Map<string, Member>());
  const [canVote, setCanVote] = useState<boolean>(getCanVoteFromLocalStorage(() => {
    setCanVoteToLocalStorage(false);
  }));
  const [sortConfig, setSortConfig] = useState<SortSettings>({ show_hobby: false, show_skill: false, show_ranking: false });
  const [initialState, setInitialState] = useState<InitialState>({ 
    initial_mbtis: { items: [NOW_LOADING], initialized: false},
    initial_birthplaces: { items: [NOW_LOADING], initialized: false},
    initial_heights: { items: [NOW_LOADING], initialized: false},
    initial_birthyears: { items: [NOW_LOADING], initialized: false},
    current_mbtis: { items: [NOW_LOADING], initialized: false},
    current_birthplaces: { items: [NOW_LOADING], initialized: false},
    current_heights: { items: [NOW_LOADING], initialized: false},
    current_birthyears: { items: [NOW_LOADING], initialized: false},
  });

  // 初期化処理(データベースのcsvを読み込む)
  useEffect(() => {
    console.log("initialize started")
    fetchCSVAsync().then(initializeDatabase).then(() => {
      console.log("initialize finished");
    });
    // eslint-disable-next-line
  }, [])

  const search = useCallback((mbti: string[], birthplaces: string[], heights: string[], years: string[], can_vote_only: boolean): Map<string, Member> => {
    let mbti_set = new Set(mbti);
    let birthplace_set = new Set(birthplaces);
    let heights_set = new Set(heights);
    let years_set = new Set(years);

    let result: Map<string, Member> = new Map<string, Member>();
    for (let i of members_array.current) {
      if (can_vote_only && i.week_5_rank > BOARDER) { continue; }
      if (mbti_set.has(i.mbti) && birthplace_set.has(i.birth_place) && heights_set.has(i.height) && years_set.has(i.birth_date.split('/')[0])) {
        result.set(i.name, i);
      }
    }
    return result;
  }, [members_array]);

  const setMBTIs = useCallback((mbtis_after: string[], update_members: boolean = true) => {
    mbtis.current = mbtis_after;
    setMBTIsToLocalStorage(mbtis.current);
    if (update_members) {
      const members_result = search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
      setMembers(members_result);
    }
  }, [search, canVote]);

  const setBirthPlaces = useCallback((birthplaces_after: string[], update_members: boolean = true) => {
    birthplaces.current = birthplaces_after;
    setBirthPlacesToLocalStorage(birthplaces.current);
    if (update_members) {
      const members_result = search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
      setMembers(members_result);
    }
  }, [search, canVote]);

  const setHeights = useCallback((heights_after: string[], update_members: boolean = true) => {
    heights.current = heights_after;
    setHeightsToLocalStorage(heights.current);
    if (update_members) {
      const members_result = search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
      setMembers(members_result);
    }
  }, [search, canVote]);

  const setYears = useCallback((years_after: string[], update_members: boolean = true) => {
    years.current = years_after;
    setYearsToLocalStorage(years.current);
    if (update_members) {
      const members_result = search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
      setMembers(members_result);
    }
  }, [search, canVote]);

  const setCanVoteOnly = useCallback((can_vote_only: boolean, update_members: boolean = true) => {
    setCanVote(can_vote_only);
    setCanVoteToLocalStorage(can_vote_only);
    if (update_members) {
      const members_result = search(mbtis.current, birthplaces.current, heights.current, years.current, can_vote_only);
      setMembers(members_result);
    }
  }, [search]);

  const updateSortSetting = (val: SortSettings) => {
    if (val.show_hobby !== sortConfig.show_hobby || val.show_ranking !== sortConfig.show_ranking || val.show_skill !== sortConfig.show_skill) {
      setSortConfig(val);
    }
  }

  const initializeDatabase = (members: Member[]) => {
    members_array.current = members;

    const mbtis_set: Set<string> = new Set<string>();
    const heights_set: Set<string> = new Set<string>();
    const birthplaces_set: Set<string> = new Set<string>();
    const years_set: Set<string> = new Set<string>();

    for (let member of members) {
      members_map.current.set(member.name, member);
      all_members.current.items.push(member.name);
      birthplaces_set.add(member.birth_place);
      mbtis_set.add(member.mbti);
      heights_set.add(member.height);
      years_set.add(member.birth_date.split('/')[0]);
    }
    all_members.current.initialized = true;

    const birthPlacesArray = Array.from(birthplaces_set);
    birthPlacesArray.sort((a, b) => { return PREF_SORT_MAP.get(a)! - PREF_SORT_MAP.get(b)! });
    all_birthplaces.current.items = birthPlacesArray;
    all_birthplaces.current.initialized = true;

    const mbtisArray = Array.from(mbtis_set);
    mbtisArray.sort();
    all_mbtis.current.items = mbtisArray;
    all_mbtis.current.initialized = true;

    const heightsArray = Array.from(heights_set);
    heightsArray.sort();
    all_heights.current.items = heightsArray;
    all_heights.current.initialized = true;
    
    const birthyearsArray = Array.from(years_set);
    birthyearsArray.sort();
    all_birthyears.current.items = birthyearsArray;
    all_birthyears.current.initialized = true;

    const storaged_version = localStorage.getItem("VERSION")
    if (storaged_version !== VERSION) {
      setMBTIsToLocalStorage(all_mbtis.current.items);
      setBirthPlacesToLocalStorage(all_birthplaces.current.items);
      setHeightsToLocalStorage(all_heights.current.items);
      setYearsToLocalStorage(all_birthyears.current.items);
      setCanVoteToLocalStorage(false);
    }
    localStorage.setItem("VERSION", VERSION);

    const mbtis_stored = getMBTIsFromLocalStorage(() => {
      setMBTIsToLocalStorage([]);
    });
    all_mbtis_stored.current.items = mbtis_stored;
    all_mbtis_stored.current.initialized = true;
    mbtis.current = mbtis_stored;

    const birthplaces_stored = getBirthPlacesFromLocalStorage(() => {
      setBirthPlacesToLocalStorage([]);
    });
    all_birthplaces_stored.current.items = birthplaces_stored;
    all_birthplaces_stored.current.initialized = true;
    birthplaces.current = birthplaces_stored;

    const heights_stored = getHeightsFromLocalStorage(() => {
      setHeightsToLocalStorage([]);
    });
    all_heights_stored.current.items = heights_stored;
    all_heights_stored.current.initialized = true;
    heights.current = heights_stored;

    const birthyears_stored = getYearsFromLocalStorage(() => {
      setYearsToLocalStorage([]);
    });
    all_birthyears_stored.current.items = birthyears_stored;
    all_birthyears_stored.current.initialized = true;
    years.current = birthyearsArray;

    const members_result = search(mbtis_stored, birthplaces_stored, heights_stored, birthyears_stored, canVote);
    setMembers(members_result);

    setInitialState({
      initial_mbtis: all_mbtis.current,
      initial_birthplaces: all_birthplaces.current,
      initial_heights: all_heights.current,
      initial_birthyears: all_birthyears.current,
      current_mbtis: all_mbtis_stored.current,
      current_birthplaces: all_birthplaces_stored.current,
      current_heights: all_heights_stored.current,
      current_birthyears: all_birthyears_stored.current
    })
  }

  return {
    initial_state: initialState,
    can_vote_only: canVote,
    setMBTIs: setMBTIs,
    setBirthPlaces: setBirthPlaces,
    setHeights: setHeights,
    setYears: setYears,
    setCanVote: setCanVoteOnly,
    members: members,
    sort_settings: sortConfig,
    setSortSettings: updateSortSetting
  }
}