import HP_DB_MEMBERS from "../HP_DB/member.csv";
import HP_DB_JOIN from "../HP_DB/join.csv";
import HP_DB_GROUP from "../HP_DB/group.csv";
import { fetchCSVAsync } from "./useNPDatabase";
import { parse } from "date-fns";

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

interface GroupColor {
  groupID: string;
  colorCode: string;
}

export interface GroupParsed {
  groupID: number;
  groupName: string;
  formDate?: Date;
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

const parseDate = (dateString: string): Date | undefined => {
  if (dateString === "") {
    return undefined;
  }
  else {
    return parse(dateString, 'yyyy/MM/dd', new Date())
  }
}

export const fetchHPDBAsync = async (): Promise<{groups: GroupParsed[], members: Map<number, MemberParsed>}> => { // Map<string, MemberParsed>
  const members = await fetchCSVAsync<Member[]>(HP_DB_MEMBERS);
  const join = await fetchCSVAsync<Join[]>(HP_DB_JOIN);
  const group = await fetchCSVAsync<Group[]>(HP_DB_GROUP);

  const groupParsed: GroupParsed[] = group.map((v) => { return { groupID: v.groupID, groupName: v.groupName, formDate: parseDate(v.formDate), dissolveDate: parseDate(v.dissolveDate), isUnit: v.isUnit } })

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

  const groupMap: Map<number, {groupName: string, formDate: Date, dissolveDate?: Date, isUnit: string}[]> = new Map<number, {groupName: string, formDate: Date, dissolveDate?: Date, isUnit: string}[]>();
  for(const groupData of group) {
    if (!groupMap.has(groupData.groupID)) {
      groupMap.set(groupData.groupID, []);
    }
    groupMap.get(groupData.groupID)!.push({
      groupName: groupData.groupName,
      formDate: parseDate(groupData.formDate)!,
      dissolveDate: parseDate(groupData.dissolveDate),
      isUnit: groupData.isUnit})
  }
  // console.log(groupMap)
  // console.log(joinMap)
  group.sort((a, b) => (a.groupID - b.groupID));
  // console.log(group);
  // 77 ゆうかりん

  for(const key of Array.from( result.keys() )) {
    result.get(key)!.groups = joinMap.get(key)!
  }

  return {groups: groupParsed, members: result};
}