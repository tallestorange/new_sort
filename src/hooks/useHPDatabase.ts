import HP_DB_MEMBERS from "../HP_DB/member.csv";
import HP_DB_JOIN from "../HP_DB/join.csv";
import HP_DB_GROUP from "../HP_DB/group.csv";
import { fetchCSVAsync } from "../modules/CSVLoader";
import { useCallback, useEffect, useState } from "react";
import { formatDate, parseDate } from "../modules/DateUtils";

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
  birthDate: Date;
  groups: {groupID: number, joinDate: Date, gradDate?: Date}[];
}

interface HPDatabase {
  allgroups: GroupParsed[],
  setGroups: (v: GroupParsed[]) => void;
  members: Map<string, MemberParsed>;
  includeOG: boolean;
  setIncludeOG: (includeOG: boolean) => void;
}

export function useHPDatabase(): HPDatabase {
  const [allgroups, setAllGroups] = useState<GroupParsed[]>([]);
  const [allmembers, setAllMembers] = useState<Map<number, MemberParsed>>(new Map<number, MemberParsed>());
  const [members, setMembers] = useState<Map<string, MemberParsed>>(new Map<string, MemberParsed>());
  const [groups, setGroups] = useState<GroupParsed[]>([]);
  const [includeOG, setIncludeOG] = useState<boolean>(true);

  const initializeAsync = async (): Promise<{groups: GroupParsed[], members: Map<number, MemberParsed>}> => { // Map<string, MemberParsed>
    const members = await fetchCSVAsync<Member[]>(HP_DB_MEMBERS);
    const join = await fetchCSVAsync<Join[]>(HP_DB_JOIN);
    const group = await fetchCSVAsync<Group[]>(HP_DB_GROUP);
  
    const groupParsed: GroupParsed[] = group.map((v) => { return { groupID: v.groupID, groupName: v.groupName, formDate: parseDate(v.formDate)!, dissolveDate: parseDate(v.dissolveDate), isUnit: v.isUnit } })
    groupParsed.sort((a, b) => (a.groupID - b.groupID));

    const result: Map<number, MemberParsed> = new Map<number, MemberParsed>();
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
  
      const memberID = member.memberID;
      result.set(memberID, val);
    }
  
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
  
    return {groups: groupParsed, members: result};
  }

  const search = useCallback((v: GroupParsed[], includeOG: boolean): Map<string, MemberParsed> => {
    const result = new Set<number>();
    for (const [key, value] of allmembers) {
      if (value.groups === undefined) {
        continue;
      }
      if (!includeOG) {
        if (value.HPgradDate !== undefined) {
          const now = new Date();
          if (now >= value.HPgradDate) {
            continue;
          }
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
      const member = allmembers.get(i)!
      return [member.memberName, member]
    }))
    return ret;
  }, [allmembers]);

  // 初期化処理
  useEffect(() => {
    console.log("initialize started")
    initializeAsync().then((params) => {
      const {groups, members} = params;
      setAllGroups(groups);
      setAllMembers(members);
    }).then(() => {
      console.log("initialize finished");
    });
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const result = search(groups, includeOG);
    setMembers(result);
  }, [groups, includeOG, search]);

  return {
    allgroups: allgroups,
    setGroups: setGroups,
    members: members,
    includeOG: includeOG,
    setIncludeOG: setIncludeOG
  }
}

export const nameRenderFunction = (member: MemberParsed):string => {
  return member.memberName;
}

export const profileRenderFunction = (member: MemberParsed):string[] => {
  const res:string[] = [
    `誕生日: ${formatDate(member.birthDate)}`,
    `H!P加入日: ${formatDate(member.HPjoinDate)}`,
    `デビュー日: ${member.debutDate ? formatDate(member.debutDate) : "N/A"}`,
  ];
  return res;
}