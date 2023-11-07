import Grid from "@material-ui/core/Grid";
import "../App.css";
import { TITLE, BOARDER, SORT_PATH } from './Constants';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import SearchSelect from "./SearchSelect";
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { SearchParams } from "../hooks/useNPDatabase";
import useNPSearch from "../hooks/useNPSearch";
import SearchConfig from "./SearchConfig";
import React from "react";

interface Props {
  onMemberUpdated?: (members: string[]) => void;
  onSortSettingsUpdated?: (setting: SortSetting) => void;
  initial_params: SearchParams,
  current_params: SearchParams
}

export interface SortSetting {
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
})

const ResultText = React.memo((props: { count: number }) => {
  return (
    <Typography variant="h6" component="h2">
      該当者: {props.count}名
    </Typography>
  )
});

export default function Home(props: Props) {
  const {members, setMBTIs, setBirthPlaces, setHeights, setYears, canVote, setCanVote} = useNPSearch(props.current_params);

  useEffect(() => {
    props.onMemberUpdated?.(members);
    // eslint-disable-next-line
  }, [members])

  useEffect(() => {
    console.log("笠原桃奈さん1位おめでとうございます!!");
  }, [])

  return (
    <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={3}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <h1>{TITLE}</h1>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p>(最終更新:23/11/7 余計な再描画処理の抑制)</p>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect title="MBTI" id="mbti" sort={true} items={props.initial_params.mbtis} default_selected={props.current_params.mbtis} onSubmit={setMBTIs} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect title="出身地" id="birthplace" sort={false} items={props.initial_params.birthplaces} default_selected={props.current_params.birthplaces} onSubmit={setBirthPlaces} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect title="身長" id="height" sort={true} items={props.initial_params.heights} default_selected={props.current_params.heights} onSubmit={setHeights} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect title="生まれ年" id="birthyear" sort={true} items={props.initial_params.birthyears} default_selected={props.current_params.birthyears} onSubmit={setYears} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <ResultText count={members.length} />
        </Grid>
        <Grid>
          <CanVoteCheckBox canVote={canVote} setCanVote={setCanVote} />
          <FormGroup>
            <SearchConfig onSortSettingsUpdated={(config) => props.onSortSettingsUpdated?.(config)} />
          </FormGroup>
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <Button
            to={SORT_PATH}
            component={Link}
            disabled={members.length === 0}
            color="secondary"
          >
            ソート開始
          </Button>
        </Grid>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p><a href="https://github.com/emolga587/hpsort2">ハロプロソート(updated)</a>ベースで開発しています</p>
      </Grid>
    </Grid>
  );
}