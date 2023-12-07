import { useRef, useState, useEffect, useCallback } from "react";
import { BOARDER, VERSION, NOW_LOADING, PREF_SORT_MAP } from '../modules/Constants'
import NP_DB_MEMBERS from "../NP_DB/members_minimal.csv";
import parse from "csv-parse/lib/sync";
import { getBirthPlacesFromLocalStorage, getCanVoteFromLocalStorage, getHeightsFromLocalStorage, getMBTIsFromLocalStorage, getYearsFromLocalStorage, setBirthPlacesToLocalStorage, setCanVoteToLocalStorage, setHeightsToLocalStorage, setMBTIsToLocalStorage, setYearsToLocalStorage } from "../modules/LocalStorage";

export interface Member {
  /**
   * 名前
   */
  name: string;

  /**
   * 生年月日
   */
  birth_date: string;

  /**
   * 生年月日
   */
  birth_place: string;

  /**
   * MBTI
   */
  mbti: string;

  /**
   * 身長
   */
  height: string;

  /**
   * 趣味
   */
  hobby: string;

  /**
   * 特技
   */
  special_skill: string;

  /**
   * 第2週の順位
   */
  week_2_rank: number;

  /**
   * 第3週の順位
   */
  week_3_rank: number;

  /**
   * 第5週の順位
   */
  week_5_rank: number;

  /**
   * 第6週の順位
   * 11位以下は???表記。51位以上は空欄
   */
  week_6_rank: string;

  week_8_rank: string;

  week_10_rank: string;
}

/**
 * 検索UIを初期化するときに必要な情報
 */
export interface InitialState {
  /**
   * MBTIのSelectに表示する全アイテム
   */
  initial_mbtis: StoredItems;

  /**
   * 出身地のSelectに表示する全アイテム
   */
  initial_birthplaces: StoredItems;

  /**
   * 身長のSelectに表示する全アイテム
   */
  initial_heights: StoredItems;

  /**
   * 生まれ年のSelectに表示する全アイテム
   */
  initial_birthyears: StoredItems;

  /**
   * MBTIのSelectで選択済みのアイテム
   */
  current_mbtis: StoredItems;

  /**
   * 出身地のSelectで選択済みのアイテム
   */
  current_birthplaces: StoredItems;

  /**
   * 身長のSelectで選択済みのアイテム
   */
  current_heights: StoredItems;

  /**
   * 生まれ年のSelectで選択済みのアイテム
   */
  current_birthyears: StoredItems;
}

interface StoredItems {
  /**
   * データの中身
   */
  items: string[],

  /**
   * 初期化済みかどうか
   */
  initialized: boolean
}

/**
 * ソート画面で何を表示するか
 */
export interface SortSettings {
  /**
   * 趣味を表示するかどうか
   */
  show_hobby: boolean;

  /**
   * 特技を表示するかどうか
   */
  show_skill: boolean;

  /**
   * 順位変動を表示するかどうか
   */
  show_ranking: boolean;
}

interface NPDatabase {
  /**
   * アプリ起動時に渡すべきパラメータ(UI調整などに必須なもの)
   */
  initial_state: InitialState;

  /**
   * 投票可能なメンバのみに絞るかどうか
   */
  can_vote_only: boolean;

  /**
   * 検索に用いるMBTI情報を更新する
   * @param mbtis MBTI
   * @returns 
   */
  setMBTIs: (mbtis: string[]) => void;

  /**
   * 検索に用いる出身地情報を更新する
   * @param birthplaces 出身地
   * @returns 
   */
  setBirthPlaces: (birthplaces: string[]) => void;

  /**
   * 検索に用いる身長情報を更新する
   * @param heights 身長
   * @returns 
   */
  setHeights: (heights: string[]) => void;

  /**
   * 検索に用いる生まれ年を更新する
   * @param years 生まれ年
   * @returns 
   */
  setYears: (years: string[]) => void;

  /**
   * 投票可能なメンバのみに絞るかどうかのフラグを更新する
   * @param can_vote_only 投票可能なメンバのみに絞るかどうか(true -> 絞る)
   * @returns 
   */
  setCanVote: (can_vote_only: boolean) => void;

  /**
   * メンバ検索結果
   */
  members: Map<string, Member>;
}

/**
 * CSVから非同期でメンバ情報を拾ってくる
 * @returns メンバ一覧
 */
const fetchCSVAsync = async (): Promise<Member[]> => {
  const response = await fetch(NP_DB_MEMBERS);
  const text = await response.text();
  const parsedCSV: Member[] = parse(text, { columns: true });
  return parsedCSV;
}

/**
 * 日プDB用 CustomHook
 * @returns 
 */
