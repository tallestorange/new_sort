import { DateRange, Group, Member, StoredItem, fetchGroups, fetchJoins, fetchMembers } from "../modules/CSVLoader";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate, parseDate } from "../modules/DateUtils";
import { getIncludeOGFromLocalStorage, getIncludeTraineeFromLocalStorage, setIncludeOGToLocalStorage, setIncludeTraineeToLocalStorage } from "../modules/LocalStorage";
import { PAGE_URL_FOR_SHARE } from "../modules/Constants";
import { isEqual } from "date-fns";

interface HPMemberDatabase {
  initialState: InitParams,
  setGroups: (v: Group[]) => void;
  members: Map<string, Member>;
  setIncludeOG: (includeOG: boolean) => void;
  setIncludeTrainee: (includeTrainee: boolean) => void;
  setDateRange: (val: DateRange) => void;
  setExternalSortParam: (groups_bitset: string | null, include_og: boolean, include_not_debut: boolean, date_from: string | null, date_to: string | null) => void;
  setMemberDBInitialized: (initialize: boolean) => void;
  shareURL: string | undefined;
  setEnableArtistsSearch: (enabled: boolean) => void;
}

export interface InitParams {
  allgroups: StoredItem<Group[]>,
  groups_stored: StoredItem<Group[]>,
  date_range: StoredItem<DateRange>,
  init_date_range: StoredItem<DateRange>,
  share_url: StoredItem<string>,
  include_og: StoredItem<boolean>,
  include_trainee: StoredItem<boolean>,
  use_artists_search: StoredItem<boolean>
}

