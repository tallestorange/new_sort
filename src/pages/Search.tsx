import Grid from "@material-ui/core/Grid";
import "../App.css";
import { TITLE, LATEST_CHANGE_LOG, PREF_SORT_MAP, SORT_PATH } from '../modules/Constants';
import SearchSelect from "../components/SearchSelect";
import SearchConfig, { CanVoteCheckBox, ResultText, SortStartButton } from "../components/SearchConfig";
import { InitialState, Member, SortSettings } from "../hooks/useNPDatabase";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { Group, GroupParsed, MemberParsed, fetchHPDBAsync } from "../hooks/useHPDatabase";

interface Props {
  initial_state: InitialState,
  can_vote_only: boolean;
  target_members_count: number;
  setMBTIs: (members: string[]) => void;
  setBirthPlaces: (members: string[]) => void;
  setHeights: (members: string[]) => void;
  setYears: (members: string[]) => void;
  setCanVote: (can_vote_only: boolean) => void;
}

export default function Search(props: Props) {
  const navigate = useNavigate();
  const sortConfig = useRef<SortSettings>({ show_hobby: false, show_skill: false, show_ranking: false });
  const onSortButtonClicked = useCallback(() => {
    navigate(`/${SORT_PATH}`, { state: sortConfig.current })
  }, [navigate]);
  const setSortSetting = useCallback((val: SortSettings) => {
    sortConfig.current = val;
  }, []);

  const [groups, setGroups] = useState<GroupParsed[]>([]);
  const [members, setMembers] = useState<Map<number, MemberParsed>>(new Map<number, MemberParsed>());

  useEffect(() => {
    fetchHPDBAsync().then((params) => {
      const {groups, members} = params;
      setGroups(groups);
      setMembers(members);
    });
  }, []);

  const onChanged = useCallback((v: GroupParsed[]) => {
    const result = new Set<number>();
    let count = 0;
    for (const [key, value] of members) {
      if (value.groups === undefined) {
        continue;
      }
      for (const group of value.groups) {
        if (result.has(key)) {
          break
        }
        for (const i of v) {
          if (i.groupID !== group.groupID) {
            continue;
          }
          count++;

          let from = i.formDate;
          let to = i.dissolveDate;
          let join = group.joinDate;
          let grad = group.gradDate;

          if (to !== undefined) {
            if (grad !== undefined) {
              if ((from! <= grad! && grad! <= to!) || (from! <= join! && join! <= to!) || (join! <= from! && to! <= grad!)) {
                result.add(key);
                break;
              }
            }
            else {
              if (join! <= to!) {
                result.add(key);
                break;
              }
            }
          }
          else {
            if (grad !== undefined) {
              if (from! <= grad!) {
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
    console.log(Array.from(result).map((v) => {return members.get(v)!}))
    // console.log(v, members);
  }, [members]);

  return (
    <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={2}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <h1>{TITLE}</h1>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p>{LATEST_CHANGE_LOG}</p>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect<GroupParsed>
            title="所属グループ"
            id="groups-belong"
            enabled={true}
            items={groups}
            default_selected={[]}
            title_convert_func={(a) => {return a.groupName}}
            on_render_func={(v) => { 
              v.sort((a, b) => { return a.groupID - b.groupID })
              return v.map((a) => { return a.groupName }).join(', ')
            }}
            onValueChanged={onChanged} />
        </Grid>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <SortStartButton enabled={props.target_members_count > 0} onClick={onSortButtonClicked} />
      </Grid>

      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p><a href="https://github.com/emolga587/hpsort2" target="_blank" rel="noopener noreferrer">ハロプロソート(updated)</a>ベースで開発しています</p>
      </Grid>
    </Grid>
  );
}