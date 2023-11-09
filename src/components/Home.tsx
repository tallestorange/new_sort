import Grid from "@material-ui/core/Grid";
import "../App.css";
import { TITLE, BOARDER, SORT_PATH } from './Constants';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import SearchSelect from "./SearchSelect";
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import React from "react";
import SearchConfig from "./SearchConfig";
import { InitialState } from "../hooks/useNPDatabase";


interface Props {
  initial_state: InitialState,
  can_vote_only: boolean;
  target_members_count: number;
  setMBTIs: (members: string[]) => void;
  setBirthPlaces: (members: string[]) => void;
  setHeights: (members: string[]) => void;
  setYears: (members: string[]) => void;
  setCanVote: (can_vote_only: boolean) => void;
  onSortSettingsUpdated: (settings: SortSettings) => void;
}

export interface SortSettings {
  show_hobby: boolean;
  show_skill: boolean;
  show_ranking: boolean;
}

const CanVoteCheckBox = React.memo((props: { canVote: boolean, setCanVote: (canVote: boolean) => void }) => {
  return (
    <FormGroup>
      <FormControlLabel id="checkbox-form-vote" control={<Checkbox checked={props.canVote} id="checkbox-vote" onChange={(event) => { props.setCanVote(event.target.checked) }} />} label={`投票対象(〜${BOARDER}位)のみ`} />
    </FormGroup>
  )
}, (before, after) => {
  return before.canVote === after.canVote
})

const ResultText = React.memo((props: { count: number }) => {
  return (
    <Typography variant="h6" component="h2">
      該当者: {props.count}名
    </Typography>
  )
});

const SortStartButton = React.memo((props: { enabled: boolean }) => {
  return (
    <Button
      to={SORT_PATH}
      component={Link}
      disabled={!props.enabled}
      color="secondary"
    >
      ソート開始
    </Button>
  )
});

export default function Home(props: Props) {
  return (
    <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={2}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <h1>{TITLE}</h1>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p>(最終更新:23/11/9 描画処理の最適化)</p>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect 
            title="MBTI" 
            id="mbti" 
            sort={true}
            items={props.initial_state.initial_mbtis.items}
            default_selected={props.initial_state.current_mbtis.items} 
            onValueChanged={props.setMBTIs} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect 
            title="出身地" 
            id="birthplace" 
            sort={false}
            items={props.initial_state.initial_birthplaces.items}
            default_selected={props.initial_state.current_birthplaces.items} 
            onValueChanged={props.setBirthPlaces} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect 
            title="身長"
            id="height" 
            sort={true} 
            items={props.initial_state.initial_heights.items}
            default_selected={props.initial_state.current_heights.items}
            onValueChanged={props.setHeights} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect 
            title="生まれ年" 
            id="birthyear" 
            sort={true} 
            items={props.initial_state.initial_birthyears.items} 
            default_selected={props.initial_state.current_birthyears.items} 
            onValueChanged={props.setYears} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <ResultText count={props.target_members_count} />
        </Grid>
        <Grid>
          <CanVoteCheckBox canVote={props.can_vote_only} setCanVote={props.setCanVote} />
          <SearchConfig onSortSettingsUpdated={props.onSortSettingsUpdated} />
        </Grid>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <SortStartButton enabled={props.target_members_count > 0} />
      </Grid>

      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p><a href="https://github.com/emolga587/hpsort2">ハロプロソート(updated)</a>ベースで開発しています</p>
      </Grid>
    </Grid>
  );
}