export function useHPMemberDatabase(): HPMemberDatabase {
  const allgroups = useRef<StoredItem<Group[]>>({item: [], initialized: false});
  const groups = useRef<StoredItem<Group[]>>({item: [], initialized: false});
  const allmembers = useRef<StoredItem<Map<number, Member>>>({item: new Map<number, Member>(), initialized: false});
  const daterange = useRef<StoredItem<DateRange>>({item: {from: null, to: null}, initialized: false});
  const shareurl = useRef<StoredItem<string>>({item: "", initialized: false});
  const initial_daterange = useRef<StoredItem<DateRange>>({item: {from: null, to: null}, initialized: false});

  const include_og = useRef<StoredItem<boolean>>({ item: false, initialized: false });
  const include_trainee = useRef<StoredItem<boolean>>({ item: false, initialized: false });
  const use_artists_search = useRef<StoredItem<boolean>>({item: false, initialized: false});

  const [shareURL, setShareURL] = useState<string>();
  const [initialized, setInitialized] = useState<boolean>(false);
  const [members, setMembers] = useState<Map<string, Member>>(new Map<string, Member>());
  
  const [initialState, setInitialState] = useState<InitParams>({
    allgroups: { item: [], initialized: false },
    groups_stored: { item: [], initialized: false },
    date_range: { item: {from: null, to: null}, initialized: false },
    init_date_range: { item: {from: null, to: null}, initialized: false },
    share_url: { item: "", initialized: false },
    include_og: { item: false, initialized: false },
    include_trainee: { item: false, initialized: false },
    use_artists_search: { item: false, initialized: false }
  });

  const initializeAsync = async (): Promise<InitParams> => {
    const include_og_local = getIncludeOGFromLocalStorage(() => {
      setIncludeOGToLocalStorage(true);
    });
    include_og.current.item = include_og_local;
    include_og.current.initialized = true;

    const include_trainee_local = getIncludeTraineeFromLocalStorage(() => {
      setIncludeTraineeToLocalStorage(true);
    });
    include_trainee.current.item = include_trainee_local;
    include_trainee.current.initialized = true;

    const groups_fetch = await fetchGroups();
    allgroups.current.item = groups_fetch;
    allgroups.current.initialized = true;

    const {members, date_max, date_min} = await fetchMembers();
    initial_daterange.current.initialized = true;
    initial_daterange.current.item = {from: date_min, to: date_max};

    daterange.current.item.from = date_min;
    daterange.current.item.to = date_max;
    daterange.current.initialized = true;

    use_artists_search.current.initialized = true;
  
    const joinMap = await fetchJoins();
    for(const key of Array.from( members.keys() )) {
      members.get(key)!.groups = joinMap.get(key)!
    }
    allmembers.current.item = members;
    allmembers.current.initialized = true;

    // const groups_stored_local = getGroupsFromLocalStorage(allgroups.current.item, () => {
    //   setGroupsToLocalStorage([]);
    // });
    groups.current.item = []//groups_stored_local;
    groups.current.initialized = true;

    const share_url = generateShareURL(groups.current.item, include_og.current.item, include_trainee.current.item, daterange.current.item.from, daterange.current.item.to);
    shareurl.current.item = share_url;
    shareurl.current.initialized = true;
  
    return {
      allgroups: allgroups.current,
      groups_stored: groups.current,
      date_range: daterange.current,
      init_date_range: {item: {from: date_min, to: date_max}, initialized: true},
      share_url: shareurl.current,
      include_og: include_og.current,
      include_trainee: include_trainee.current,
      use_artists_search: use_artists_search.current
    };
  }

  const search = useCallback((v: Group[], includeOG: boolean | null, includeTrainee: boolean | null, birthDateFrom?: Date | null, birthDateTo?: Date | null): Map<string, Member> => {
    const result = new Set<number>();
    for (const [key, value] of allmembers.current.item) {
      if (value.groups === undefined) {
        continue;
      }

      // OGを含むかどうか
      if (includeOG === false) {
        if (value.HPgradDate !== undefined) {
          const now = new Date();
          if (now >= value.HPgradDate) {
            continue;
          }
        }
      }
      // 未昇格のメンバを含むかどうか
      if (includeTrainee === false) {
        if (value.debutDate === undefined) {
          continue;
        }
      }
      // 生年月日で区切る
      const birthDate = value.birthDate;
      if (birthDate === undefined) {
        continue;
      }
      if (birthDateFrom !== null && birthDateTo !== null && birthDateFrom !== undefined && birthDateTo !== undefined) {
        if (!(birthDateFrom! <= birthDate && birthDate <= birthDateTo!)) {
          continue;
        }
      }

      if (use_artists_search.current.item) {
        for (const group of value.groups) {
          if (result.has(key)) {
            break
          }
          for (const i of v) {
            if (i.groupID !== group.groupID) {
              continue;
            }
  
            let from = i.formDate;
            let to = i.dissolveDate;
            let join = group.joinDate;
            let grad = group.gradDate;
  
            if (to !== undefined) {
              if (grad !== undefined) {
                if ((from <= grad! && grad! <= to!) || (from <= join && join <= to!) || (join <= from && to! <= grad!)) {
                  result.add(key);
                  break;
                }
              }
              else {
                if (join <= to!) {
                  result.add(key);
                  break;
                }
              }
            }
            else {
              if (grad !== undefined) {
                if (from <= grad!) {
                  result.add(key);
                  break;
                }
              }
              else {
                result.add(key);
                break;
              }
            }
          }
        }
      }
      else {
        result.add(key);
      }
    }
    const ret: Map<string, Member> = new Map(Array.from(result).map(i => {
      const member = allmembers.current.item.get(i)!
      return [member.memberName, member]
    }))
    return ret;
  }, []);

  // 初期化処理
  useEffect(() => {
    if (initialized) {
      console.log("HPMemberDB initialize started")
      initializeAsync().then((init_params) => {
        setInitialState(init_params);
        const result = search(groups.current.item, include_og.current.item, include_trainee.current.item, daterange.current.item.from, daterange.current.item.to);
        setMembers(result);
      }).then(() => {
        console.log("HPMemberDB initialize finished");
      });
    }
    // eslint-disable-next-line
  }, [initialized])

  const generateShareURL = useCallback((groups: Group[], include_og: boolean, include_not_debut: boolean, date_from?: Date | null, date_to?: Date | null):string => {    
    const params: string[] = [];

    if (allgroups.current.item.length  !== groups.length) {
      const bitList: number[] = [0, 0, 0];
      for (const group of groups) {
        bitList[group.form_order / 31 | 0] += 1 << (group.form_order % 31)
      }
      const groups_str = "groups=" + bitList.join(",")
      params.push(groups_str);
    }
    
    if (include_og) {
      params.push("include_og=True");
    }

    if (include_not_debut) {
      params.push("include_not_debut=True");
    }

    const can_use_date_from = (initial_daterange.current.item.from !== null && date_from !== null && date_from !== undefined);
    const can_use_date_to = (initial_daterange.current.item.to !== null && date_to !== null && date_to !== undefined);
    if (can_use_date_from && can_use_date_to && (!isEqual(date_from, initial_daterange.current.item.from!) || !isEqual(date_to, initial_daterange.current.item.to!))) {
      params.push(`date_from=${formatDate(date_from!, "yyyy-MM-dd")}&date_to=${formatDate(date_to!, "yyyy-MM-dd")}`);
    }

    const share_url = PAGE_URL_FOR_SHARE + (params.length > 0 ? "?" : "") + params.join("&");
    return share_url;
  }, []);

  const updateResult = useCallback(() => {
    const share_url = generateShareURL(groups.current.item, include_og.current.item, include_trainee.current.item, daterange.current.item.from, daterange.current.item.to);
    shareurl.current.item = share_url;
    shareurl.current.initialized = true;

    const result = search(groups.current.item, include_og.current.item, include_trainee.current.item, daterange.current.item.from, daterange.current.item.to);
    setMembers(result);
  }, [search, generateShareURL]);

  const setGroups = useCallback((val: Group[]) => {
    groups.current.item = val;
    // setGroupsToLocalStorage(val);
    updateResult();
  }, [updateResult]);

  const setIncludeOGInternal = useCallback((val: boolean) => {
    include_og.current.item = val;
    setIncludeOGToLocalStorage(val);
    updateResult();
  }, [updateResult]);

  const setIncludeTraineeInternal = useCallback((val: boolean) => {
    include_trainee.current.item = val;
    setIncludeTraineeToLocalStorage(val);
    updateResult();
  }, [updateResult]);

  const setDateRange = useCallback((val: DateRange) => {
    daterange.current.item.from = val.from;
    daterange.current.item.to = val.to;
    updateResult();
  }, [updateResult]);

  const setEnableArtistsSearch = useCallback((val: boolean) => {
    use_artists_search.current.item = val;
    updateResult();
  }, [updateResult]);

  const setExternalSortParam = useCallback((groups_bitset: string | null, include_og: boolean, include_not_debut: boolean, date_from_string: string | null, date_to_string: string | null) => {
    let result: Group[] = [];
    if (groups_bitset === null) {
      result = [...allgroups.current.item];
    }
    else {
      const grp_list = groups_bitset.split(",");
      for (const [idx, val] of grp_list.entries()) {
        const id = Number(val);
        if (Number.isNaN(id)) {
          return;
        }
        // 31ビット x 3 = 93ビットでグループ選択状況を管理する
        for(let i=0; i<31; i++) {
          const form_order_idx = idx * 31 + i;
          if (id & (1 << i)) {
            for (const group of allgroups.current.item) {
              if (group.form_order === form_order_idx) {
                result.push(group);
                break;
              }
            }
          }
        }
      }
    }

    const date_from = parseDate(date_from_string, "yyyy-MM-dd");
    const date_to = parseDate(date_to_string, "yyyy-MM-dd");
    
    const share_url = generateShareURL(result, include_og, include_not_debut, date_from, date_to);
    setShareURL(share_url);

    const search_result = search(result, include_og, include_not_debut, date_from, date_to);
    setMembers(search_result);
  }, [search, generateShareURL]);

  return {
    initialState: initialState,
    setGroups: setGroups,
    members: members,
    setIncludeOG: setIncludeOGInternal,
    setIncludeTrainee: setIncludeTraineeInternal,
    setDateRange: setDateRange,
    setExternalSortParam: setExternalSortParam,
    setMemberDBInitialized: setInitialized,
    shareURL: shareURL,
    setEnableArtistsSearch: setEnableArtistsSearch
  }
}

export const nameRenderFunction = (member: Member):string => {
  return member.memberName;
}

export const profileRenderFunction = (member: Member):string[] => {
  const res:string[] = [
    `誕生日: ${member.birthDate ? formatDate(member.birthDate) : "N/A"}`,
    `H!P加入日: ${formatDate(member.HPjoinDate)}`,
    `デビュー日: ${member.debutDate ? formatDate(member.debutDate) : "N/A"}`,
  ];
  return res;
}