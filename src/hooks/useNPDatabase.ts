import { useRef, useState, useEffect } from "react";
import { VERSION } from '../components/Constants'
import { SortSettings } from "../components/Home";
import npDB from "../modules/NPDatabase";
import NP_DB_MEMBERS from "../NP_DB/members_minimal.csv";
import parse from "csv-parse/lib/sync";
import { Member } from "../modules/NPDatabase";

interface NPDatabase {
  initial_state: InitialState; 
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

const fetchCSVAsync = async (): Promise<Member[]> => {
  const response = await fetch(NP_DB_MEMBERS);
  const text = await response.text();
  const parsedCSV: Member[] = parse(text, { columns: true });
  return parsedCSV;
}

const getMBTIsFromLocalStorage = (): string[] => {
  const all_mbtis_stored: string[] = JSON.parse(localStorage.getItem("mbtis") || "[]");
  return all_mbtis_stored;
}

const setMBTIsToLocalStorage = (mbtis: string[]): void => {
  localStorage.setItem("mbtis", JSON.stringify(mbtis))
}

const getBirthPlacesFromLocalStorage = (): string[] => {
  const all_birthplaces_stored: string[] = JSON.parse(localStorage.getItem("birthplaces") || "[]");
  return all_birthplaces_stored;
}

const setBirthPlacesToLocalStorage = (birthplaces: string[]): void => {
  localStorage.setItem("birthplaces", JSON.stringify(birthplaces))
}

const getHeightsFromLocalStorage = (): string[] => {
  const all_heights_stored: string[] = JSON.parse(localStorage.getItem("heights") || "[]");
  return all_heights_stored;
}

const setHeightsToLocalStorage = (heights: string[]): void => {
  localStorage.setItem("heights", JSON.stringify(heights))
}

const getYearsFromLocalStorage = (): string[] => {
  const all_birthyears_stored: string[] = JSON.parse(localStorage.getItem("years") || "[]");
  return all_birthyears_stored;
}

const setYearsToLocalStorage = (years: string[]): void => {
  localStorage.setItem("years", JSON.stringify(years))
}

interface StoredItems {
  items: string[],
  initialized: boolean
}

export default function useNPDatabase(): NPDatabase {
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

  let can_vote_only: boolean = JSON.parse(localStorage.getItem("can_vote_only") || "false");
  // const members_map: Map<string, Member> = new Map<string, Member>();

  const [members, setMembers] = useState<string[]>([]);
  const [canVote, setCanVote] = useState<boolean>(can_vote_only);
  const [sortConfig, setSortConfig] = useState<SortSettings>({ show_hobby: false, show_skill: false, show_ranking: false });
  const [initialState, setInitialState] = useState<InitialState>({ 
    initial_mbtis: { items: [], initialized: false},
    initial_birthplaces: { items: [], initialized: false},
    initial_heights: { items: [], initialized: false},
    initial_birthyears: { items: [], initialized: false},
    current_mbtis: { items: [], initialized: false},
    current_birthplaces: { items: [], initialized: false},
    current_heights: { items: [], initialized: false},
    current_birthyears: { items: [], initialized: false},
  });

  const setMBTIs = (mbtis_after: string[], update_members: boolean = true) => {
    mbtis.current = mbtis_after;
    setMBTIsToLocalStorage(mbtis.current);
    if (update_members) {
      const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
      setMembers(members_result);
    }
  }

  const setBirthPlaces = (birthplaces_after: string[], update_members: boolean = true) => {
    birthplaces.current = birthplaces_after;
    setBirthPlacesToLocalStorage(birthplaces.current);
    if (update_members) {
      const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
      setMembers(members_result);
    }
  }

  const setHeights = (heights_after: string[], update_members: boolean = true) => {
    heights.current = heights_after;
    setHeightsToLocalStorage(heights.current);
    if (update_members) {
      const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
      setMembers(members_result);
    }
  }

  const setYears = (years_after: string[], update_members: boolean = true) => {
    years.current = years_after;
    setYearsToLocalStorage(years.current);
    if (update_members) {
      const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
      setMembers(members_result);
    }
  }

  const setCanVoteOnly = (can_vote_only: boolean, update_members: boolean = true) => {
    setCanVote(can_vote_only);
    localStorage.setItem("can_vote_only", JSON.stringify(can_vote_only))
    if (update_members) {
      const members_result = npDB.search(mbtis.current, birthplaces.current, heights.current, years.current, canVote);
      setMembers(members_result);
    }
  }

  const updateSortSetting = (val: SortSettings) => {
    if (val.show_hobby !== sortConfig.show_hobby || val.show_ranking !== sortConfig.show_ranking || val.show_skill !== sortConfig.show_skill) {
      setSortConfig(val);
    }
  }

  const initializeDatabase = (members: Member[]) => {
    const mbtis_set: Set<string> = new Set<string>();
    const heights_set: Set<string> = new Set<string>();
    const years_set: Set<string> = new Set<string>();

    for (let member of members) {
      all_members.current.items.push(member.name);
      mbtis_set.add(member.mbti);
      heights_set.add(member.height);
      years_set.add(member.birth_date.split('/')[0]);
    }
    all_members.current.initialized = true;

    all_birthplaces.current.items = [
      '北海道',
      '岩手',
      '宮城',
      '福島',
      '栃木',
      '群馬',
      '埼玉',
      '千葉',
      '東京',
      '神奈川',
      '新潟',
      '石川',
      '長野',
      '愛知',
      '三重',
      '京都',
      '大阪',
      '兵庫',
      '奈良',
      '岡山',
      '広島',
      '徳島',
      '香川',
      '福岡',
      '熊本',
      '宮崎',
      'アメリカ',
      'インドネシア'
    ]
    all_birthplaces.current.initialized = true;

    const mbtis = Array.from(mbtis_set);
    mbtis.sort();
    all_mbtis.current.items = mbtis;
    all_mbtis.current.initialized = true;

    const heights = Array.from(heights_set);
    heights.sort();
    all_heights.current.items = heights;
    all_heights.current.initialized = true;

    const birthyears = Array.from(years_set);
    birthyears.sort();
    all_birthyears.current.items = birthyears;
    all_birthyears.current.initialized = true;

    const storaged_version = localStorage.getItem("VERSION")
    if (storaged_version !== VERSION) {
      setMBTIsToLocalStorage(all_mbtis.current.items);
      setBirthPlacesToLocalStorage(all_birthplaces.current.items);
      setHeightsToLocalStorage(all_heights.current.items);
      setYearsToLocalStorage(all_birthyears.current.items);
      localStorage.setItem("can_vote_only", JSON.stringify("false"))
    }
    localStorage.setItem("VERSION", VERSION);

    const mbtis_stored = getMBTIsFromLocalStorage();
    all_mbtis_stored.current.items = mbtis_stored;
    all_mbtis_stored.current.initialized = true;

    const birthplaces_stored = getBirthPlacesFromLocalStorage();
    all_birthplaces_stored.current.items = birthplaces_stored;
    all_birthplaces_stored.current.initialized = true;

    const heights_stored = getHeightsFromLocalStorage();
    all_heights_stored.current.items = heights_stored;
    all_heights_stored.current.initialized = true;

    const birthyears_stored = getYearsFromLocalStorage();
    all_birthyears_stored.current.items = birthyears_stored;
    all_birthyears_stored.current.initialized = true;

    const members_result = npDB.search(mbtis_stored, birthplaces_stored, heights_stored, birthyears_stored, canVote);
    setMembers(members_result);

    setInitialState({
      initial_mbtis: all_mbtis.current,
      initial_birthplaces: all_birthplaces.current,
      initial_heights: all_heights.current,
      initial_birthyears: all_birthyears.current,
      current_mbtis: all_mbtis_stored.current,
      current_birthplaces: all_birthplaces_stored.current,
      current_heights: all_heights.current,
      current_birthyears: all_birthyears.current
    })
  }

  // 初期化処理(データベースのcsvを読み込む)
  useEffect(() => {
    console.log("start initialize")
    fetchCSVAsync().then(initializeDatabase).then(() => {
      console.log("finish initialize");
    });
  }, [])

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