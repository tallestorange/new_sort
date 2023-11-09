import Grid from "@material-ui/core/Grid";
import "../App.css";
import { TITLE, LATEST_CHANGE_LOG, PREF_SORT_MAP } from '../modules/Constants';
import SearchSelect from "../components/SearchSelect";
import SearchConfig, { CanVoteCheckBox, ResultText, SortStartButton } from "../components/SearchConfig";
import { InitialState, SortSettings } from "../hooks/useNPDatabase";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

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
          <SearchSelect 
            title="MBTI"
            id="mbti"
            sort={true}
            enabled={props.initial_state.initial_mbtis.initialized && props.initial_state.current_mbtis.initialized}
            items={props.initial_state.initial_mbtis.items}
            default_selected={props.initial_state.current_mbtis.items}
            onValueChanged={props.setMBTIs} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="出身地"
            id="birthplace"
            sort={true}
            sortFunction={(a, b) => { return PREF_SORT_MAP.get(a)! - PREF_SORT_MAP.get(b)! }}
            enabled={props.initial_state.initial_birthplaces.initialized && props.initial_state.current_birthplaces.initialized}
            items={props.initial_state.initial_birthplaces.items}
            default_selected={props.initial_state.current_birthplaces.items}
            onValueChanged={props.setBirthPlaces} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="身長"
            id="height"
            sort={true}
            enabled={props.initial_state.initial_heights.initialized && props.initial_state.current_heights.initialized}
            items={props.initial_state.initial_heights.items}
            default_selected={props.initial_state.current_heights.items}
            onValueChanged={props.setHeights} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect
            title="生まれ年"
            id="birthyear"
            sort={true}
            enabled={props.initial_state.initial_birthyears.initialized && props.initial_state.current_birthyears.initialized}
            items={props.initial_state.initial_birthyears.items}
            default_selected={props.initial_state.current_birthyears.items}
            onValueChanged={props.setYears} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <ResultText count={props.target_members_count} />
        </Grid>
        <Grid>
          <CanVoteCheckBox canVote={props.can_vote_only} setCanVote={props.setCanVote} />
          <SearchConfig onSortSettingsUpdated={(val) => { sortConfig.current = val }} />
        </Grid>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <SortStartButton enabled={props.target_members_count > 0} onClick={() => {navigate('/sort', { state: sortConfig.current })}} />
      </Grid>

      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p><a href="https://github.com/emolga587/hpsort2" target="_blank" rel="noopener noreferrer">ハロプロソート(updated)</a>ベースで開発しています</p>
      </Grid>
    </Grid>
  );
}