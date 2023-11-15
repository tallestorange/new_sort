import HP_DB_MEMBERS from "../HP_DB/member.csv";
import HP_DB_JOIN from "../HP_DB/join.csv";
import HP_DB_GROUP from "../HP_DB/group.csv";
import { fetchCSVAsync } from "../modules/CSVLoader";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate, parseDate } from "../modules/DateUtils";
import { getGroupsFromLocalStorage, getIncludeOGFromLocalStorage, getIncludeTraineeFromLocalStorage, setGroupsToLocalStorage, setIncludeOGToLocalStorage, setIncludeTraineeToLocalStorage } from "../modules/LocalStorage";
import max from "date-fns/max";
import min from "date-fns/min";
import { DateRange } from "@material-ui/pickers";

interface StoredItem<T> {
  /**
   * データの中身
   */
  item: T,

  /**
   * 初期化済みかどうか
   */
  initialized: boolean
}

export interface Member {
  memberID: number;
  memberName: string;
  HPjoinDate: string;
  debutDate: string;
  HPgradDate: string;
  memberKana: string;
  birthDate: string;
}

export interface Group {
  groupID: number;
  groupName: string;
  formDate: string;
  dissolveDate: string;
  isUnit: string;
}

export interface Join {
  memberID: number;
  groupID: number;
  joinDate: string;
  gradDate: string;
}

// interface GroupColor {
//   groupID: string;
//   colorCode: string;
// }

export interface GroupParsed {
  unique_id: number;
  groupID: number;
  groupName: string;
  formDate: Date;
  dissolveDate?: Date;
  isUnit: string;
}

export interface MemberParsed {
  memberName: string;
  HPjoinDate: Date;
  debutDate?: Date;
  HPgradDate?: Date;
  memberKana: string;
  birthDate?: Date;
  groups: {groupID: number, joinDate: Date, gradDate?: Date}[];
}

interface HPDatabase {
  initialState: InitParams,
  setGroups: (v: GroupParsed[]) => void;
  members: Map<string, MemberParsed>;
  includeOG: boolean;
  setIncludeOG: (includeOG: boolean) => void;
  includeTrainee: boolean;
  setIncludeTrainee: (includeTrainee: boolean) => void;
  setDateRange: (val: DateRange) => void;
}

interface HPDateRange {
  from: Date | null,
  to: Date | null
}

export interface InitParams {
  allgroups: StoredItem<GroupParsed[]>,
  groups_stored: StoredItem<GroupParsed[]>,
  date_range: StoredItem<HPDateRange>
}