export default function useNPDatabase(): NPDatabase {
  // Stateを更新する必要のないモノに関してはuseRefで管理

  /**
   * メンバ情報(検索に用いる)
   */
  const members_array = useRef<Member[]>([]);

  /**
   * 日プDB(csv)に存在するすべてのMBTI
   */
  const all_mbtis = useRef<StoredItems>({items: [], initialized: false});

  /**
   * 日プDB(csv)に存在するすべての出身地
   */
  const all_birthplaces = useRef<StoredItems>({items: [], initialized: false});

  /**
   * 日プDB(csv)に存在するすべての身長
   */
  const all_heights = useRef<StoredItems>({items: [], initialized: false});

  /**
   * 日プDB(csv)に存在するすべての生まれ年
   */
  const all_birthyears = useRef<StoredItems>({items: [], initialized: false});

  /**
   * 検索UIで直前に選択したすべてのMBTI
   */
  const all_mbtis_stored = useRef<StoredItems>({items: [], initialized: false});

  /**
   * 検索UIで直前に選択したすべての出身地
   */
  const all_birthplaces_stored = useRef<StoredItems>({items: [], initialized: false});

  /**
   * 検索UIで直前に選択したすべての身長
   */
  const all_heights_stored = useRef<StoredItems>({items: [], initialized: false});

  /**
   * 検索UIで直前に選択したすべての生年月日
   */
  const all_birthyears_stored = useRef<StoredItems>({items: [], initialized: false});

  /**
   * 投票可能なメンバのみに絞るかどうか
   * ※内部処理用
   */
  const can_vote = useRef<boolean>(getCanVoteFromLocalStorage(() => {
    setCanVoteToLocalStorage(false);
  }));

  // UIの更新に係るものだけState化
  const [members, setMembers] = useState<Map<string, Member>>(new Map<string, Member>());
  const [canVote, setCanVote] = useState<boolean>(getCanVoteFromLocalStorage(() => {
    setCanVoteToLocalStorage(false);
  }));
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

  // 初期化処理
  useEffect(() => {
    console.log("initialize started")
    fetchCSVAsync().then(initializeDatabase).then(() => {
      console.log("initialize finished");
    });
    // eslint-disable-next-line
  }, [])

  /**
   * メンバ情報の検索
   */
  const search = useCallback((mbti: string[], birthplaces: string[], heights: string[], years: string[], can_vote_only: boolean): Map<string, Member> => {
    let mbti_set = new Set(mbti);
    let birthplace_set = new Set(birthplaces);
    let heights_set = new Set(heights);
    let years_set = new Set(years);

    let result: Map<string, Member> = new Map<string, Member>();
    for (let i of members_array.current) {
      if (can_vote_only && (i.week_10_rank === "" || Number(i.week_10_rank) > BOARDER)) { continue; }
      if (mbti_set.has(i.mbti) && birthplace_set.has(i.birth_place) && heights_set.has(i.height) && years_set.has(i.birth_date.split('/')[0])) {
        result.set(i.name, i);
      }
    }
    return result;
  }, []);

  /**
   * MBTI情報のセットを行う
   * セットされ次第メンバ情報の再検索を実施する
   */
  const setMBTIs = useCallback((mbtis_after: string[]) => {
    all_mbtis_stored.current.items = mbtis_after;
    setMBTIsToLocalStorage(all_mbtis_stored.current.items);
    const members_result = search(all_mbtis_stored.current.items, all_birthplaces_stored.current.items, all_heights_stored.current.items, all_birthyears_stored.current.items, can_vote.current);
    setMembers(members_result);
    // eslint-disable-next-line
  }, []);

  /**
   * 出身地情報のセットを行う
   * セットされ次第メンバ情報の再検索を実施する
   */
  const setBirthPlaces = useCallback((birthplaces_after: string[]) => {
    all_birthplaces_stored.current.items = birthplaces_after;
    setBirthPlacesToLocalStorage(all_birthplaces_stored.current.items);
    const members_result = search(all_mbtis_stored.current.items, all_birthplaces_stored.current.items, all_heights_stored.current.items, all_birthyears_stored.current.items, can_vote.current);
    setMembers(members_result);
    // eslint-disable-next-line
  }, []);

  /**
   * 身長情報のセットを行う
   * セットされ次第メンバ情報の再検索を実施する
   */
  const setHeights = useCallback((heights_after: string[]) => {
    all_heights_stored.current.items = heights_after;
    setHeightsToLocalStorage(all_heights_stored.current.items);
    const members_result = search(all_mbtis_stored.current.items, all_birthplaces_stored.current.items, all_heights_stored.current.items, all_birthyears_stored.current.items, can_vote.current);
    setMembers(members_result);
    // eslint-disable-next-line
  }, []);

  /**
   * 生まれ年情報のセットを行う
   * セットされ次第メンバ情報の再検索を実施する
   */
  const setYears = useCallback((years_after: string[]) => {
    all_birthyears_stored.current.items = years_after;
    setYearsToLocalStorage(all_birthyears_stored.current.items);
    const members_result = search(all_mbtis_stored.current.items, all_birthplaces_stored.current.items, all_heights_stored.current.items, all_birthyears_stored.current.items, can_vote.current);
    setMembers(members_result);
    // eslint-disable-next-line
  }, []);

  /**
   * 投票可能なメンバに絞るかどうかのフラグのセットを行う
   * セットされ次第メンバ情報の再検索を実施する
   */
  const setCanVoteOnly = useCallback((can_vote_only: boolean) => {
    can_vote.current = can_vote_only;
    setCanVote(can_vote_only);
    setCanVoteToLocalStorage(can_vote_only);
    const members_result = search(all_mbtis_stored.current.items, all_birthplaces_stored.current.items, all_heights_stored.current.items, all_birthyears_stored.current.items, can_vote.current);
    setMembers(members_result);
    // eslint-disable-next-line
  }, []);

  /**
   * DBの初期化を実施する
   * ページリロード時に1回だけ呼び出す
   */
  const initializeDatabase = useCallback((members: Member[]) => {
    members_array.current = members;

    // 重複するアイテムについてはSet->Arrayの処理を入れる
    const mbtis_set: Set<string> = new Set<string>();
    const heights_set: Set<string> = new Set<string>();
    const birthplaces_set: Set<string> = new Set<string>();
    const years_set: Set<string> = new Set<string>();

    // CSVのメンバ一覧からDBを構築する
    for (let member of members) {
      birthplaces_set.add(member.birth_place);
      mbtis_set.add(member.mbti);
      heights_set.add(member.height);
      years_set.add(member.birth_date.split('/')[0]);
    }

    // 出身地情報を更新する
    // 出身地については都道府県コード順に並び替える
    const birthPlacesArray = Array.from(birthplaces_set);
    birthPlacesArray.sort((a, b) => { return PREF_SORT_MAP.get(a)! - PREF_SORT_MAP.get(b)! });
    all_birthplaces.current.items = birthPlacesArray;
    all_birthplaces.current.initialized = true;

    // MBTI情報を更新する
    const mbtisArray = Array.from(mbtis_set);
    mbtisArray.sort();
    all_mbtis.current.items = mbtisArray;
    all_mbtis.current.initialized = true;

    // 身長情報を更新する
    const heightsArray = Array.from(heights_set);
    heightsArray.sort();
    all_heights.current.items = heightsArray;
    all_heights.current.initialized = true;
    
    // 生まれ年情報を更新する
    const birthyearsArray = Array.from(years_set);
    birthyearsArray.sort();
    all_birthyears.current.items = birthyearsArray;
    all_birthyears.current.initialized = true;

    // DBの整合性を保つため、データのバージョンが変わった際は一度データ削除を行う
    const storaged_version = localStorage.getItem("VERSION")
    if (storaged_version !== VERSION) {
      setMBTIsToLocalStorage(all_mbtis.current.items);
      setBirthPlacesToLocalStorage(all_birthplaces.current.items);
      setHeightsToLocalStorage(all_heights.current.items);
      setYearsToLocalStorage(all_birthyears.current.items);
      setCanVoteToLocalStorage(false);
    }
    localStorage.setItem("VERSION", VERSION);

    // LocalStorageに保存されたMBTI情報(以前に選択していたもの)を拾う
    const mbtis_stored = getMBTIsFromLocalStorage(() => {
      // LocalStorageの中身が壊れていた場合は未選択扱いとする
      setMBTIsToLocalStorage([]);
    });
    all_mbtis_stored.current.items = mbtis_stored;
    all_mbtis_stored.current.initialized = true;

    // LocalStorageに保存された出身地情報(以前にセレクトしていたもの)を拾う
    const birthplaces_stored = getBirthPlacesFromLocalStorage(() => {
      // LocalStorageの中身が壊れていた場合は未選択扱いとする
      setBirthPlacesToLocalStorage([]);
    });
    all_birthplaces_stored.current.items = birthplaces_stored;
    all_birthplaces_stored.current.initialized = true;

    // LocalStorageに保存された身長情報(以前にセレクトしていたもの)を拾う
    const heights_stored = getHeightsFromLocalStorage(() => {
      // LocalStorageの中身が壊れていた場合は未選択扱いとする
      setHeightsToLocalStorage([]);
    });
    all_heights_stored.current.items = heights_stored;
    all_heights_stored.current.initialized = true;

    // LocalStorageに保存された生まれ年情報(以前にセレクトしていたもの)を拾う
    const birthyears_stored = getYearsFromLocalStorage(() => {
      // LocalStorageの中身が壊れていた場合は未選択扱いとする
      setYearsToLocalStorage([]);
    });
    all_birthyears_stored.current.items = birthyears_stored;
    all_birthyears_stored.current.initialized = true;

    // これまでの情報を用いて該当するメンバを絞り込み、Stateを反映させる
    const members_result = search(mbtis_stored, birthplaces_stored, heights_stored, birthyears_stored, canVote);
    setMembers(members_result);

    // UIに必要な初期値のStateも更新する
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
    // eslint-disable-next-line
  }, []);

  return {
    initial_state: initialState,
    can_vote_only: canVote,
    setMBTIs: setMBTIs,
    setBirthPlaces: setBirthPlaces,
    setHeights: setHeights,
    setYears: setYears,
    setCanVote: setCanVoteOnly,
    members: members,
  }
}