export function useHPDatabase(): HPDatabase {
  const allgroups = useRef<StoredItem<GroupParsed[]>>({item: [], initialized: false});
  const groups = useRef<StoredItem<GroupParsed[]>>({item: [], initialized: false});
  const allmembers = useRef<StoredItem<Map<number, MemberParsed>>>({item: new Map<number, MemberParsed>(), initialized: false});
  const daterange = useRef<StoredItem<HPDateRange>>({item: {from: new Date(), to: new Date()}, initialized: false});

  const [includeOG, setIncludeOG] = useState<boolean>(true);
  const include_og = useRef<boolean>(true);

  const [includeTrainee, setIncludeTrainee] = useState<boolean>(true);
  const include_trainee = useRef<boolean>(true);

  const [members, setMembers] = useState<Map<string, MemberParsed>>(new Map<string, MemberParsed>());
  
  const [initialState, setInitialState] = useState<InitParams>({
    allgroups: { item: [], initialized: false},
    groups_stored: { item: [], initialized: false},
    date_range: { item: {from: null, to: null}, initialized: false}
  });

  const initializeAsync = async (): Promise<InitParams> => {
    const include_og_local = getIncludeOGFromLocalStorage(() => {
      setIncludeOGToLocalStorage(true);
    });
    include_og.current = include_og_local;
    setIncludeOG(include_og_local);

    const include_trainee_local = getIncludeTraineeFromLocalStorage(() => {
      setIncludeTraineeToLocalStorage(true);
    });
    include_trainee.current = include_trainee_local;
    setIncludeTrainee(include_trainee_local);

    const members = await fetchCSVAsync<Member[]>(HP_DB_MEMBERS);
    const join = await fetchCSVAsync<Join[]>(HP_DB_JOIN);
    const group = await fetchCSVAsync<Group[]>(HP_DB_GROUP);
    
    group.sort((a, b) => (a.groupID - b.groupID));
    const groupParsed: GroupParsed[] = group.map((v, idx) => { return { unique_id: idx, groupID: v.groupID, groupName: v.groupName, formDate: parseDate(v.formDate)!, dissolveDate: parseDate(v.dissolveDate), isUnit: v.isUnit } })
    
    allgroups.current.item = groupParsed;
    allgroups.current.initialized = true;

    const result: Map<number, MemberParsed> = new Map<number, MemberParsed>();
    let date_max = parseDate("1900/1/1")!;
    let date_min = new Date();

    for(const member of members) {
      const val: MemberParsed = {
        memberName: member.memberName,
        HPjoinDate: parseDate(member.HPjoinDate)!,
        debutDate: parseDate(member.debutDate),
        HPgradDate: parseDate(member.HPgradDate),
        memberKana: member.memberKana,
        birthDate: parseDate(member.birthDate)!,
        groups: []
      }

      const birthDate = parseDate(member.birthDate);
      if (birthDate !== undefined) {
        date_max = max([date_max, birthDate]);
        date_min = min([date_min, birthDate]);
      }
  
      const memberID = member.memberID;
      result.set(memberID, val);
    }

    daterange.current.item.from = date_min;
    daterange.current.item.to = date_max;
    daterange.current.initialized = true;
  
    const joinMap: Map<number, {groupID: number, joinDate: Date, gradDate?: Date}[]> = new Map<number, {groupID: number, joinDate: Date, gradDate?: Date}[]>();
    for(const joinData of join) {
      if (!joinMap.has(joinData.memberID)) {
        joinMap.set(joinData.memberID, []);
      }
      joinMap.get(joinData.memberID)!.push({
        groupID: joinData.groupID,
        joinDate: parseDate(joinData.joinDate)!,
        gradDate: parseDate(joinData.gradDate)});
    }
  
    for(const key of Array.from( result.keys() )) {
      result.get(key)!.groups = joinMap.get(key)!
    }
    allmembers.current.item = result;
    allmembers.current.initialized = true;

    const groups_stored_local = getGroupsFromLocalStorage(allgroups.current.item, () => {
      setGroupsToLocalStorage([]);
    });
    groups.current.item = groups_stored_local;
    groups.current.initialized = true;
  
    return {allgroups: allgroups.current, groups_stored: groups.current, date_range: daterange.current};
  }

  const search = useCallback((v: GroupParsed[], includeOG: boolean, includeTrainee: boolean, birthDateFrom: Date | null, birthDateTo: Date | null): Map<string, MemberParsed> => {
    const result = new Set<number>();
    for (const [key, value] of allmembers.current.item) {
      if (value.groups === undefined) {
        continue;
      }

      // OGを含むかどうか
      if (!includeOG) {
        if (value.HPgradDate !== undefined) {
          const now = new Date();
          if (now >= value.HPgradDate) {
            continue;
          }
        }
      }
      // 未昇格のメンバを含むかどうか
      if (!includeTrainee) {
        if (value.debutDate === undefined) {
          continue;
        }
      }
      // 生年月日で区切る
      const birthDate = value.birthDate;
      if (birthDate !== undefined && birthDateFrom !== undefined && birthDateTo !== undefined) {
        if (!(birthDateFrom! <= birthDate && birthDate <= birthDateTo!)) {
          continue;
        }
      }

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
    const ret: Map<string, MemberParsed> = new Map(Array.from(result).map(i => {
      const member = allmembers.current.item.get(i)!
      return [member.memberName, member]
    }))
    return ret;
  }, []);

  // 初期化処理
  useEffect(() => {
    console.log("initialize started")
    initializeAsync().then((init_params) => {
      setInitialState(init_params);
      const result = search(groups.current.item, include_og.current, include_trainee.current, daterange.current.item.from, daterange.current.item.to);
      setMembers(result);
    }).then(() => {
      console.log("initialize finished");
    });
    // eslint-disable-next-line
  }, [])

  const setGroups = useCallback((val: GroupParsed[]) => {
    groups.current.item = val;
    setGroupsToLocalStorage(val);
    const result = search(groups.current.item, include_og.current, include_trainee.current, daterange.current.item.from, daterange.current.item.to);
    setMembers(result);
  }, [search]);

  const setIncludeOGInternal = useCallback((val: boolean) => {
    include_og.current = val;
    setIncludeOG(val);
    setIncludeOGToLocalStorage(val);
    const result = search(groups.current.item, include_og.current, include_trainee.current, daterange.current.item.from, daterange.current.item.to);
    setMembers(result);
  }, [search]);

  const setIncludeTraineeInternal = useCallback((val: boolean) => {
    include_trainee.current = val;
    setIncludeTrainee(val);
    setIncludeTraineeToLocalStorage(val);
    const result = search(groups.current.item, include_og.current, include_trainee.current, daterange.current.item.from, daterange.current.item.to);
    setMembers(result);
  }, [search]);

  const setDateRange = useCallback((val: DateRange) => {
    daterange.current.item.from = val[0];
    daterange.current.item.to = val[1];
    const result = search(groups.current.item, include_og.current, include_trainee.current, daterange.current.item.from, daterange.current.item.to);
    setMembers(result);
  }, [search]);

  return {
    initialState: initialState,
    setGroups: setGroups,
    members: members,
    includeOG: includeOG,
    setIncludeOG: setIncludeOGInternal,
    includeTrainee: includeTrainee,
    setIncludeTrainee: setIncludeTraineeInternal,
    setDateRange: setDateRange
  }
}

export const nameRenderFunction = (member: MemberParsed):string => {
  return member.memberName;
}

export const profileRenderFunction = (member: MemberParsed):string[] => {
  const res:string[] = [
    `誕生日: ${member.birthDate ? formatDate(member.birthDate) : "N/A"}`,
    `H!P加入日: ${formatDate(member.HPjoinDate)}`,
    `デビュー日: ${member.debutDate ? formatDate(member.debutDate) : "N/A"}`,
  ];
  return res;
}